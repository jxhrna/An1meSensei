import { NextRequest, NextResponse } from "next/server"
import https from "https"
import http from "http"

export const dynamic = "force-dynamic"

async function fetchWithInsecureSSL(url: string, referer: string, userAgent?: string): Promise<{ data: Buffer; contentType: string; statusCode: number }> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const isHttps = parsedUrl.protocol === "https:"

    const headers: Record<string, string> = {
      "User-Agent": referer.includes("kwik") ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "*/*",
    }

    if (referer) {
      headers["Referer"] = referer
      try {
        headers["Origin"] = new URL(referer).origin
      } catch {}
    }

    if (userAgent) {
      headers["User-Agent"] = userAgent;
    }

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers,
      ...(isHttps ? { rejectUnauthorized: false } : {}),
    }

    const client = isHttps ? https : http

    const req = client.request(options, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchWithInsecureSSL(res.headers.location, referer, userAgent).then(resolve).catch(reject)
        return
      }

      const chunks: Buffer[] = []
      res.on("data", (chunk) => chunks.push(chunk))
      res.on("end", () => {
        resolve({
          data: Buffer.concat(chunks),
          contentType: res.headers["content-type"] || "application/octet-stream",
          statusCode: res.statusCode || 200
        })
      })
    })

    req.on("error", reject)
    req.setTimeout(15000, () => {
      req.destroy(new Error("Request timed out"))
    })
    req.end()
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  const referer = searchParams.get("referer") || ""
  const clientUserAgent = request.headers.get("user-agent") || ""

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    const { data, contentType, statusCode } = await fetchWithInsecureSSL(url, referer, clientUserAgent)

    if (statusCode >= 400) {
      console.error(`Proxy upstream error ${statusCode} for URL: ${url}`)
      // Pass the error upstream to help Hls.js handle it
      return new NextResponse(data as any, {
        status: statusCode,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
        }
      })
    }

    // If it's an M3U8 playlist, rewrite relative URLs to also go through our proxy
    if (contentType.includes("mpegurl") || contentType.includes("m3u8") || url.endsWith(".m3u8")) {
      let text = data.toString("utf-8")

      // Get the base URL for resolving relative paths
      const baseUrl = url.substring(0, url.lastIndexOf("/") + 1)

      // Rewrite AES-128 encryption key URIs (critical for encrypted streams)
      text = text.replace(
        /#EXT-X-KEY:METHOD=AES-128,URI="([^"]+)"/g,
        (_match, keyUrl) => {
          const absoluteKeyUrl = keyUrl.startsWith("http") ? keyUrl : baseUrl + keyUrl
          return `#EXT-X-KEY:METHOD=AES-128,URI="/api/proxy?url=${encodeURIComponent(absoluteKeyUrl)}&referer=${encodeURIComponent(referer)}"`
        }
      )

      // Rewrite all non-comment lines that look like segment/playlist URLs
      text = text.replace(/^(?!#)(\S+)$/gm, (match) => {
        if (!match.trim()) return match
        const absoluteUrl = match.startsWith("http") ? match : baseUrl + match
        return `/api/proxy?url=${encodeURIComponent(absoluteUrl)}&referer=${encodeURIComponent(referer)}`
      })

      return new NextResponse(text, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      })
    }

    // For .ts segments and other binary data
    return new NextResponse(data as any, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    })
  } catch (error: any) {
    console.error("Proxy error:", error.message)
    return NextResponse.json({ error: "Proxy failed", details: error.message }, { status: 502 })
  }
}

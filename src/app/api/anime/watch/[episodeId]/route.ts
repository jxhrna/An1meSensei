import { NextRequest, NextResponse } from "next/server"
import { ANIME } from "@consumet/extensions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  const { episodeId } = await params
  const { searchParams } = new URL(request.url)
  const isDub = searchParams.get("dub") === "true"

  try {
    const kai = new ANIME.AnimeKai()
    const pahe = new ANIME.AnimePahe()

    // Parse the AnimeKai episode ID to get the anime slug and episode number
    const parts = episodeId.split("$")
    const slug = parts[0]
    const epStr = parts.find((p) => p.startsWith("ep="))?.split("=")[1] || "1"
    const epNum = parseInt(epStr)

    // 1. Get real title from AnimeKai
    const kaiInfo = await kai.fetchAnimeInfo(slug)
    const titleObj = kaiInfo.title

    if (!titleObj) {
      throw new Error("Could not find anime title")
    }

    const titleStr = typeof titleObj === 'string' 
      ? titleObj 
      : (titleObj as any).romaji || (titleObj as any).english || (titleObj as any).native;

    // 2. Search AnimePahe for the title
    const paheSearch = await pahe.search(titleStr)
    if (!paheSearch.results || paheSearch.results.length === 0) {
      throw new Error("Anime not found on stream provider")
    }

    // Use the first result (most relevant)
    const paheId = paheSearch.results[0].id

    // 3. Get AnimePahe info to find the right episode ID
    const paheInfo = await pahe.fetchAnimeInfo(paheId)
    const paheEp = paheInfo.episodes?.find((e: any) => e.number === epNum)

    if (!paheEp) {
      throw new Error(`Episode ${epNum} not found on stream provider`)
    }

    // 4. Fetch the stream sources from AnimePahe
    const sources = await pahe.fetchEpisodeSources(paheEp.id)

    // Optional: filter for dub if requested (AnimePahe doesn't strictly separate by sub/dub in the source API without passing it sometimes, but we return whatever we have)
    return NextResponse.json(sources)
  } catch (error: any) {
    console.error("Anime hybrid streaming error:", error)
    return NextResponse.json(
      { error: "Failed to fetch streaming sources", details: error?.message || error },
      { status: 500 }
    )
  }
}

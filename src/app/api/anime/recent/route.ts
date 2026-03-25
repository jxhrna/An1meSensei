import { NextRequest, NextResponse } from "next/server"
import { getAnimeProvider } from "@/lib/gogoanime"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")

  try {
    const provider = getAnimeProvider()
    const results = await provider.fetchRecentlyUpdated()
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Recent episodes error:", error)
    return NextResponse.json({ error: "Failed to fetch recent episodes", details: error?.message }, { status: 500 })
  }
}

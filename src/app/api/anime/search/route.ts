import { NextRequest, NextResponse } from "next/server"
import { searchAnime } from "@/lib/anime-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Missing search query" }, { status: 400 })
  }

  try {
    const results = await searchAnime(query)
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Anime search error:", error)
    return NextResponse.json({ error: "Failed to search anime", details: error?.message }, { status: 500 })
  }
}

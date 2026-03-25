import { NextRequest, NextResponse } from "next/server"
import { getAnimeProvider } from "@/lib/gogoanime"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")

  try {
    const provider = getAnimeProvider()
    const results = await provider.fetchSpotlight()
    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Top airing error:", error)
    return NextResponse.json({ error: "Failed to fetch top airing", details: error?.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getAnimeProvider } from "@/lib/gogoanime"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const provider = getAnimeProvider()
    const info = await provider.fetchAnimeInfo(id)
    return NextResponse.json(info)
  } catch (error: any) {
    console.error("Anime info error:", error)
    return NextResponse.json({ error: "Failed to fetch anime info", details: error?.message }, { status: 500 })
  }
}

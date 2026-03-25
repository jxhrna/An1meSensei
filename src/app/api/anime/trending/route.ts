import { NextResponse } from "next/server"
import { getTrending } from "@/lib/anime-data"

export async function GET() {
  try {
    const results = await getTrending()
    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch trending", details: error?.message }, { status: 500 })
  }
}

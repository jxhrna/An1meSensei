"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AnimeCard from "./AnimeCard"
import type { AnimeData } from "@/lib/constants"

interface HorizontalScrollerProps {
  title: string
  subtitle?: string
  anime: AnimeData[]
  variant?: "default" | "large" | "compact"
}

export default function HorizontalScroller({
  title,
  subtitle,
  anime,
  variant = "default",
}: HorizontalScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" })
    }
  }

  if (!anime.length) return null

  return (
    <section className="relative group/section py-4">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 opacity-0 group-hover/section:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
      >
        {anime.map((item, i) => (
          <div key={item.id} className="flex-shrink-0">
            <AnimeCard anime={item} index={i} variant={variant} />
          </div>
        ))}
      </div>
    </section>
  )
}

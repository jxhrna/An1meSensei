"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Star, Info, ChevronLeft, ChevronRight } from "lucide-react"
import type { AnimeData } from "@/lib/constants"

interface HeroBannerProps {
  anime: AnimeData[]
}

export default function HeroBanner({ anime }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % anime.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [anime.length])

  const item = anime[current]
  if (!item) return null

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={item.coverArt}
            alt={item.title}
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.09_0.005_270)] via-transparent to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24 md:pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Genres */}
              <div className="flex items-center gap-2 mb-3">
                {item.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 font-medium border border-white/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                {item.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="font-semibold text-yellow-400">{item.averageScore.toFixed(1)}</span>
                </div>
                <span>{item.releaseYear}</span>
                <span>{item.epCount} Episodes</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-medium">
                  {item.rating}
                </span>
              </div>

              {/* Synopsis */}
              <p className="text-sm md:text-base text-white/60 line-clamp-3 mb-6 leading-relaxed">
                {item.synopsis}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/anime/${item.id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[oklch(0.65_0.25_280)]/30"
                >
                  <Play className="w-5 h-5" fill="white" />
                  Watch Now
                </Link>
                <Link
                  href={`/anime/${item.id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/15 transition-colors border border-white/10"
                >
                  <Info className="w-5 h-5" />
                  Details
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Controls */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3">
        <button
          onClick={() => setCurrent((prev) => (prev - 1 + anime.length) % anime.length)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5">
          {anime.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)]"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % anime.length)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

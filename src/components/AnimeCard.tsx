"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Play } from "lucide-react"
import type { AnimeData } from "@/lib/constants"

interface AnimeCardProps {
  anime: AnimeData
  index?: number
  variant?: "default" | "large" | "compact"
}

export default function AnimeCard({ anime, index = 0, variant = "default" }: AnimeCardProps) {
  const isLarge = variant === "large"
  const isCompact = variant === "compact"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        href={`/anime/${anime.id}`}
        className={`group relative block rounded-2xl overflow-hidden ${
          isLarge ? "w-[280px] md:w-[320px]" : isCompact ? "w-[150px] md:w-[180px]" : "w-[200px] md:w-[240px]"
        }`}
      >
        {/* Poster */}
        <div
          className={`relative overflow-hidden rounded-2xl ${
            isLarge ? "aspect-[2/3]" : isCompact ? "aspect-[3/4]" : "aspect-[2/3]"
          }`}
        >
          <Image
            src={anime.coverArt}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes={isLarge ? "320px" : isCompact ? "180px" : "240px"}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
            >
              <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
            </motion.div>
          </div>

          {/* Score Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-xs font-semibold">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-yellow-400">{anime.averageScore.toFixed(1)}</span>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className={`font-bold text-white leading-tight line-clamp-2 ${
              isCompact ? "text-xs" : "text-sm"
            }`}>
              {anime.title}
            </h3>
            {!isCompact && (
              <div className="flex items-center gap-2 mt-1.5">
                {anime.genres.slice(0, 2).map((genre) => (
                  <span
                    key={genre}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

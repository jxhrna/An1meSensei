"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Zap, Heart } from "lucide-react"
import HorizontalScroller from "@/components/HorizontalScroller"
import AnimeCard from "@/components/AnimeCard"
import type { AnimeData } from "@/lib/constants"

export default function RecommendationsPage() {
  const [trending, setTrending] = useState<AnimeData[]>([])
  const [actionPicks, setActionPicks] = useState<AnimeData[]>([])
  const [dramaGems, setDramaGems] = useState<AnimeData[]>([])
  const [becauseYouWatched, setBecauseYouWatched] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/anime/trending')
      .then(r => r.json())
      .then((data: AnimeData[]) => {
        setTrending(data || [])
        setActionPicks(data.filter(a => a.genres?.includes("Action")).slice(0, 8) || [])
        setDramaGems(data.filter(a => a.genres?.includes("Drama")).slice(0, 8) || [])
        setBecauseYouWatched([
          { source: "Attack on Titan", recommendations: data.slice(0, 5) || [] },
          { source: "Steins;Gate", recommendations: data.slice(5, 10) || [] },
        ])
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground">For You</h1>
            </div>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            AI-powered recommendations based on your taste
          </p>
        </motion.div>

        {/* Personalized Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[oklch(0.65_0.25_280)]/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[oklch(0.75_0.2_180)]/15 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold text-foreground">Top Picks For You</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Handpicked based on your viewing history and ratings</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trending.slice(0, 5).map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Because You Watched */}
        {becauseYouWatched.map(({ source, recommendations }) => (
          <div key={source} className="mb-2">
            <HorizontalScroller
              title={`Because you watched ${source}`}
              subtitle="Similar anime you might enjoy"
              anime={recommendations}
            />
          </div>
        ))}

        {/* Trending */}
        <HorizontalScroller
          title="🔥 Trending This Week"
          subtitle="Popular across the community"
          anime={trending}
          variant="large"
        />

        {/* Genre-Based */}
        <HorizontalScroller
          title="⚔️ Action Picks"
          subtitle="High-energy action recommendations"
          anime={actionPicks}
        />

        <HorizontalScroller
          title="🎭 Drama Gems"
          subtitle="Emotionally captivating stories"
          anime={dramaGems}
        />

        {/* Explore more CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground mb-4">Want more personalized suggestions?</p>
          <a
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            <Heart className="w-4 h-4" />
            Rate more anime to improve recommendations
          </a>
        </motion.div>
      </div>
    </div>
  )
}

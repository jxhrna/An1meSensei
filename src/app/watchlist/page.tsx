"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Eye, Clock, CheckCircle2, XCircle, Heart, ChevronDown, ArrowUpDown, Trash2 } from "lucide-react"
import type { AnimeData } from "@/lib/constants"

type ListType = "watching" | "plan" | "completed" | "dropped" | "favorites"

const listConfig: Record<ListType, { label: string; icon: typeof Eye; color: string }> = {
  watching: { label: "Watching", icon: Eye, color: "text-green-400" },
  plan: { label: "Plan to Watch", icon: Clock, color: "text-blue-400" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-purple-400" },
  dropped: { label: "Dropped", icon: XCircle, color: "text-red-400" },
  favorites: { label: "Favorites", icon: Heart, color: "text-pink-400" },
}

export default function WatchlistPage() {
  const [activeList, setActiveList] = useState<ListType>("watching")
  const [mockLists, setMockLists] = useState<Record<ListType, AnimeData[]>>({
    watching: [], plan: [], completed: [], dropped: [], favorites: []
  })

  useEffect(() => {
    fetch('/api/anime/trending')
      .then(r => r.json())
      .then((data: AnimeData[]) => {
        setMockLists({
          watching: data.slice(0, 3),
          plan: data.slice(3, 7),
          completed: data.slice(7, 12),
          dropped: data.slice(12, 13),
          favorites: data.slice(0, 5),
        })
      })
      .catch(console.error)
  }, [])

  const currentAnime = mockLists[activeList]

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">My Lists</h1>
          <p className="text-muted-foreground mb-8">Organize and track your anime journey</p>
        </motion.div>

        {/* List Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(listConfig) as ListType[]).map((key) => {
            const config = listConfig[key]
            const count = mockLists[key].length
            return (
              <button
                key={key}
                onClick={() => setActiveList(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeList === key
                    ? "bg-white/10 text-white border border-white/10"
                    : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10"
                }`}
              >
                <config.icon className={`w-4 h-4 ${activeList === key ? config.color : ""}`} />
                {config.label}
                <span className="text-xs opacity-60">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Anime List */}
        <motion.div
          key={activeList}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {currentAnime.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📋</p>
              <h3 className="text-lg font-semibold text-foreground mb-2">This list is empty</h3>
              <p className="text-sm text-muted-foreground mb-4">Start adding anime to your {listConfig[activeList].label} list</p>
              <Link href="/browse" className="inline-flex px-5 py-2.5 rounded-xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors">
                Browse Anime
              </Link>
            </div>
          ) : (
            currentAnime.map((anime, i) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-colors group"
              >
                {/* Poster */}
                <Link href={`/anime/${anime.id}`} className="flex-shrink-0">
                  <div className="w-16 h-24 rounded-xl overflow-hidden relative">
                    <Image src={anime.coverArt} alt={anime.title} fill className="object-cover" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/anime/${anime.id}`}>
                    <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate">{anime.title}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{anime.studio} • {anime.releaseYear} • {anime.epCount} eps</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {anime.genres.slice(0, 3).map((g) => (
                      <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{g}</span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-xl font-bold text-foreground">{anime.averageScore.toFixed(1)}</span>
                  <span className="text-[10px] text-muted-foreground">SCORE</span>
                </div>

                {/* List Dropdown */}
                <div className="relative flex-shrink-0">
                  <select
                    defaultValue={activeList}
                    className="appearance-none px-3 py-2 pr-8 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
                  >
                    {(Object.keys(listConfig) as ListType[]).map((key) => (
                      <option key={key} value={key}>{listConfig[key].label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>

                {/* Remove */}
                <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}

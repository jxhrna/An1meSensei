"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  Calendar,
  BarChart3,
  Star,
  Clock,
  Film,
  Heart,
  Settings,
  BookmarkCheck,
  Eye,
} from "lucide-react"
import AnimeCard from "@/components/AnimeCard"
import type { AnimeData } from "@/lib/constants"

// Mock user data
const userData = {
  name: "AnimeLover42",
  avatar: "🎭",
  bio: "Just a weeb discovering hidden gems. Always looking for the next great adventure anime.",
  joinDate: "March 2024",
  stats: {
    animeWatched: 142,
    episodesWatched: 2847,
    hoursWatched: 948,
    avgScore: 7.8,
  },
  favoriteGenres: ["Action", "Fantasy", "Drama", "Thriller"],
  recentActivity: [
    { type: "watched", anime: "Frieren: Beyond Journey's End", ep: "Episode 12", time: "2 hours ago" },
    { type: "rated", anime: "Attack on Titan", rating: 9, time: "Yesterday" },
    { type: "added", anime: "Chainsaw Man", list: "Plan to Watch", time: "3 days ago" },
    { type: "completed", anime: "Steins;Gate", time: "1 week ago" },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "lists">("overview")

  const [watchHistory, setWatchHistory] = useState<AnimeData[]>([])
  const [favorites, setFavorites] = useState<AnimeData[]>([])

  useEffect(() => {
    fetch('/api/anime/trending')
      .then(r => r.json())
      .then((data: AnimeData[]) => {
        setWatchHistory(data.slice(0, 6) || [])
        setFavorites(data.slice(0, 4) || [])
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8 relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[oklch(0.65_0.25_280)]/10 to-transparent rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] flex items-center justify-center text-5xl shadow-2xl">
              {userData.avatar}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-1">{userData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Calendar className="w-4 h-4" />
                Joined {userData.joinDate}
              </div>
              <p className="text-sm text-foreground/70 max-w-xl mb-4">{userData.bio}</p>

              {/* Fav Genres */}
              <div className="flex flex-wrap gap-2">
                {userData.favoriteGenres.map((g) => (
                  <span key={g} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Button */}
            <button className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Anime Watched", value: userData.stats.animeWatched, icon: Eye, color: "from-violet-500/20 to-violet-600/5" },
            { label: "Episodes", value: userData.stats.episodesWatched.toLocaleString(), icon: Film, color: "from-cyan-500/20 to-cyan-600/5" },
            { label: "Hours Watched", value: userData.stats.hoursWatched, icon: Clock, color: "from-pink-500/20 to-pink-600/5" },
            { label: "Avg Score", value: userData.stats.avgScore, icon: Star, color: "from-yellow-500/20 to-yellow-600/5" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-2xl p-5 bg-gradient-to-br ${stat.color}`}
            >
              <stat.icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {(["overview", "history", "lists"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                activeTab === tab ? "bg-white/10 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {userData.recentActivity.map((activity, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.type === "watched" ? "bg-green-500/10 text-green-400" :
                      activity.type === "rated" ? "bg-yellow-500/10 text-yellow-400" :
                      activity.type === "completed" ? "bg-blue-500/10 text-blue-400" :
                      "bg-purple-500/10 text-purple-400"
                    }`}>
                      {activity.type === "watched" ? <Eye className="w-5 h-5" /> :
                       activity.type === "rated" ? <Star className="w-5 h-5" /> :
                       activity.type === "completed" ? <BookmarkCheck className="w-5 h-5" /> :
                       <Heart className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="capitalize font-medium">{activity.type}</span>{" "}
                        <span className="text-primary">{activity.anime}</span>
                        {activity.ep && <span className="text-muted-foreground"> - {activity.ep}</span>}
                        {activity.rating && <span className="text-yellow-400"> ⭐ {activity.rating}/10</span>}
                        {activity.list && <span className="text-muted-foreground"> → {activity.list}</span>}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-4">Favorites</h2>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {favorites.map((anime, i) => (
                  <div key={anime.id} className="flex-shrink-0">
                    <AnimeCard anime={anime} index={i} variant="compact" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchHistory.map((anime, i) => <AnimeCard key={anime.id} anime={anime} index={i} />)}
            </div>
          </motion.div>
        )}

        {activeTab === "lists" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {["Watching", "Plan to Watch", "Completed", "Dropped", "Favorites"].map((list) => (
              <Link
                key={list}
                href="/watchlist"
                className="glass-card rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookmarkCheck className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{list}</span>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {Math.floor(Math.random() * 20 + 1)} anime →
                </span>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

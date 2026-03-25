"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Star,
  Play,
  BookmarkPlus,
  Calendar,
  Film,
  Building2,
  Heart,
  MessageCircle,
  ChevronRight,
  Loader2,
} from "lucide-react"
import AnimeCard from "@/components/AnimeCard"
import type { AnimeData } from "@/lib/constants"

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const [anime, setAnime] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [similar, setSimilar] = useState<AnimeData[]>([])

  const [activeTab, setActiveTab] = useState<"episodes" | "comments" | "details">("episodes")
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
    { id: "c1", user: "NarutoFan99", avatar: "🦊", content: "This anime is absolutely incredible! The character development is top-notch.", likes: 24, time: "2 days ago" },
    { id: "c2", user: "SakuraBloom", avatar: "🌸", content: "The animation quality keeps getting better each season. Studio really outdid themselves.", likes: 18, time: "5 days ago" },
  ])

  useEffect(() => {
    setLoading(true)
    // Fetch Anime Info
    fetch(`/api/anime/info/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        setAnime(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })

    // Fetch Similar (Trending for now)
    fetch("/api/anime/trending")
      .then(res => res.json())
      .then(data => setSimilar(data.slice(0, 10) || []))
      .catch(console.error)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading Anime Details...</p>
        </div>
      </div>
    )
  }

  if (!anime || anime.error) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Anime Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't fetch data for this anime.</p>
          <Link href="/" className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">Go Home</Link>
        </div>
      </div>
    )
  }

  const episodes = anime.episodes || []

  // Ensure arrays/strings are safely handled since API structure might vary
  const genres = anime.genres || []
  const synopsis = anime.description || "No description available."
  const coverArt = anime.image || anime.cover || "https://placehold.co/400x600/1a1a1a/FFF"
  const title = anime.title || "Unknown Title"
  const releaseYear = anime.releaseDate || "?"
  const studio = anime.studio || "Unknown Studio"
  const quality = anime.quality || "HD"
  const averageScore = 8.5 // Mock for AnimeKai

  const handleComment = () => {
    if (!comment.trim()) return
    setComments((prev) => [
      {
        id: `c-${Date.now()}`,
        user: "Guest User",
        avatar: "👤",
        content: comment,
        likes: 0,
        time: "Just now",
      },
      ...prev,
    ])
    setComment("")
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative w-full h-[50vh] md:h-[65vh]">
        <Image src={coverArt} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.09_0.005_270)] via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row gap-8"
            >
              <div className="hidden md:block flex-shrink-0 w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <Image src={coverArt} alt={title} width={208} height={312} className="w-full h-auto object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {genres.map((genre: string) => (
                    <span key={genre} className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 font-medium border border-white/10">
                      {genre}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white mb-4">{title}</h1>

                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                    <span className="font-semibold text-yellow-400">{averageScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />{releaseYear}</div>
                  <div className="flex items-center gap-1"><Film className="w-4 h-4" />{anime.totalEpisodes || episodes.length} Episodes</div>
                  <div className="flex items-center gap-1"><Building2 className="w-4 h-4" />{studio}</div>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-medium uppercase">{quality}</span>
                  {anime.type && <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-medium uppercase">{anime.type}</span>}
                </div>

                <p className="text-sm text-white/60 leading-relaxed max-w-2xl mb-6 line-clamp-3 md:line-clamp-none">
                  {synopsis}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {episodes.length > 0 ? (
                    <Link
                      href={`/watch/${id}?gogoId=${encodeURIComponent(episodes[0].id)}&ep=${episodes[0].number}`}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[oklch(0.65_0.25_280)]/30"
                    >
                      <Play className="w-5 h-5" fill="white" /> Watch Episode 1
                    </Link>
                  ) : null}
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm hover:bg-white/15 transition-colors border border-white/10">
                    <BookmarkPlus className="w-5 h-5" /> Add to List
                  </button>
                  <button className="p-3 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/15 transition-colors border border-white/10">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Rating */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Your Rating</h3>
          <div className="flex items-center gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setUserRating(i + 1)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    (hoverRating || userRating) > i ? "text-yellow-400" : "text-white/20"
                  }`}
                  fill={(hoverRating || userRating) > i ? "currentColor" : "none"}
                />
              </button>
            ))}
            {userRating > 0 && (
              <span className="ml-3 text-sm text-muted-foreground">
                You rated this <span className="text-yellow-400 font-bold">{userRating}/10</span>
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          {(["episodes", "comments", "details"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                activeTab === tab ? "bg-white/10 text-white" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {tab === "episodes" && episodes.length > 0 && (
                <span className="ml-1.5 text-xs opacity-60">({episodes.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "episodes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {episodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {episodes.map((ep: any) => (
                  <Link
                    key={ep.id}
                    href={`/watch/${id}?gogoId=${encodeURIComponent(ep.id)}&ep=${ep.number}`}
                    className="group flex items-center gap-4 p-4 rounded-xl glass-card hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.25_280)]/20 to-transparent flex items-center justify-center flex-shrink-0">
                      <Play className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{ep.title || `Episode ${ep.number}`}</p>
                      <p className="text-xs text-muted-foreground">Streaming</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">📺</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">No episodes found</h3>
                <p className="text-sm text-muted-foreground">Episodes will appear here when available.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "comments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this anime..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[80px]"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Post Comment
                </button>
              </div>
            </div>
            {comments.map((c) => (
              <div key={c.id} className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg flex-shrink-0">{c.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">{c.user}</span>
                      <span className="text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "details" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Status</h3><p className="text-foreground font-medium">{anime.status || 'Unknown'}</p></div>
              <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Studio</h3><p className="text-foreground font-medium">{studio}</p></div>
              <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Year</h3><p className="text-foreground font-medium">{releaseYear}</p></div>
              <div><h3 className="text-sm font-semibold text-muted-foreground mb-1">Rating</h3><p className="text-foreground font-medium">{quality}</p></div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {genres.map((g: string) => (
                    <span key={g} className="text-xs px-3 py-1 rounded-full bg-white/10 text-foreground/80 font-medium">{g}</span>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Synopsis</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{synopsis}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Similar Anime */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground mb-4">You Might Also Like</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
              {similar.map((a, i) => (
                <div key={a.id} className="flex-shrink-0">
                  <AnimeCard anime={a} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, Clock, Sparkles } from "lucide-react"
import AnimeCard from "@/components/AnimeCard"
import { AnimeData } from "@/lib/constants"

const popularSearches = ["Action", "Romance", "MAPPA", "2023", "Fantasy", "Thriller", "Isekai", "Mecha"]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<AnimeData[]>([])
  const [trending, setTrending] = useState<AnimeData[]>([])

  useEffect(() => {
    fetch("/api/anime/trending")
      .then(res => res.json())
      .then(data => setTrending(data.slice(0, 6) || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      fetch(`/api/anime/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => setResults(data.slice(0, 18) || []))
        .catch(console.error)
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-foreground text-center mb-6">
            Search <span className="text-gradient">Anime</span>
          </h1>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anime..."
              autoFocus
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Popular searches */}
          {!query && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full bg-white/5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all border border-white/5"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results or Trending */}
        {query ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">{results.length} results for &ldquo;{query}&rdquo;</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime, i) => <AnimeCard key={anime.id} anime={anime} index={i} />)}
            </div>
            {results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">😅</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Trending</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trending.map((anime, i) => <AnimeCard key={anime.id} anime={anime} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

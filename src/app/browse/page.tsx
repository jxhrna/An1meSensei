"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X, SlidersHorizontal, Loader2 } from "lucide-react"
import AnimeCard from "@/components/AnimeCard"
import { AnimeData, allGenres, allStudios, allYears } from "@/lib/constants"

export default function BrowsePage() {
  const [query, setQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedYear, setSelectedYear] = useState<number | undefined>()
  const [selectedStudio, setSelectedStudio] = useState("")
  const [minScore, setMinScore] = useState<number | undefined>()
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<AnimeData[]>([])
  const [loading, setLoading] = useState(true)

  const hasFilters = selectedGenre || selectedYear || selectedStudio || minScore

  const clearFilters = () => {
    setSelectedGenre("")
    setSelectedYear(undefined)
    setSelectedStudio("")
    setMinScore(undefined)
  }

  // Fetch initial trending data, or search data if query/filters exist
  useEffect(() => {
    setLoading(true)
    const fetchUrl = query
      ? `/api/anime/search?q=${encodeURIComponent(query)}`
      : `/api/anime/trending`

    const timer = setTimeout(() => {
      fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
          let filtered = data || []
          
          if (selectedGenre) {
            filtered = filtered.filter((a: AnimeData) => a.genres?.includes(selectedGenre))
          }
          if (selectedYear) {
            filtered = filtered.filter((a: AnimeData) => a.releaseYear == selectedYear)
          }
          if (selectedStudio) {
            filtered = filtered.filter((a: AnimeData) => a.studio === selectedStudio)
          }
          if (minScore) {
            filtered = filtered.filter((a: AnimeData) => a.averageScore >= minScore)
          }

          setResults(filtered)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }, 500)

    return () => clearTimeout(timer)
  }, [query, selectedGenre, selectedYear, selectedStudio, minScore])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Browse Anime</h1>
          <p className="text-muted-foreground">Discover your next favorite anime</p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime by title, genre, studio..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium transition-all ${
              showFilters
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-white/5 text-muted-foreground hover:text-foreground border border-white/10"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-card rounded-2xl p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Filters</h3>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Genre */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Genres</option>
                  {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Year</label>
                <select
                  value={selectedYear || ""}
                  onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Years</option>
                  {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {/* Studio */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Studio</label>
                <select
                  value={selectedStudio}
                  onChange={(e) => setSelectedStudio(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">All Studios</option>
                  {allStudios.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Min Score */}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Min Score</label>
                <select
                  value={minScore || ""}
                  onChange={(e) => setMinScore(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">Any Score</option>
                  {[9, 8.5, 8, 7.5, 7].map((s) => (
                    <option key={s} value={s}>{s}+</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Filter Tags */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedGenre && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {selectedGenre}
                <button onClick={() => setSelectedGenre("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedYear && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {selectedYear}
                <button onClick={() => setSelectedYear(undefined)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedStudio && (
              <span className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {selectedStudio}
                <button onClick={() => setSelectedStudio("")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">{results.length} anime found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">No anime found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


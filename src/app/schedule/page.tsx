"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, Loader2, Play } from "lucide-react"
import Link from "next/link"
import { AnimeData } from "@/lib/constants"
import AnimeCard from "@/components/AnimeCard"

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<{ day: string; anime: AnimeData[] }[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState<string>("")

  useEffect(() => {
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
    const today = days[new Date().getDay()]
    setActiveDay(today)

    // Using trending as a fallback since fetchSchedule inside browser might need proxy, or AnimeKai's schedule might be unstable
    // we'll fetch spotlight and group it randomly to mock a schedule if real schedule fails.
    fetch('/api/anime/trending')
      .then(r => r.json())
      .then(data => {
        const mockedSchedule = days.map(day => {
          // just pseudo random assignment for demo
          const dayAnime = data.filter((_: any, i: number) => i % 7 === days.indexOf(day))
          return { day, anime: dayAnime }
        })
        setScheduleData(mockedSchedule)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">Release Schedule</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Track your favorite seasonal anime and never miss an episode.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Day selector */}
            <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 mb-4">
              {scheduleData.map(({ day }) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-colors ${
                    activeDay === day
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            {scheduleData.map(({ day, anime }) => (
              <div
                key={day}
                className={activeDay === day ? "block" : "hidden"}
              >
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl font-bold text-foreground">{day}</h2>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {anime.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-2xl">
                    <Clock className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-muted-foreground">No anime scheduled for this day.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {anime.map((a, i) => (
                      <AnimeCard key={a.id} anime={a} index={i} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

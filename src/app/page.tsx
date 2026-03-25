import HeroBanner from "@/components/HeroBanner"
import HorizontalScroller from "@/components/HorizontalScroller"
import { getTrending, getTopRated, getNewReleases, getByGenre, getSpotlight } from "@/lib/anime-data"

export default async function HomePage() {
  const [trending, topRated, newReleases, actionAnime, dramaAnime, fantasyAnime] = await Promise.all([
    getSpotlight(),
    getTopRated(),
    getNewReleases(),
    getByGenre("Action"),
    getByGenre("Drama"),
    getByGenre("Fantasy")
  ])

  // Pick top 5 for hero banner
  const heroAnime = trending.slice(0, 5)

  return (
    <div className="relative">
      {/* Hero Banner */}
      <HeroBanner anime={heroAnime} />

      {/* Scrollable Sections */}
      <div className="-mt-16 relative z-10 space-y-6 pb-12">
        <HorizontalScroller
          title="🔥 Trending Now"
          subtitle="Most popular anime this season"
          anime={trending}
          variant="large"
        />

        <HorizontalScroller
          title="⭐ Top Rated"
          subtitle="Highest scored anime of all time"
          anime={topRated}
        />

        <HorizontalScroller
          title="🆕 New Releases"
          subtitle="Recently aired anime"
          anime={newReleases}
        />

        <HorizontalScroller
          title="⚔️ Action Packed"
          subtitle="Intense action anime"
          anime={actionAnime}
        />

        <HorizontalScroller
          title="🎭 Drama"
          subtitle="Emotional and gripping stories"
          anime={dramaAnime}
        />

        <HorizontalScroller
          title="✨ Fantasy Worlds"
          subtitle="Explore fantastical universes"
          anime={fantasyAnime}
        />

        {/* AI Recommendation Teaser */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[oklch(0.65_0.25_280)]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[oklch(0.75_0.2_180)]/20 to-transparent rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                <span className="text-gradient">AI-Powered</span> Recommendations
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mb-6">
                Sign in to get personalized anime suggestions based on your watch history,
                ratings, and preferred genres. Our AI engine learns your taste.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
              >
                Get Started →
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

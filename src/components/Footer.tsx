import Link from "next/link"
import { Github, Twitter, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">鬼</span>
              </div>
              <span className="text-lg font-bold">
                <span className="text-gradient">An1me</span>
                <span className="text-foreground/90">Sensei</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal AI-powered anime discovery platform. Find, watch, and track your favorite anime.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Discover</h3>
            <div className="flex flex-col gap-2">
              <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse</Link>
              <Link href="/browse?genre=Action" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Action</Link>
              <Link href="/browse?genre=Drama" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Drama</Link>
              <Link href="/browse?genre=Fantasy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fantasy</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Account</h3>
            <div className="flex flex-col gap-2">
              <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
              <Link href="/watchlist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Watchlists</Link>
              <Link href="/recommendations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recommendations</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Community</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter / X</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> by An1meSensei
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Home,
  Compass,
  BookmarkCheck,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  Calendar,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Links visible to everyone
const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Compass },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/contact", label: "Contact", icon: Mail },
]

// Links only visible when signed in
const authLinks = [
  { href: "/watchlist", label: "My Lists", icon: BookmarkCheck },
  { href: "/profile", label: "Profile", icon: User },
]

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isLoggedIn = status === "authenticated"
  const navLinks = isLoggedIn ? [...publicLinks, ...authLinks] : publicLinks

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass shadow-lg shadow-black/20"
            : "bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] flex items-center justify-center shadow-lg group-hover:shadow-[oklch(0.65_0.25_280)]/30 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">鬼</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-gradient">An1me</span>
                <span className="text-foreground/90">Sensei</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl bg-white/10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <link.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <Link
                href="/search"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </Link>

              {isLoggedIn ? (
                <button
                  onClick={() => signOut()}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white/80 text-sm font-medium hover:bg-white/15 transition-colors border border-white/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white text-sm font-medium hover:opacity-90 transition-opacity duration-300 shadow-lg shadow-[oklch(0.65_0.25_280)]/20"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                title="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-72 glass-card p-6 pt-20"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  )
                })}
                <hr className="border-white/10 my-3" />
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      signOut()
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white/80 text-sm font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white text-sm font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

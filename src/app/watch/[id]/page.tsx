"use client"

import { use, useRef, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Hls from "hls.js"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  Loader2,
  List,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"

interface StreamSource {
  url: string
  isM3U8: boolean
  quality: string
}

function WatchPageInner({ animeId }: { animeId: string }) {
  const searchParams = useSearchParams()
  const gogoId = searchParams.get("gogoId") || ""
  const epNum = parseInt(searchParams.get("ep") || "1")

  const [anime, setAnime] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/anime/info/${encodeURIComponent(animeId)}`)
      .then(res => res.json())
      .then(data => setAnime(data))
      .catch(console.error)
  }, [animeId])

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [sources, setSources] = useState<StreamSource[]>([])
  const [selectedQuality, setSelectedQuality] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showEpList, setShowEpList] = useState(false)
  const [autoPlayNext, setAutoPlayNext] = useState(true)

  const [episodes, setEpisodes] = useState<any[]>([])
  const [gogoAnimeId, setGogoAnimeId] = useState<string>("")
  const [streamReferer, setStreamReferer] = useState<string>("")

  // Fetch streaming sources
  useEffect(() => {
    if (!gogoId) {
      setError("No episode ID provided")
      setLoading(false)
      return
    }

    setLoading(true)
    setError("")

    fetch(`/api/anime/watch/${encodeURIComponent(gogoId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }
        const referer = data.headers?.Referer || ""
        setStreamReferer(referer)

        if (data.sources && data.sources.length > 0) {
          setSources(data.sources)
          // Default to "auto" — let HLS.js pick the best quality
          setSelectedQuality("auto")
          // loadVideo is now handled by an effect that runs once the video is mounted
        } else {
          setError("No streaming sources found")
        }
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to fetch video sources")
        setLoading(false)
      })

    // Also get the anime's episode list for the sidebar
    const animeSlug = gogoId.split("$")[0]
    setGogoAnimeId(animeSlug)
    fetch(`/api/anime/info/${encodeURIComponent(animeSlug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.episodes) {
          setEpisodes(data.episodes)
        }
      })
      .catch(() => {})
  }, [gogoId])

  const loadVideo = (source: StreamSource, referer?: string) => {
    const video = videoRef.current
    if (!video) return

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const ref = referer || streamReferer

    if (source.isM3U8 && Hls.isSupported()) {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(source.url)}&referer=${encodeURIComponent(ref)}`

      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
      })
      hls.loadSource(proxyUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
      })
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error("HLS fatal error:", data)
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try to recover from network error
              console.log("HLS network error, attempting recovery...")
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              // Try to recover from media error
              console.log("HLS media error, attempting recovery...")
              hls.recoverMediaError()
              break
            default:
              // Cannot recover
              setError("Streaming error occurred. Try a different quality.")
              break
          }
        }
      })
      hlsRef.current = hls
    } else if (source.isM3U8 && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = `/api/proxy?url=${encodeURIComponent(source.url)}&referer=${encodeURIComponent(ref)}`
    } else {
      video.src = `/api/proxy?url=${encodeURIComponent(source.url)}&referer=${encodeURIComponent(ref)}`
    }
  }

  // Load video source once video is mounted and we have sources
  useEffect(() => {
    if (!loading && !error && sources.length > 0 && videoRef.current) {
      const sourceToLoad = selectedQuality === "auto" 
        ? sources[0] 
        : (sources.find(s => s.quality === selectedQuality) || sources[0]);
      loadVideo(sourceToLoad, streamReferer);
    }
  }, [loading, error, sources, videoRef.current])

  // Cleanup HLS on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [])

  // Controls visibility
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (playing) setShowControls(false)
      }, 3000)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [playing])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(() => {}) // Suppress AbortError on unmount/re-render
    }
    setPlaying(!playing)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!isFullscreen) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percent = x / rect.width
    videoRef.current.currentTime = percent * videoRef.current.duration
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  const switchQuality = (quality: string) => {
    if (quality === "auto") {
      // In auto mode, enable ABR on the current HLS instance
      if (hlsRef.current) {
        hlsRef.current.currentLevel = -1 // -1 = auto level selection
      }
      setSelectedQuality("auto")
      return
    }
    const source = sources.find((s) => s.quality === quality)
    if (source) {
      const currentPos = videoRef.current?.currentTime || 0
      setSelectedQuality(quality)
      loadVideo(source, streamReferer)
      if (videoRef.current) {
        videoRef.current.addEventListener(
          "loadedmetadata",
          () => {
            if (videoRef.current) {
              videoRef.current.currentTime = currentPos
              if (playing) videoRef.current.play().catch(() => {})
            }
          },
          { once: true }
        )
      }
    }
  }

  const getNextEpisode = () => {
    const currentIdx = episodes.findIndex((e: any) => e.number === epNum)
    if (currentIdx >= 0 && currentIdx < episodes.length - 1) {
      return episodes[currentIdx + 1]
    }
    return null
  }

  const getPrevEpisode = () => {
    const currentIdx = episodes.findIndex((e: any) => e.number === epNum)
    if (currentIdx > 0) {
      return episodes[currentIdx - 1]
    }
    return null
  }

  const nextEp = getNextEpisode()
  const prevEp = getPrevEpisode()

  return (
    <div className="min-h-screen pt-16 bg-black">
      {/* Video Player */}
      <div ref={containerRef} className="relative w-full aspect-video max-h-[80vh] bg-black group">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-sm text-white/60">Loading stream...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
            <AlertTriangle className="w-12 h-12 text-yellow-400" />
            <p className="text-sm text-white/80 text-center">{error}</p>
            <Link
              href={anime ? `/anime/${anime.id}` : "/"}
              className="text-sm text-primary hover:underline"
            >
              Go back
            </Link>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              crossOrigin="anonymous"
            />

            {/* Controls Overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: showControls ? 1 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between pointer-events-none"
              style={{ pointerEvents: showControls ? "auto" : "none" }}
            >
              {/* Top Bar */}
              <div className="p-4 flex items-center justify-between">
                <Link
                  href={anime ? `/anime/${anime.id}` : "/"}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {anime ? `Back to ${anime.title}` : "Back"}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center bg-white/10 rounded-lg p-0.5 mr-2">
                    <button className="px-3 py-1 text-xs font-medium rounded-md bg-white text-black transition-colors">Sub</button>
                    <button className="px-3 py-1 text-xs font-medium rounded-md text-white/60 hover:text-white transition-colors" title="Dub unavailable for this stream">Dub</button>
                  </div>
                  <button className="hidden md:flex px-2 py-1.5 text-xs font-bold rounded-lg bg-white/10 text-white/40 border border-white/5 transition-colors uppercase mr-2" title="Closed Captions unavailable">
                    CC
                  </button>
                  {/* Quality selector */}
                  {sources.length > 0 && (
                    <select
                      value={selectedQuality}
                      onChange={(e) => switchQuality(e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg bg-white/10 text-white/80 border border-white/10 focus:outline-none cursor-pointer"
                      title="Stream quality"
                    >
                      <option value="auto">Auto</option>
                      {sources.map((s) => (
                        <option key={s.quality} value={s.quality}>
                          {s.quality}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={() => setAutoPlayNext(!autoPlayNext)}
                    className={`text-xs px-3 py-1.5 rounded-lg ${
                      autoPlayNext ? "bg-primary/20 text-primary" : "bg-white/10 text-white/60"
                    } transition-colors`}
                  >
                    Auto-Play: {autoPlayNext ? "ON" : "OFF"}
                  </button>
                  <button
                    onClick={() => setShowEpList(!showEpList)}
                    className="p-2 rounded-lg bg-white/10 text-white/80 hover:text-white transition-colors"
                    title="Toggle episode list"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Center Play */}
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                  >
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </motion.button>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="p-4 space-y-3">
                <div onClick={handleSeek} className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group/progress">
                  <div
                    className="h-full bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.75_0.2_180)] rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {prevEp && (
                      <Link
                        href={`/watch/${animeId}?gogoId=${encodeURIComponent(prevEp.id)}&ep=${prevEp.number}`}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                      >
                        <SkipBack className="w-5 h-5" />
                      </Link>
                    )}
                    <button onClick={togglePlay} className="p-2 text-white hover:text-white transition-colors">
                      {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" fill="white" />}
                    </button>
                    {nextEp && (
                      <Link
                        href={`/watch/${animeId}?gogoId=${encodeURIComponent(nextEp.id)}&ep=${nextEp.number}`}
                        className="p-2 text-white/80 hover:text-white transition-colors"
                      >
                        <SkipForward className="w-5 h-5" />
                      </Link>
                    )}
                    <button onClick={toggleMute} className="p-2 text-white/80 hover:text-white transition-colors">
                      {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-xs text-white/60 ml-1">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80 font-medium mr-2">
                      Episode {epNum}
                    </span>
                    <button onClick={toggleFullscreen} className="p-2 text-white/80 hover:text-white transition-colors">
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Episode Sidebar */}
        {showEpList && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-md overflow-y-auto border-l border-white/10 z-20"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Episodes</h3>
                <button onClick={() => setShowEpList(false)} className="text-white/60 hover:text-white">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {episodes.map((e: any) => (
                  <Link
                    key={e.id}
                    href={`/watch/${animeId}?gogoId=${encodeURIComponent(e.id)}&ep=${e.number}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      e.number === epNum
                        ? "bg-primary/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Play className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">Episode {e.number}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Below Player */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          {anime?.title || "Unknown Anime"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Episode {epNum} • Streaming via AnimePahe
        </p>

        {/* Next Episode */}
        {nextEp && (
          <div className="mt-6 glass-card rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Next Episode</p>
              <p className="text-sm font-medium text-foreground">Episode {nextEp.number}</p>
            </div>
            <Link
              href={`/watch/${animeId}?gogoId=${encodeURIComponent(nextEp.id)}&ep=${nextEp.number}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.25_280)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="w-4 h-4" fill="white" /> Play Next
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black pt-16">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <WatchPageInner animeId={id} />
    </Suspense>
  )
}

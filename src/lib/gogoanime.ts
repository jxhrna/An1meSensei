import { ANIME } from "@consumet/extensions"

// Singleton AnimeKai provider (Gogoanime was removed from consumet)
let animeKaiInstance: InstanceType<typeof ANIME.AnimeKai> | null = null

export function getAnimeProvider() {
  if (!animeKaiInstance) {
    animeKaiInstance = new ANIME.AnimeKai()
  }
  return animeKaiInstance
}

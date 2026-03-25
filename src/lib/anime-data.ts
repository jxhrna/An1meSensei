import { getAnimeProvider } from "./gogoanime"
import { AnimeData, EpisodeData, allGenres, allStudios, allYears } from "./constants"

export { allGenres, allStudios, allYears }

function mapAnimeKai(item: any): AnimeData {
  return {
    id: item.id,
    title: item.title || "Unknown Title",
    synopsis: item.description || "No description available.",
    coverArt: item.image || item.banner || "https://placehold.co/400x600/1a1a1a/FFF?text=No+Image",
    bannerImage: item.banner || item.image,
    genres: item.genres || [],
    releaseYear: item.releaseDate || new Date().getFullYear(),
    epCount: item.episodes || item.sub || item.dub || 0,
    averageScore: 8.5, // Mock score
    rating: item.quality || "HD",
    type: item.type,
    studio: item.studio || "Unknown Studio",
  }
}

export async function getSpotlight(): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.fetchSpotlight()
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getTrending(): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.fetchSpotlight()
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getTopRated(): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.fetchLatestCompleted()
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getNewReleases(): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.fetchRecentlyAdded()
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getRecentlyUpdated(): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.fetchRecentlyUpdated()
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getByGenre(genre: string): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.genreSearch(genre)
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function getAnimeById(id: string): Promise<any> {
  const provider = getAnimeProvider()
  return await provider.fetchAnimeInfo(id)
}

export async function searchAnime(query: string, filters?: any): Promise<AnimeData[]> {
  try {
    const provider = getAnimeProvider()
    const res = await provider.search(query)
    return res.results?.map(mapAnimeKai) || []
  } catch (e) {
    console.error(e)
    return []
  }
}



// getSimilarAnime and getRecommendations logic (mocked to just return recently updated for now)
export async function getSimilarAnime(animeId: string): Promise<AnimeData[]> {
  return await getRecentlyUpdated()
}

export async function getRecommendations(watchedIds: string[], ratedAnime: any[]): Promise<AnimeData[]> {
  return await getSpotlight()
}

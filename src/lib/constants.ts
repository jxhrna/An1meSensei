export interface AnimeData {
  id: string
  title: string
  synopsis: string
  coverArt: string
  bannerImage?: string
  genres: string[]
  releaseYear: number | string
  studio?: string
  rating?: string
  epCount: number
  averageScore: number
  type?: string
}

export interface EpisodeData {
  id: string
  number: number
  title?: string
  isSubbed?: boolean
  isDubbed?: boolean
  url?: string
}

export const allGenres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"]
export const allStudios = ["MAPPA", "ufotable", "Bones", "Madhouse", "WIT Studio", "Kyoto Animation", "Sunrise", "Kinema Citrus"]
export const allYears = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i)

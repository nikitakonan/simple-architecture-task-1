export type ShowImage = {
  medium: string
  original: string
}

export type Channel = {
  name: string
}

export type Show = {
  id: number
  name: string
  genres: string[]
  status: string
  premiered: string | null
  network: Channel | null
  webChannel: Channel | null
  image: ShowImage | null
  summary: string | null
}

export type SearchResult = {
  score: number
  show: Show
}

import type { SearchResult } from './types'

const BASE_URL = 'https://api.tvmaze.com'

export async function searchShows(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const response = await fetch(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
    { signal },
  )
  if (!response.ok) {
    throw new Error(`TVmaze request failed: ${response.status}`)
  }
  return response.json()
}

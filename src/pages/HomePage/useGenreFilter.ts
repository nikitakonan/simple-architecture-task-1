import { useMemo, useState } from 'react'

export type GenreOption = {
  name: string
  count: number
}

type WithGenres = { genres: string[] }

function countGenres(items: WithGenres[]): GenreOption[] {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const genre of item.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Unique genres of `items` with counts, plus the list filtered by the selected
 * genre. A new `items` list (a new search) clears the selection.
 */
export function useGenreFilter<T extends WithGenres>(items: T[]) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [prevItems, setPrevItems] = useState(items)

  if (items !== prevItems) {
    setPrevItems(items)
    setSelectedGenre(null)
  }

  const genres = useMemo(() => countGenres(items), [items])
  const filteredItems = useMemo(
    () =>
      selectedGenre === null
        ? items
        : items.filter((item) => item.genres.includes(selectedGenre)),
    [items, selectedGenre],
  )

  return {
    genres,
    selectedGenre,
    selectGenre: setSelectedGenre,
    filteredItems,
  }
}

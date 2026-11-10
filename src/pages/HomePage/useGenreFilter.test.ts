import { act, renderHook } from '@testing-library/react'

import { useGenreFilter } from './useGenreFilter'

const items = [
  { id: 1, genres: ['Drama', 'Crime'] },
  { id: 2, genres: ['Comedy'] },
  { id: 3, genres: ['Drama'] },
]

describe('useGenreFilter', () => {
  it('collects unique genres with counts, sorted by name', () => {
    const { result } = renderHook(() => useGenreFilter(items))

    expect(result.current.genres).toEqual([
      { name: 'Comedy', count: 1 },
      { name: 'Crime', count: 1 },
      { name: 'Drama', count: 2 },
    ])
    expect(result.current.filteredItems).toBe(items)
  })

  it('filters by the selected genre and can be reset', () => {
    const { result } = renderHook(() => useGenreFilter(items))

    act(() => result.current.selectGenre('Drama'))
    expect(result.current.filteredItems.map((item) => item.id)).toEqual([1, 3])

    act(() => result.current.selectGenre(null))
    expect(result.current.filteredItems).toBe(items)
  })

  it('clears the selection when the items change', () => {
    const { result, rerender } = renderHook(
      ({ list }) => useGenreFilter(list),
      { initialProps: { list: items } },
    )

    act(() => result.current.selectGenre('Comedy'))
    rerender({ list: [{ id: 4, genres: ['Drama'] }] })

    expect(result.current.selectedGenre).toBeNull()
  })
})

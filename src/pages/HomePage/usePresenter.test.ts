import { act, renderHook } from '@testing-library/react'

import type { Show } from '../../api/types'
import { useShowSearch } from '../../hooks/useShowSearch'

import { usePresenter } from './usePresenter'

vi.mock('../../hooks/useShowSearch')
vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: <T>(value: T) => value,
}))

function makeShow(id: number, genres: string[]): Show {
  return {
    id,
    name: `Show ${id}`,
    genres,
    status: 'Ended',
    premiered: '2014-09-25',
    network: { name: 'ABC' },
    webChannel: null,
    image: null,
    summary: '<p>A <b>show</b>.</p>',
  }
}

const SHOWS = [
  makeShow(1, ['Drama', 'Crime']),
  makeShow(2, ['Comedy']),
  makeShow(3, ['Drama']),
  makeShow(4, ['Drama', 'Mystery']),
]

type Search = ReturnType<typeof useShowSearch>
const retry = vi.fn()

function mockSearch(overrides: Partial<Search>) {
  vi.mocked(useShowSearch).mockReturnValue({
    status: 'success',
    resultsQuery: 'murder',
    shows: SHOWS,
    error: null,
    retry,
    ...overrides,
  })
}

describe('usePresenter', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('is idle and searches nothing while the query is empty', () => {
    mockSearch({ status: 'idle', shows: [] })
    const { result } = renderHook(() => usePresenter())

    expect(result.current.view).toBe('idle')
    expect(useShowSearch).toHaveBeenLastCalledWith('')
  })

  it('searches for the typed query and keeps it in the URL', () => {
    mockSearch({ status: 'loading', shows: [] })
    const { result } = renderHook(() => usePresenter())

    act(() => result.current.changeQuery('murder'))

    expect(useShowSearch).toHaveBeenLastCalledWith('murder')
    expect(result.current.view).toBe('loading')
    expect(window.location.search).toBe('?q=murder')
  })

  it('paginates the results three at a time', () => {
    mockSearch({})
    window.history.replaceState(null, '', '/?q=murder')
    const { result } = renderHook(() => usePresenter())

    expect(result.current.view).toBe('results')
    expect(result.current.resultsLabel).toBe('4 shows')
    expect(result.current.visibleShows.map((s) => s.id)).toEqual([1, 2, 3])
    expect(result.current.pageCount).toBe(2)

    act(() => result.current.setPage(2))
    expect(result.current.visibleShows.map((s) => s.id)).toEqual([4])
    expect(result.current.rangeLabel).toBe('Showing 4–4 of 4')
  })

  it('filters by genre and goes back to the first page', () => {
    mockSearch({})
    window.history.replaceState(null, '', '/?q=murder')
    const { result } = renderHook(() => usePresenter())

    act(() => result.current.setPage(2))
    act(() => result.current.selectGenre('Drama'))

    expect(result.current.page).toBe(1)
    expect(result.current.visibleShows.map((s) => s.id)).toEqual([1, 3, 4])
    expect(result.current.resultsLabel).toBe('3 Drama of 4 shows')

    act(() => result.current.resetGenre())
    expect(result.current.selectedGenre).toBeNull()
  })

  it('picks the view for empty, stale and failed searches', () => {
    window.history.replaceState(null, '', '/?q=zxqv')
    mockSearch({ shows: [] })
    const { result, rerender } = renderHook(() => usePresenter())
    expect(result.current.view).toBe('empty')
    expect(result.current.errorMessage).toBeNull()
    mockSearch({ status: 'loading' })
    rerender()
    expect(result.current.isRefreshing).toBe(true)
    mockSearch({ status: 'error', shows: [], error: 'Failed' })
    rerender()
    expect(result.current.view).toBe('error')
    expect(result.current.errorMessage).toBe(
      'TVmaze didn’t respond. Check your connection and try again.',
    )
    expect(result.current.retry).toBe(retry)
  })
})

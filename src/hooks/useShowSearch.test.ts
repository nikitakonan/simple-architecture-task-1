import { act, renderHook, waitFor } from '@testing-library/react'
import { searchShows } from '../api/tvmaze'
import type { SearchResult, Show } from '../api/types'
import { useShowSearch } from './useShowSearch'

vi.mock('../api/tvmaze')

const show = { id: 1, name: 'Midsomer Murders' } as Show
const results: SearchResult[] = [{ score: 1, show }]

describe('useShowSearch', () => {
  beforeEach(() => {
    vi.mocked(searchShows).mockReset()
  })

  it('stays idle and sends no request for an empty query', () => {
    const { result } = renderHook(() => useShowSearch('   '))

    expect(result.current.status).toBe('idle')
    expect(searchShows).not.toHaveBeenCalled()
  })

  it('loads and then returns the shows', async () => {
    vi.mocked(searchShows).mockResolvedValue(results)
    const { result } = renderHook(() => useShowSearch(' murder '))

    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.shows).toEqual([show])
    expect(searchShows).toHaveBeenCalledWith('murder', expect.any(AbortSignal))
  })

  it('reports an error and can retry', async () => {
    vi.mocked(searchShows).mockRejectedValueOnce(new Error('Network down'))
    const { result } = renderHook(() => useShowSearch('murder'))

    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error).toBe('Network down')

    vi.mocked(searchShows).mockResolvedValue(results)
    act(() => result.current.retry())
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(searchShows).toHaveBeenCalledTimes(2)
  })

  it('aborts the previous request when the query changes', async () => {
    vi.mocked(searchShows).mockReturnValue(new Promise(() => {}))
    const { rerender } = renderHook(({ query }) => useShowSearch(query), {
      initialProps: { query: 'mur' },
    })
    const firstSignal = vi.mocked(searchShows).mock.calls[0][1]

    rerender({ query: 'murder' })

    expect(firstSignal?.aborted).toBe(true)
  })
})

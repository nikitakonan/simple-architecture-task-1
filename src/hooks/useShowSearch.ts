import { useCallback, useEffect, useState } from 'react'
import { searchShows } from '../api/tvmaze'
import type { Show } from '../api/types'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

type SearchState = {
  status: SearchStatus
  shows: Show[]
  error: string | null
}

const IDLE: SearchState = { status: 'idle', shows: [], error: null }

/**
 * Searches TVmaze for `query`. Every new query (or retry) aborts the request
 * that is still in flight, so a slow old response can never overwrite a newer
 * one. An empty query resets to the idle state without a request.
 */
export function useShowSearch(query: string) {
  const [state, setState] = useState<SearchState>(IDLE)
  const [attempt, setAttempt] = useState(0)

  // `attempt` is a dependency on purpose: bumping it re-runs the search.
  // biome-ignore lint/correctness/useExhaustiveDependencies: retry trigger
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setState(IDLE)
      return
    }

    const controller = new AbortController()
    // Keep the previous shows while loading so the list doesn't jump around.
    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    searchShows(trimmed, controller.signal)
      .then((results) => {
        setState({
          status: 'success',
          shows: results.map((result) => result.show),
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          shows: [],
          error: error instanceof Error ? error.message : String(error),
        })
      })

    return () => controller.abort()
  }, [query, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, retry }
}

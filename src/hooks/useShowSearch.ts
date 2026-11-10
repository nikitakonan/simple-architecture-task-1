import { useCallback, useEffect, useState } from 'react'

import { searchShows } from '../api/tvmaze'
import type { Show } from '../api/types'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

type SearchState = {
  status: SearchStatus
  /** The query that `shows` (or `error`) belong to. */
  resultsQuery: string
  shows: Show[]
  error: string | null
}

const IDLE: SearchState = {
  status: 'idle',
  resultsQuery: '',
  shows: [],
  error: null,
}

/**
 * Searches TVmaze for `query`. Every new query (or retry) aborts the request
 * that is still in flight, so a slow old response can never overwrite a newer
 * one. An empty query resets to the idle state without a request.
 *
 * While a new search loads, the previous `shows` and `resultsQuery` are kept,
 * so the caller can keep showing them instead of a blank list.
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
    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    searchShows(trimmed, controller.signal)
      .then((results) => {
        setState({
          status: 'success',
          resultsQuery: trimmed,
          shows: results.map((result) => result.show),
          error: null,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          resultsQuery: trimmed,
          shows: [],
          error: error instanceof Error ? error.message : String(error),
        })
      })

    return () => controller.abort()
  }, [query, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { ...state, retry }
}

import { useDebounce } from '../../hooks/useDebounce'
import { useShowSearch } from '../../hooks/useShowSearch'
import { formatShow } from './formatShow'
import { useGenreFilter } from './useGenreFilter'
import { usePagination } from './usePagination'
import { useSearchParam } from './useSearchParam'

const PAGE_SIZE = 3
const DEBOUNCE_MS = 400
const SUGGESTIONS = ['murder', 'office', 'dragon', 'space']
const ERROR_MESSAGE =
  'TVmaze didn’t respond. Check your connection and try again.'

export type HomeView = 'idle' | 'loading' | 'error' | 'empty' | 'results'

export function usePresenter() {
  const [query, setQuery] = useSearchParam('q')
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS)
  const hasQuery = query.trim() !== ''

  // Clearing the field resets right away instead of waiting for the debounce.
  const { shows, status, retry } = useShowSearch(hasQuery ? debouncedQuery : '')
  const { genres, selectedGenre, selectGenre, filteredItems } =
    useGenreFilter(shows)
  const { page, pageCount, setPage, pageItems, firstIndex } = usePagination(
    filteredItems,
    PAGE_SIZE,
  )

  let view: HomeView = 'results'
  if (!hasQuery) view = 'idle'
  else if (status === 'error') view = 'error'
  else if (status !== 'success') view = 'loading'
  else if (shows.length === 0) view = 'empty'

  const total = shows.length
  const filtered = filteredItems.length
  const showsWord = total === 1 ? 'show' : 'shows'
  const resultsLabel = selectedGenre
    ? `${filtered} ${selectedGenre} of ${total} ${showsWord}`
    : `${total} ${showsWord}`

  return {
    query,
    changeQuery: setQuery,
    clearQuery: () => setQuery(''),
    isSearching: hasQuery && (status === 'loading' || query !== debouncedQuery),
    view,
    searchedFor: debouncedQuery.trim(),
    // Set only in the error state, so it can't leak into other views.
    errorMessage: view === 'error' ? ERROR_MESSAGE : null,
    retry,
    suggestions: SUGGESTIONS,
    genres,
    selectedGenre,
    selectGenre,
    resetGenre: () => selectGenre(null),
    totalCount: total,
    resultsLabel,
    visibleShows: pageItems.map(formatShow),
    page,
    pageCount,
    setPage,
    rangeLabel: `Showing ${firstIndex + 1}–${firstIndex + pageItems.length} of ${filtered}`,
  }
}

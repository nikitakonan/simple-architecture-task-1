import { useState } from 'react'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const [prevItems, setPrevItems] = useState(items)

  // A new list (new search or genre) starts again from the first page.
  // `items` must be memoized by the caller, or this resets on every render.
  if (items !== prevItems) {
    setPrevItems(items)
    setPage(1)
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const start = (currentPage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return {
    page: currentPage,
    pageCount,
    setPage,
    pageItems,
    firstIndex: start,
  }
}

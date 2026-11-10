import { act, renderHook } from '@testing-library/react'

import { usePagination } from './usePagination'

const items = [1, 2, 3, 4, 5, 6, 7]

describe('usePagination', () => {
  it('splits the items into pages', () => {
    const { result } = renderHook(() => usePagination(items, 3))

    expect(result.current.pageCount).toBe(3)
    expect(result.current.pageItems).toEqual([1, 2, 3])

    act(() => result.current.setPage(3))
    expect(result.current.pageItems).toEqual([7])
    expect(result.current.firstIndex).toBe(6)
  })

  it('has one empty page for an empty list', () => {
    const { result } = renderHook(() => usePagination([], 3))

    expect(result.current.page).toBe(1)
    expect(result.current.pageCount).toBe(1)
    expect(result.current.pageItems).toEqual([])
  })

  it('goes back to the first page when the list changes', () => {
    const { result, rerender } = renderHook(
      ({ list }) => usePagination(list, 3),
      { initialProps: { list: items } },
    )

    act(() => result.current.setPage(2))
    rerender({ list: [10, 11, 12, 13] })

    expect(result.current.page).toBe(1)
    expect(result.current.pageItems).toEqual([10, 11, 12])
  })
})

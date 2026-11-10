import { renderHook } from '@testing-library/react'
import { usePresenter } from './usePresenter'

function setup(page: number, pageCount: number) {
  const onChange = vi.fn()
  const { result } = renderHook(() =>
    usePresenter({ page, pageCount, rangeLabel: '', onChange }),
  )
  return { presenter: result.current, onChange }
}

describe('Pagination usePresenter', () => {
  it('lists every page and marks the current one', () => {
    const { presenter } = setup(2, 3)

    expect(presenter.pages).toEqual([
      { number: 1, isCurrent: false },
      { number: 2, isCurrent: true },
      { number: 3, isCurrent: false },
    ])
    expect(presenter.hasControls).toBe(true)
  })

  it('hides the controls when there is one page', () => {
    expect(setup(1, 1).presenter.hasControls).toBe(false)
  })

  it('blocks moving past the first and last page', () => {
    expect(setup(1, 3).presenter.canGoBack).toBe(false)
    expect(setup(1, 3).presenter.canGoForward).toBe(true)
    expect(setup(3, 3).presenter.canGoForward).toBe(false)
  })

  it('moves to the previous and next page', () => {
    const { presenter, onChange } = setup(2, 3)

    presenter.goBack()
    expect(onChange).toHaveBeenLastCalledWith(1)
    presenter.goForward()
    expect(onChange).toHaveBeenLastCalledWith(3)
  })
})

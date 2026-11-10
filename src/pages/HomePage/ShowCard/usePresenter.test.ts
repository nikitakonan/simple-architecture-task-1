import { renderHook } from '@testing-library/react'
import type { Show } from '../../../api/types'
import { usePresenter } from './usePresenter'

const show: Show = {
  id: 1,
  name: 'The Office',
  genres: ['Comedy'],
  status: 'Ended',
  premiered: '2005-03-24',
  network: null,
  webChannel: { name: 'Peacock' },
  image: { medium: 'https://example.com/o.jpg', original: '' },
  summary: null,
}

describe('ShowCard usePresenter', () => {
  it('returns the show formatted for the card', () => {
    const { result } = renderHook(() => usePresenter({ show }))

    expect(result.current).toMatchObject({
      name: 'The Office',
      meta: '2005 · Peacock',
      summary: '',
      imageUrl: 'https://example.com/o.jpg',
    })
  })

  it('keeps the same result while the show does not change', () => {
    const { result, rerender } = renderHook(() => usePresenter({ show }))
    const first = result.current

    rerender()
    expect(result.current).toBe(first)
  })
})

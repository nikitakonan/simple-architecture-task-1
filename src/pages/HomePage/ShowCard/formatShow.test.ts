import type { Show } from '../../api/types'
import { formatShow } from './formatShow'

const show: Show = {
  id: 7,
  name: 'Murder, She Wrote',
  genres: ['Drama', 'Crime', 'Mystery'],
  status: 'Ended',
  premiered: '1984-09-30',
  network: { name: 'CBS' },
  webChannel: null,
  image: { medium: 'https://example.com/m.jpg', original: '' },
  summary: '<p>A writer solves <b>murders</b> &amp; more.</p>',
}

describe('formatShow', () => {
  it('formats the fields a card shows', () => {
    expect(formatShow(show)).toEqual({
      id: 7,
      name: 'Murder, She Wrote',
      meta: '1984 · CBS',
      status: 'Ended',
      genres: ['Drama', 'Crime', 'Mystery'],
      summary: 'A writer solves murders & more.',
      imageUrl: 'https://example.com/m.jpg',
      initials: 'MSW',
      tone: 1,
    })
  })

  it('handles missing optional data', () => {
    const view = formatShow({
      ...show,
      name: 'How to Get Away with Murder',
      premiered: null,
      network: null,
      webChannel: { name: 'Netflix' },
      image: null,
      summary: null,
    })

    expect(view.meta).toBe('Netflix')
    expect(view.summary).toBe('')
    expect(view.imageUrl).toBeNull()
    expect(view.initials).toBe('HGA')
  })
})

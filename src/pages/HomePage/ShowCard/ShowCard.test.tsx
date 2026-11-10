import { render, screen } from '@testing-library/react'

import type { Show } from '../../../api/types'

import { ShowCard } from '.'

const show: Show = {
  id: 7,
  name: 'Murder, She Wrote',
  genres: ['Drama', 'Crime'],
  status: 'Ended',
  premiered: '1984-09-30',
  network: { name: 'CBS' },
  webChannel: null,
  image: null,
  summary: '<p>A writer solves <b>murders</b>.</p>',
}

describe('ShowCard', () => {
  it('renders the formatted show', () => {
    render(<ShowCard show={show} />)

    expect(
      screen.getByRole('heading', { name: 'Murder, She Wrote' }),
    ).toBeInTheDocument()
    expect(screen.getByText('1984 · CBS')).toBeInTheDocument()
    expect(screen.getByText('A writer solves murders.')).toBeInTheDocument()
    expect(screen.getByText('MSW')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Genres' })).toHaveTextContent(
      'DramaCrime',
    )
  })
})

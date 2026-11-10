import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { GenreFilter } from '.'

function renderFilter(selectedGenre: string | null) {
  const props = {
    query: 'murder',
    resultsLabel: '4 shows',
    totalCount: 4,
    genres: [
      { name: 'Crime', count: 3 },
      { name: 'Drama', count: 2 },
    ],
    selectedGenre,
    onSelect: vi.fn(),
    onReset: vi.fn(),
  }
  render(<GenreFilter {...props} />)
  return props
}

describe('GenreFilter', () => {
  it('shows a chip per genre and reports the selected one', async () => {
    const props = renderFilter(null)

    expect(screen.getByText('4 shows')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All 4' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(
      screen.queryByRole('button', { name: 'Reset filter' }),
    ).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Crime 3' }))
    expect(props.onSelect).toHaveBeenCalledWith('Crime')
  })

  it('marks the selected genre and can reset it', async () => {
    const props = renderFilter('Drama')

    expect(screen.getByRole('button', { name: 'Drama 2' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await userEvent.click(screen.getByRole('button', { name: 'All 4' }))
    expect(props.onSelect).toHaveBeenCalledWith(null)
    await userEvent.click(screen.getByRole('button', { name: 'Reset filter' }))
    expect(props.onReset).toHaveBeenCalledOnce()
  })
})

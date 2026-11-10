import { render, screen } from '@testing-library/react'

import { Header } from '.'

describe('Header', () => {
  it('shows the app name and links to the data source', () => {
    render(<Header />)

    expect(screen.getByText('TV Shows Explorer')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Data from TVmaze' }),
    ).toHaveAttribute('href', 'https://www.tvmaze.com/api')
  })
})

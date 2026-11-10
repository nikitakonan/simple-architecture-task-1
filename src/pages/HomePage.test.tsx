import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the page heading', () => {
    render(<HomePage />)
    expect(
      screen.getByRole('heading', { name: /tv shows explorer/i }),
    ).toBeInTheDocument()
  })
})

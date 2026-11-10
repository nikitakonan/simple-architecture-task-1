import { render, screen } from '@testing-library/react'
import { EmptyState } from '.'

describe('EmptyState', () => {
  it('names the query that found nothing', () => {
    render(<EmptyState query="zxqv" />)

    expect(screen.getByText('No shows match “zxqv”.')).toBeInTheDocument()
  })
})

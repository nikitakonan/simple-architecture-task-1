import { render, screen } from '@testing-library/react'

import { LoadingState } from '.'

describe('LoadingState', () => {
  it('renders three busy placeholder cards', () => {
    render(<LoadingState />)

    const list = screen.getByRole('list', { name: 'Loading results' })
    expect(list).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})

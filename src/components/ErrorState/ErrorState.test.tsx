import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ErrorState } from '.'

describe('ErrorState', () => {
  it('shows the title and message as an alert', () => {
    render(<ErrorState message="TVmaze didn’t respond." />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Couldn’t load shows.')
    expect(alert).toHaveTextContent('TVmaze didn’t respond.')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('offers a retry button when onRetry is given', async () => {
    const onRetry = vi.fn()
    render(<ErrorState message="Oops" onRetry={onRetry} />)

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})

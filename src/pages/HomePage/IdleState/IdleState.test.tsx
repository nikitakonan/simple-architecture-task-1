import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IdleState } from '.'

describe('IdleState', () => {
  it('offers suggestions and reports the picked one', async () => {
    const onPick = vi.fn()
    render(<IdleState suggestions={['murder', 'office']} onPick={onPick} />)

    await userEvent.click(screen.getByRole('button', { name: 'office' }))
    expect(onPick).toHaveBeenCalledWith('office')
  })
})

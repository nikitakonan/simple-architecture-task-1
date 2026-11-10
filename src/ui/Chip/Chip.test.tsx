import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Chip } from '.'

describe('Chip', () => {
  it('renders the label and count and reports its pressed state', () => {
    render(<Chip label="Drama" count={4} selected onClick={() => {}} />)

    const chip = screen.getByRole('button', { name: 'Drama 4' })
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Chip label="Comedy" onClick={onClick} />)

    const chip = screen.getByRole('button', { name: 'Comedy' })
    expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    expect(onClick).toHaveBeenCalledOnce()
  })
})

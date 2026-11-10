import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '.'

describe('Pagination', () => {
  it('shows only the range label for a single page', () => {
    render(
      <Pagination
        page={1}
        pageCount={1}
        rangeLabel="Showing 1–2 of 2"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 1–2 of 2')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('marks the current page and reports page changes', async () => {
    const onChange = vi.fn()
    render(
      <Pagination
        page={1}
        pageCount={3}
        rangeLabel="Showing 1–3 of 7"
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onChange).toHaveBeenCalledWith(3)
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })
})

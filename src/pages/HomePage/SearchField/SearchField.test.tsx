import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchField } from '.'

function renderField(query: string, isSearching = false) {
  const props = {
    query,
    isSearching,
    onQueryChange: vi.fn(),
    onClear: vi.fn(),
  }
  render(<SearchField {...props} />)
  return props
}

describe('SearchField', () => {
  it('reports typed text', async () => {
    const props = renderField('')

    await userEvent.type(screen.getByLabelText('Search TV shows by title'), 'a')
    expect(props.onQueryChange).toHaveBeenCalledWith('a')
    expect(
      screen.queryByRole('button', { name: 'Clear search' }),
    ).not.toBeInTheDocument()
  })

  it('shows the searching status and a clear button', async () => {
    const props = renderField('murder', true)

    expect(screen.getByRole('status')).toHaveTextContent('Searching…')
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(props.onClear).toHaveBeenCalledOnce()
  })
})

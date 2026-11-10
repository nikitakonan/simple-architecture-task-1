export type PaginationProps = {
  page: number
  pageCount: number
  rangeLabel: string
  onChange: (page: number) => void
}

export function usePresenter({
  page,
  pageCount,
  rangeLabel,
  onChange,
}: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => ({
    number: index + 1,
    isCurrent: index + 1 === page,
  }))

  return {
    rangeLabel,
    hasControls: pageCount > 1,
    pages,
    canGoBack: page > 1,
    canGoForward: page < pageCount,
    goBack: () => onChange(page - 1),
    goForward: () => onChange(page + 1),
    goTo: onChange,
  }
}

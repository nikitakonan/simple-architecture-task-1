import styles from './Pagination.module.css'
import { type PaginationProps, usePresenter } from './usePresenter'

export function Pagination(props: PaginationProps) {
  const {
    rangeLabel,
    hasControls,
    pages,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    goTo,
  } = usePresenter(props)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <p className={styles.range}>{rangeLabel}</p>
      {hasControls && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            aria-label="Previous page"
            disabled={!canGoBack}
            onClick={goBack}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          {pages.map(({ number, isCurrent }) => (
            <button
              key={number}
              type="button"
              className={styles.button}
              aria-label={`Page ${number}`}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => goTo(number)}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className={styles.button}
            aria-label="Next page"
            disabled={!canGoForward}
            onClick={goForward}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </nav>
  )
}

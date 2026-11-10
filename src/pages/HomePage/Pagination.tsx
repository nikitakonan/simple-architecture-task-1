import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  pageCount: number
  rangeLabel: string
  onChange: (page: number) => void
}

function Arrow({ d }: { d: string }) {
  return (
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
      <path d={d} />
    </svg>
  )
}

export function Pagination({
  page,
  pageCount,
  rangeLabel,
  onChange,
}: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <p className={styles.range}>{rangeLabel}</p>
      {pageCount > 1 && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
          >
            <Arrow d="M15 6l-6 6 6 6" />
          </button>
          {pages.map((number) => (
            <button
              key={number}
              type="button"
              className={styles.button}
              aria-label={`Page ${number}`}
              aria-current={number === page ? 'page' : undefined}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className={styles.button}
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onChange(page + 1)}
          >
            <Arrow d="M9 6l6 6-6 6" />
          </button>
        </div>
      )}
    </nav>
  )
}

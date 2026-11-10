import styles from './SearchField.module.css'

type SearchFieldProps = {
  query: string
  isSearching: boolean
  onQueryChange: (value: string) => void
  onClear: () => void
}

export function SearchField({
  query,
  isSearching,
  onQueryChange,
  onClear,
}: SearchFieldProps) {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Find your next binge.</h1>
      <label htmlFor="show-search" className={styles.label}>
        Search TV shows by title
      </label>
      <div className={styles.field}>
        <svg
          className={styles.icon}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          id="show-search"
          className={styles.input}
          type="search"
          placeholder="Try “murder”, “office” or “dragon”"
          autoComplete="off"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {isSearching && (
          <span className={styles.status} role="status">
            Searching…
          </span>
        )}
        {query && (
          <button
            type="button"
            className={styles.clear}
            aria-label="Clear search"
            onClick={onClear}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    </section>
  )
}

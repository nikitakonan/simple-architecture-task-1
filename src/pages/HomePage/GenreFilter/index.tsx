import { Chip } from '../../../ui/Chip'

import styles from './GenreFilter.module.css'

type GenreOption = {
  name: string
  count: number
}

type GenreFilterProps = {
  query: string
  resultsLabel: string
  totalCount: number
  genres: GenreOption[]
  selectedGenre: string | null
  onSelect: (genre: string | null) => void
  onReset: () => void
}

export function GenreFilter({
  query,
  resultsLabel,
  totalCount,
  genres,
  selectedGenre,
  onSelect,
  onReset,
}: GenreFilterProps) {
  return (
    <section className={styles.filter} aria-label="Filter by genre">
      <div className={styles.summary}>
        <p className={styles.count} aria-live="polite">
          <strong>{resultsLabel}</strong> for “{query}”
        </p>
        {selectedGenre !== null && (
          <button type="button" className={styles.reset} onClick={onReset}>
            Reset filter
          </button>
        )}
      </div>
      {genres.length > 0 && (
        <div className={styles.chips}>
          <Chip
            label="All"
            count={totalCount}
            selected={selectedGenre === null}
            onClick={() => onSelect(null)}
          />
          {genres.map((genre) => (
            <Chip
              key={genre.name}
              label={genre.name}
              count={genre.count}
              selected={genre.name === selectedGenre}
              onClick={() => onSelect(genre.name)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

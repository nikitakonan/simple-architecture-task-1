import styles from './Chip.module.css'

export type ChipProps = {
  label: string
  count?: number
  selected?: boolean
  onClick: () => void
}

export function Chip({ label, count, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
      {count !== undefined && (
        <>
          {/* The space keeps the accessible name readable: "Drama 4". */}{' '}
          <span className={styles.count}>{count}</span>
        </>
      )}
    </button>
  )
}

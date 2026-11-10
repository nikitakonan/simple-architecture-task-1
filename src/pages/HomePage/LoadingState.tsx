import styles from './LoadingState.module.css'

const PLACEHOLDERS = ['first', 'second', 'third']

export function LoadingState() {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Loading results">
      {PLACEHOLDERS.map((key) => (
        <li key={key} className={styles.card}>
          <div className={`${styles.block} ${styles.poster}`} />
          <div className={`${styles.block} ${styles.title}`} />
          <div className={`${styles.block} ${styles.meta}`} />
          <div className={styles.tags}>
            <div className={`${styles.block} ${styles.tag}`} />
            <div className={`${styles.block} ${styles.tag}`} />
          </div>
        </li>
      ))}
    </ul>
  )
}

import styles from './EmptyState.module.css'

type EmptyStateProps = {
  query: string
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <section className={styles.empty}>
      <svg
        className={styles.icon}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5M8.5 8.5l5 5M13.5 8.5l-5 5" />
      </svg>
      <p className={styles.title}>No shows match “{query}”.</p>
      <p className={styles.text}>
        Check the spelling, or try a shorter or more general title.
      </p>
    </section>
  )
}

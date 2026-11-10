import styles from './ErrorState.module.css'

export type ErrorStateProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Couldn’t load shows.',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <section role="alert" className={styles.error}>
      <svg
        className={styles.icon}
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l9.5 17h-19z" />
        <path d="M12 10v4M12 17.5v.01" />
      </svg>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  )
}

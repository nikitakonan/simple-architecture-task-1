import { Chip } from '../../../ui/Chip'
import styles from './IdleState.module.css'

type IdleStateProps = {
  suggestions: string[]
  onPick: (query: string) => void
}

export function IdleState({ suggestions, onPick }: IdleStateProps) {
  return (
    <section className={styles.idle}>
      <p className={styles.title}>Start typing to search TV shows.</p>
      <p className={styles.text}>
        Results appear as you type. Filter them by genre once they load.
      </p>
      <div className={styles.suggestions}>
        {suggestions.map((suggestion) => (
          <Chip
            key={suggestion}
            label={suggestion}
            onClick={() => onPick(suggestion)}
          />
        ))}
      </div>
    </section>
  )
}

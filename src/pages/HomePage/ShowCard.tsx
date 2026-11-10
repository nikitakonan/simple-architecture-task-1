import type { ShowView } from './formatShow'
import styles from './ShowCard.module.css'

type ShowCardProps = {
  show: ShowView
}

export function ShowCard({ show }: ShowCardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.poster} data-tone={show.tone}>
        {show.imageUrl ? (
          <img
            className={styles.image}
            src={show.imageUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {show.initials}
          </span>
        )}
        {show.status && <span className={styles.status}>{show.status}</span>}
      </div>
      <div className={styles.heading}>
        <h2 className={styles.name}>{show.name}</h2>
        {show.meta && <p className={styles.meta}>{show.meta}</p>}
      </div>
      {show.genres.length > 0 && (
        <ul className={styles.genres} aria-label="Genres">
          {show.genres.map((genre) => (
            <li key={genre} className={styles.genre}>
              {genre}
            </li>
          ))}
        </ul>
      )}
      {show.summary && <p className={styles.summary}>{show.summary}</p>}
    </li>
  )
}

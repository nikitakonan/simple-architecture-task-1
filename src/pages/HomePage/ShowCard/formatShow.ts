import type { Show } from '../../../api/types'

/** Everything a show card renders, already formatted. */
export type ShowView = {
  id: number
  name: string
  meta: string
  status: string
  genres: string[]
  summary: string
  imageUrl: string | null
  initials: string
  /** 0–5: picks the placeholder poster colour when there is no image. */
  tone: number
}

const TONE_COUNT = 6

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').trim()
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    .filter((word, index) => index === 0 || word.length > 2)
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function formatShow(show: Show): ShowView {
  const year = show.premiered?.slice(0, 4)
  const channel = show.network?.name ?? show.webChannel?.name
  return {
    id: show.id,
    name: show.name,
    meta: [year, channel].filter(Boolean).join(' · '),
    status: show.status,
    genres: show.genres,
    summary: show.summary ? stripHtml(show.summary) : '',
    imageUrl: show.image?.medium ?? null,
    initials: getInitials(show.name),
    tone: show.id % TONE_COUNT,
  }
}

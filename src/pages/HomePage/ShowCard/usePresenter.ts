import { useMemo } from 'react'

import type { Show } from '../../../api/types'

import { formatShow } from './formatShow'

export type ShowCardProps = {
  show: Show
}

export function usePresenter({ show }: ShowCardProps) {
  // formatShow parses the HTML summary, so don't redo it on every render.
  return useMemo(() => formatShow(show), [show])
}

import { useCallback, useState } from 'react'

function readParam(name: string): string {
  return new URLSearchParams(window.location.search).get(name) ?? ''
}

/**
 * State that mirrors a URL query parameter (`?q=murder`), so a search
 * survives a reload and can be shared as a link.
 */
export function useSearchParam(name: string) {
  const [value, setValue] = useState(() => readParam(name))

  const update = useCallback(
    (next: string) => {
      setValue(next)
      const url = new URL(window.location.href)
      if (next) {
        url.searchParams.set(name, next)
      } else {
        url.searchParams.delete(name)
      }
      window.history.replaceState(window.history.state, '', url)
    },
    [name],
  )

  return [value, update] as const
}

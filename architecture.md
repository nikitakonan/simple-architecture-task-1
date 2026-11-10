# Architecture

These rules describe how code in this app is organised. The goal is to keep the
UI separate from the logic, in the spirit of the **MVP (Model–View–Presenter)**
pattern:

| Layer         | Where it lives                    | Responsibility                                          |
| ------------- | --------------------------------- | ------------------------------------------------------- |
| **Model**     | `src/api/`, `src/hooks/`          | Talking to the API, data types, reusable non-UI logic   |
| **Presenter** | `usePresenter.ts` next to a view  | State, effects, event handlers, derived data for a view |
| **View**      | `index.tsx` of a component folder | Rendering only: takes data from the presenter or props  |

## 1. Folder layout

```
src/
├── api/                      # Model: HTTP client and API types
│   ├── tvmaze.ts
│   └── types.ts
├── hooks/                    # Reusable non-UI hooks (useDebounce, useShowSearch, ...)
│   ├── useDebounce.ts
│   └── useDebounce.test.ts
├── ui/                       # App-wide UI primitives that know nothing about the domain
│   ├── Button/
│   ├── Chip/
│   └── Spinner/
├── components/               # App-wide components that know about the domain
│   └── ErrorState/
├── pages/
│   └── HomePage/
│       ├── index.tsx             # the HomePage component itself
│       ├── HomePage.module.css
│       ├── HomePage.test.tsx
│       ├── usePresenter.ts
│       ├── usePresenter.test.ts
│       ├── useSearchParam.ts     # local hooks used only by this presenter
│       ├── useGenreFilter.ts
│       ├── useGenreFilter.test.ts
│       ├── usePagination.ts
│       ├── usePagination.test.ts
│       ├── Header/               # used once by HomePage: its own folder, next to the parent
│       │   ├── index.tsx
│       │   ├── Header.module.css
│       │   └── Header.test.tsx
│       ├── ShowCard/             # used once by HomePage (inside a .map)
│       │   ├── index.tsx
│       │   ├── ShowCard.module.css
│       │   └── ShowCard.test.tsx
│       └── components/           # reused inside HomePage's subtree
│           └── Pagination/
│               ├── index.tsx
│               ├── Pagination.module.css
│               └── Pagination.test.tsx
├── test/
│   └── setup.ts
├── index.css                 # Global resets and CSS variables only
└── main.tsx
```

## 2. Every component lives in its own folder

Two rules apply to **every** component, with no exceptions for small or
single-use ones:

1. **One component per file.** A file defines exactly one React component, and
   that file is always the `index.tsx` of the component's folder. There are no
   flat component files like `HomePage/Header.tsx`, and no second "helper"
   component declared next to the main one in the same file. If you need
   another component, give it its own folder.
2. **Every component has its own folder.** This holds for single-use children
   that live directly in the parent's folder (section 3), not only for
   components in `components/`, `src/components/`, or `src/ui/`. If the
   component has logic, its `usePresenter.ts` goes in the same folder; a
   component without logic has no presenter (see section 4).

A component folder is named after the component (PascalCase) and contains:

| File                   | Required | Purpose                                                      |
| ---------------------- | -------- | ------------------------------------------------------------ |
| `index.tsx`            | yes      | The component itself (the view) and the folder's entry point |
| `Component.module.css` | yes\*    | The component's styles (CSS Modules only)                    |
| `Component.test.tsx`   | yes      | Tests for the rendered view                                  |
| `usePresenter.ts`      | if logic | All of the component's logic                                 |
| `usePresenter.test.ts` | if logic | Tests for the logic, with `renderHook`                       |
| `useSomething.ts`      | optional | Local hooks the presenter is split into (see section 5)      |
| `Child/`               | optional | Child components that are used once (see section 3)          |
| `components/`          | optional | Child components that are reused in this subtree             |

\* You can skip the CSS module only if the component renders no elements of its
own, for example a component that only composes other components.

The component is written directly in `index.tsx`; there is no separate
`Component.tsx` file and no re-export file. `index.tsx` exports only the public
component (and its props type if other code needs it).

Code outside the folder **always imports the folder itself**, which resolves to
`index.tsx`. It never imports the other files inside it:

```ts
// ✅ good
import { HomePage } from './pages/HomePage'
import { Chip } from '../../ui/Chip'

// ❌ bad: reaches into another component's internals
import { usePresenter } from './pages/HomePage/usePresenter'
import styles from '../../ui/Chip/Chip.module.css'
```

Use named exports only; don't use default exports.

## 3. Where a child component goes

Answer these questions in order:

1. **Is it used across the whole app (by more than one page or feature)?**
   Put it in a root folder:
   - `src/ui/` holds generic primitives with no domain knowledge: `Button`,
     `Chip`, `Spinner`, `Input`. They take only plain props such as `label`,
     `onClick`, and `selected`, and never import from `api/` or use domain types
     like `Show`.
   - `src/components/` holds shared components that know about the domain:
     `ErrorState`, or a `ShowCard` if several pages show it.
2. **Is it reused inside one parent's subtree (rendered from two or more places
   in it)?** Put it in that parent's `components/` folder, as a full component
   folder: `HomePage/components/Pagination/`.
3. **Is it used only once, by one parent?** Put it in its own component folder
   directly inside the parent's folder: `HomePage/Header/`, with `index.tsx`,
   `Header.module.css`, `Header.test.tsx`, and `usePresenter.ts` if it has
   logic. It isn't
   exported from the parent's `index.tsx`; it's an implementation detail.

"Used once" means a single place in the JSX. A component rendered inside one
`.map()` is still used once.

A single-use child is a full component folder like any other (section 2). If
it needs its own state or effects, add a `usePresenter.ts` to its folder. A
folder holds only one `usePresenter.ts`, so giving every component a folder
keeps the rule "one presenter per view".

### Moving a component when its usage changes

- A single-use child starts being used in a second place in the subtree → move
  its folder into the parent's `components/`.
- A component in `Page/components/` is needed by another page → move it to
  `src/components/` (or to `src/ui/` if it has no domain knowledge).
- Never import from another component's `components/` folder. If you need
  something from there, move it up.

## 4. Logic lives in `usePresenter.ts`

The view (`index.tsx`) only renders. It:

- calls **one** hook, `usePresenter()` (or `usePresenter(props)` when the
  presenter needs the props), and nothing else (`useState`, `useEffect`, and
  data hooks go in the presenter), or no hook at all if it has no logic;
- maps the presenter's values to JSX and connects event handlers;
- doesn't compute derived data (filtering, slicing, counting); the presenter
  returns it ready to render.

The presenter (`usePresenter.ts`):

- holds the state, effects, and event handlers;
- composes hooks: shared ones from `src/hooks/` (like `useDebounce`) and local
  ones from its own folder (like `useSearchParam`);
- reaches `src/api/` only through hooks; it never calls `fetch` directly;
- returns a plain object with everything the view needs, already derived;
- never returns JSX and never imports CSS.

`usePresenter.ts` is optional. Components without logic (most `ui/`
primitives, many single-use children) don't have one; they just render their
props. Add a presenter as soon as a component needs state, effects, or derived
data. When the presenter needs the component's props, declare the props type
in `usePresenter.ts` and call `usePresenter(props)` from the view.

### Example: HomePage

```ts
// src/pages/HomePage/usePresenter.ts
import { useDebounce } from '../../hooks/useDebounce'
import { useShowSearch } from '../../hooks/useShowSearch'
import { useGenreFilter } from './useGenreFilter'
import { usePagination } from './usePagination'
import { useSearchParam } from './useSearchParam'

const PAGE_SIZE = 3

export function usePresenter() {
  const [query, setQuery] = useSearchParam('q') // local: syncs with ?q= in the URL
  const debouncedQuery = useDebounce(query, 400) // shared
  const { shows, status, error } = useShowSearch(debouncedQuery) // shared

  // local: unique genres + the memoized list filtered by the selected one;
  // resets the selection when `shows` changes
  const { genres, selectedGenre, selectGenre, filteredShows } =
    useGenreFilter(shows)

  // local: goes back to page 1 whenever `filteredShows` changes
  const { page, pageCount, setPage, pageItems } = usePagination(
    filteredShows,
    PAGE_SIZE,
  )

  return {
    query,
    changeQuery: setQuery,
    genres,
    selectedGenre,
    selectGenre,
    visibleShows: pageItems,
    page,
    pageCount,
    setPage,
    status,
    error,
  }
}
```

The presenter reads like a summary of the page's behaviour: each step is a
small hook in the same folder or in `src/hooks/`. One of the local hooks:

```ts
// src/pages/HomePage/usePagination.ts
import { useState } from 'react'

export function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1)
  const [prevItems, setPrevItems] = useState(items)

  // A new list (new search or genre) starts again from the first page.
  // `items` must be memoized by the caller, or this resets on every render.
  if (items !== prevItems) {
    setPrevItems(items)
    setPage(1)
  }

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize)

  return { page, pageCount, setPage, pageItems }
}
```

```tsx
// src/pages/HomePage/index.tsx
import { ErrorState } from '../../components/ErrorState'
import { Chip } from '../../ui/Chip'
import { Spinner } from '../../ui/Spinner'
import { Pagination } from './components/Pagination'
import { Header } from './Header'
import styles from './HomePage.module.css'
import { ShowCard } from './ShowCard'
import { usePresenter } from './usePresenter'

export function HomePage() {
  const {
    query,
    changeQuery,
    genres,
    selectedGenre,
    selectGenre,
    visibleShows,
    page,
    pageCount,
    setPage,
    status,
    error,
  } = usePresenter()

  return (
    <main className={styles.page}>
      <Header query={query} onQueryChange={changeQuery} />

      {status === 'loading' && <Spinner />}
      {status === 'error' && <ErrorState message={error} />}

      {status === 'success' && (
        <>
          <div className={styles.genres}>
            <Chip
              label="All"
              selected={selectedGenre === null}
              onClick={() => selectGenre(null)}
            />
            {genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                selected={genre === selectedGenre}
                onClick={() => selectGenre(genre)}
              />
            ))}
          </div>

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          <ul className={styles.list}>
            {visibleShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ul>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </main>
  )
}
```

Notes on this example:

- `Header` and `ShowCard` are each used in one place → their own folders
  directly in `HomePage/` (`HomePage/Header/`, `HomePage/ShowCard/`).
- `Pagination` is rendered twice (above and below the list) → it goes in
  `HomePage/components/Pagination/`.
- `Chip` and `Spinner` are generic → `src/ui/`. `ErrorState` is shared by
  pages → `src/components/`.

### Example: a single-use child without logic

```tsx
// src/pages/HomePage/Header/index.tsx
import styles from './Header.module.css'

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
}

export function Header({ query, onQueryChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>TV Shows Explorer</h1>
      <input
        className={styles.search}
        type="search"
        aria-label="Search shows"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </header>
  )
}
```

`Header` has no state or derived data, so its folder has no `usePresenter.ts`.
It is still a folder (`HomePage/Header/`), not a flat `HomePage/Header.tsx`.

### Example: a UI primitive

```tsx
// src/ui/Chip/index.tsx
import styles from './Chip.module.css'

export type ChipProps = {
  label: string
  selected?: boolean
  onClick: () => void
}

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
```

## 5. At most 120 lines per file

No file may be longer than **120 lines**, counted as formatted by Biome and
including imports. This applies to every source file: components, presenters,
hooks, API modules, CSS modules, and tests. When a file grows past the limit,
split it:

| What is too long       | How to split it                                                                   |
| ---------------------- | --------------------------------------------------------------------------------- |
| A view (`index.tsx`)   | Extract child components and place them by the rules in section 3                 |
| `usePresenter.ts`      | Extract local hooks into the same folder: `useSearchParam.ts`, `usePagination.ts` |
| A local or shared hook | Extract smaller hooks or plain helper functions                                   |
| A CSS module           | Usually means the component needs children; their styles move with them           |
| A test file            | Test extracted hooks and children in their own test files                         |
| An `api/` module       | One file per resource (`shows.ts`, `people.ts`), types in `types.ts`              |

### Local hooks

A presenter can import:

- **Local hooks from its own folder**: `HomePage/useSearchParam.ts`,
  `HomePage/useGenreFilter.ts`. Use these for logic that belongs to this
  component only.
- **Shared hooks from `src/hooks/`**: `useDebounce`, `useShowSearch`. Use these
  for logic that more than one component needs.

Rules for local hooks:

- Each local hook is one file named after the hook (`useGenreFilter.ts`), with
  its own `useGenreFilter.test.ts` when it has logic worth testing.
- Only the presenter of the same folder (or another local hook in that folder)
  imports a local hook. The view never calls them, and other folders never
  import them.
- When a second component needs a local hook, move it to `src/hooks/`.

## 6. Model layer: `api/` and `hooks/`

- `src/api/` holds plain TypeScript with no React: request functions and
  response types. Every request function accepts an `AbortSignal` so callers
  can cancel it.

  ```ts
  // src/api/tvmaze.ts
  import type { SearchResult } from './types'

  const BASE_URL = 'https://api.tvmaze.com'

  export async function searchShows(
    query: string,
    signal?: AbortSignal,
  ): Promise<SearchResult[]> {
    const response = await fetch(
      `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
      { signal },
    )
    if (!response.ok) {
      throw new Error(`TVmaze request failed: ${response.status}`)
    }
    return response.json()
  }
  ```

- `src/hooks/` holds reusable hooks that aren't tied to one view:
  `useDebounce`, and `useShowSearch`, which wraps `searchShows` with an
  `AbortController` and the loading, error, and success states. Presenters use
  these hooks; views never import them.

## 7. Dependency rules

Imports may only point "down" this list:

```
pages  →  components  →  ui
  │           │
  └─────┬─────┘
        ▼
      hooks  →  api
```

- `ui/` imports nothing from `api/`, `hooks/`, `components/`, or `pages/`.
- `components/` never imports from `pages/`.
- `api/` imports nothing from React or from the rest of the app.
- A child never imports from its parent. Data goes down through props, and
  events come up through callbacks.
- A view imports its own `usePresenter`, child components, and its CSS module.
  It never imports from `hooks/` or `api/` (type-only imports of API types for
  props are fine), and never imports the local hooks in its own folder.
- Local hooks (`HomePage/usePagination.ts`) are imported only by the presenter
  and other local hooks in the same folder.

## 8. Tests

- Every component folder has `Component.test.tsx`, which tests what the user
  sees and does with Testing Library (queries by role or label, not by class
  name).
- Every `usePresenter.ts` has `usePresenter.test.ts`, which tests the logic
  with `renderHook` and `act`, without rendering any markup.
- A view test may mock its presenter to check each state (loading, error,
  empty, results) in isolation:

  ```tsx
  // src/pages/HomePage/HomePage.test.tsx
  import { render, screen } from '@testing-library/react'
  import { HomePage } from '.'
  import { usePresenter } from './usePresenter'

  vi.mock('./usePresenter')

  const basePresenter = {
    query: '',
    changeQuery: vi.fn(),
    genres: [],
    selectedGenre: null,
    selectGenre: vi.fn(),
    visibleShows: [],
    page: 1,
    pageCount: 1,
    setPage: vi.fn(),
    status: 'idle',
    error: null,
  } satisfies ReturnType<typeof usePresenter>

  describe('HomePage', () => {
    it('shows a spinner while loading', () => {
      vi.mocked(usePresenter).mockReturnValue({
        ...basePresenter,
        status: 'loading',
      })
      render(<HomePage />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
  ```

- Single-use children are component folders, so they have their own
  `Component.test.tsx` too (`HomePage/Header/Header.test.tsx`). The parent's
  test doesn't need to repeat what the child's test already covers.

## 9. Checklist for a new component

- [ ] Decide where it goes: `ui/`, `components/`, the parent's `components/`,
  or a folder directly inside the parent's folder (section 3).
- [ ] Create the folder with `index.tsx` (the component itself),
  `Component.module.css`, and `Component.test.tsx`, even if the component is
  small or used once.
- [ ] Keep one component per file: `index.tsx` defines only this component.
- [ ] If it has logic, put it in `usePresenter.ts` and test it in
  `usePresenter.test.ts`.
- [ ] Make sure the view calls only `usePresenter()` / `usePresenter(props)`
  (or no hook at all) and renders.
- [ ] Keep every file at 120 lines or fewer; split views into children and
  presenters into local hooks (section 5).
- [ ] Import other components only by their folder path, never their inner
  files.
- [ ] Run `npm run check` and `npm run test:run`.

## 10. How these rules are enforced

`npm run check` runs Biome, which checks most of these rules automatically. The
config is in `biome.json`; a custom GritQL rule is in `biome-plugins/`.

| Rule                                                  | Biome check                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| At most 120 lines per file (TS, TSX, CSS)             | `style/noExcessiveLinesPerFile`                               |
| Named exports only (except `*.config.ts`)             | `style/noDefaultExport`                                       |
| Import a component by its folder, not its inner files | `style/noRestrictedImports`, all files                        |
| A view imports only its own `usePresenter`            | `style/noRestrictedImports`, override for `src/**/index.tsx`  |
| A view calls only `usePresenter()`                    | plugin `biome-plugins/view-only-presenter.grit`               |
| `ui/` doesn't depend on app code                      | `style/noRestrictedImports`, override for `src/ui/**`         |
| `components/` never imports from `pages/`             | `style/noRestrictedImports`, override for `src/components/**` |
| `api/` has no React or app imports                    | `style/noRestrictedImports`, override for `src/api/**`        |

Things to know when changing the config:

- When several overrides match a file, the last one **replaces** the
  `noRestrictedImports` options of the others instead of merging them. That's
  why every override repeats the "import by folder" pattern. Keep it in each
  new override too.
- Import patterns match the import path as written. A relative import that
  doesn't name the folder, like `../HomePage/usePresenter` from a sibling
  page, isn't caught.
- The view rules apply to `index.tsx` files. Since every component lives in
  an `index.tsx` (section 2), they cover every component; a component in any
  other file escapes them, which is one more reason not to write one.

These rules can't be checked by Biome, so they stay with code review and the
checklist above:

- every component folder has its `.module.css` and `.test.tsx` files;
- a file defines only one component, and only in `index.tsx` (no flat
  component files like `Header.tsx`);
- a component is placed by how often it's used (section 3);
- a child never imports from its parent;
- a presenter returns no JSX and imports no CSS.

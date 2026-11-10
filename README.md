# TV Shows Explorer

A small React app for searching and browsing TV shows with the public [TVmaze API](https://www.tvmaze.com/api). It is homework #1; the full spec (in Russian) is in [task.md](task.md).

## Features

- [x] **Search:** shows are fetched from `https://api.tvmaze.com/search/shows?q=<query>`, and the API does the filtering. The page starts with only a search field and a few suggested queries. The query is kept in the URL (`?q=murder`), so a search survives a reload and can be shared as a link.
- [x] **Pagination:** results are shown 3 per page, with controls to move between pages.
- [x] **Genre filter:** the unique genres from the current results are shown as clickable chips above the list, with a count for each. Selecting one shows only the shows in that genre, and the filter can be reset. Pagination applies to the filtered list.
- [x] **UX:** input is debounced instead of sending a request per keystroke, outdated requests are cancelled with `AbortController`, and loading, error (with a retry button) and empty states are handled. While a new search loads, the previous results stay on screen.
- [x] **Stretch goal:** data fetching is written by hand, without `useQuery`.

## Tech stack

- [Vite](https://vite.dev/), [React](https://react.dev/) 19 and TypeScript
- CSS Modules for styling
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for tests
- [Biome](https://biomejs.dev/) for linting and formatting

## Getting started

Requires Node.js 20.19+ or 22.12+ (developed on Node 24).

```sh
npm install
npm run dev
```

## Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start the dev server                             |
| `npm run build`     | Type-check and build for production into `dist/` |
| `npm run preview`   | Serve the production build locally               |
| `npm run typecheck` | Type-check only                                  |
| `npm test`          | Run tests in watch mode                          |
| `npm run test:run`  | Run all tests once                               |
| `npm run check`     | Run Biome lint, format check and import sorting  |
| `npm run check:fix` | Apply Biome fixes and formatting                 |
| `npm run lint`      | Biome lint only                                  |
| `npm run format`    | Format all files with Biome                      |

To run a single test file: `npx vitest run src/pages/HomePage/HomePage.test.tsx` (add `-t "<name>"` to filter by test name).

## Project structure

The code follows a Model–View–Presenter split. The full rules are in [architecture.md](architecture.md).

```
src/
  main.tsx                # entry point, renders HomePage
  index.css               # global styles (reset, root variables)
  api/                    # Model: TVmaze client and response types (no React)
  hooks/                  # shared non-UI hooks: useDebounce, useShowSearch
  ui/                     # generic UI primitives with no domain knowledge (Chip)
  components/             # shared components that know the domain (ErrorState)
  pages/
    HomePage/
      index.tsx           # the page view
      HomePage.module.css
      HomePage.test.tsx
      usePresenter.ts     # all of the page's logic
      usePresenter.test.ts
      useSearchParam.ts   # local hooks used only by this presenter
      useGenreFilter.ts
      usePagination.ts
      Header/             # child components used once by the page,
      SearchField/        # each in its own folder
      IdleState/
      LoadingState/
      EmptyState/
      GenreFilter/
      ShowCard/           # has its own usePresenter.ts (formats a show)
      Pagination/         # has its own usePresenter.ts (page buttons state)
  test/
    setup.ts              # Vitest setup: jest-dom matchers, cleanup
```

## Conventions

- One component per file. Every component, even a small single-use one, is its own folder: `index.tsx` (the view), `Component.module.css` and `Component.test.tsx`.
- Logic lives in `usePresenter.ts` next to the view, and the view only calls `usePresenter()` and renders. A component without logic has no presenter.
- Other code imports a component by its folder (`./ShowCard`), never by its inner files.
- No file is longer than 120 lines.
- Styling uses CSS Modules only. Only resets and root variables go in global CSS.
- Tests sit next to the code they test, as `*.test.ts(x)`.
- Code style and most architecture rules are enforced by Biome (`npm run check`): 2-space indent, single quotes, no semicolons and trailing commas.

# TV Shows Explorer

A small React app for searching and browsing TV shows with the public [TVmaze API](https://www.tvmaze.com/api). It is homework #1; the full spec (in Russian) is in [task.md](task.md).

## Features

Status: the project is scaffolded, and the features below are not implemented yet.

- [ ] **Search:** shows are fetched from `https://api.tvmaze.com/search/shows?q=<query>`, and the API does the filtering. The page starts with only a search field and an empty list.
- [ ] **Pagination:** results are shown 3 per page, with controls to move between pages.
- [ ] **Genre filter:** the unique genres from the current results are shown as clickable chips above the list. Selecting one shows only the shows in that genre, and the filter can be reset.
- [ ] **UX:** input is debounced instead of sending a request per keystroke, outdated requests are cancelled, and loading, error and empty states are handled.
- [ ] **Stretch goal:** data fetching is written by hand, without `useQuery`.

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

To run a single test file: `npx vitest run src/pages/HomePage.test.tsx`.

## Project structure

```
src/
  main.tsx              # entry point, renders HomePage
  index.css             # global styles (reset, root variables)
  pages/
    HomePage.tsx
    HomePage.module.css
    HomePage.test.tsx
  test/
    setup.ts            # Vitest setup: jest-dom matchers, cleanup
```

## Conventions

- Each component has its own `Component.module.css` next to it. Only resets and root variables go in global CSS.
- Tests sit next to the code they test, as `*.test.tsx`.
- Code style is enforced by Biome: 2-space indent, single quotes, no semicolons and trailing commas.

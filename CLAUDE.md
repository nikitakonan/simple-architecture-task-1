# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check (`tsc -b`) and build for production
- `npm run typecheck`: type-check only
- `npm run check`: Biome lint + format check + import sorting (run this before finishing a change)
- `npm run check:fix`: apply Biome's safe fixes and formatting
- `npm run lint` / `npm run format`: Biome lint only / format only (with `--write`)
- `npm test`: run Vitest in watch mode
- `npm run test:run`: run all tests once
- `npx vitest run src/pages/HomePage/HomePage.test.tsx`: run a single test file (add `-t "<name>"` to filter by test name)

## Stack and setup

- Vite + React 19 + TypeScript. The entry point `src/main.tsx` renders `HomePage` (`src/pages/HomePage/`) directly, so there is no router yet.
- Vitest + Testing Library, configured in `vite.config.ts` under `test`: jsdom, `globals: true` (so `describe`/`it`/`expect` need no imports), and the setup file `src/test/setup.ts`, which loads the jest-dom matchers and runs cleanup.
- **Follow `architecture.md`** for where code goes. In short: each component is a folder whose `index.tsx` is the component itself, next to `Component.module.css`, `Component.test.tsx`, and `usePresenter.ts` (all logic; the view only calls `usePresenter()`). No file may exceed 120 lines. Pages live in `src/pages/`, shared components in `src/components/` and `src/ui/`.
- **Styling uses CSS Modules only:** import a component's styles as `import styles from './Component.module.css'`. Global CSS is limited to `src/index.css` (resets and root variables).
- **Biome** (`biome.json`) is the only linter and formatter; there is no ESLint or Prettier. Code style is 2-space indent, single quotes, no semicolons, and trailing commas. Biome's React and test rule sets are enabled, and `public/` is excluded. Biome also enforces the architecture rules (import restrictions per folder, the 120-line limit, named exports, and the GritQL plugin in `biome-plugins/`); see section 10 of `architecture.md`.

`task.md` is the homework spec (written in Russian).

## What is being built

"TV Shows Explorer" is a small React app that searches TV shows through the public TVmaze API.

- **Search:** `GET https://api.tvmaze.com/search/shows?q=<query>`. The API does the filtering by query. The response is an array of `{ score, show }`, and genres are in `show.genres`.
- **Initial state:** an empty list and a search field only.
- **Pagination:** client-side, **3 items per page**, with controls to switch pages.
- **Genre filter:** collect the unique genres from the current search results and show them as clickable chips above the list. Selecting a chip filters the list to shows with that genre, and there must be a way to reset the filter. Pagination applies to the filtered list.

## Requirements to keep in mind

- **UX is graded:** debounce input instead of sending a request on every keystroke, cancel in-flight requests when the query changes (for example with `AbortController`), and handle loading, error, and empty states explicitly.
- **Stretch goal:** implement the data-fetching layer by hand, without `useQuery` (TanStack Query). Don't add react-query unless the user asks for it.
- **Design is free-form:** there is no mockup, and a polished, original UI is encouraged.
- The repo is named "simple-architecture", so keep a clear separation between the API client, the data-fetching/state logic (hooks), and presentational components.

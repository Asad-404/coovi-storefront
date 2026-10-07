@AGENTS.md

## Commands

Run from this repository with pnpm 10.28.2:

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm coverage
```

## Project rules

- This is a Next.js 16 App Router storefront. Keep Server Components as the default; use Client Components only for browser state, events, or APIs that require them.
- Zustand persists the guest cart in the browser. Checkout must use the API contract and send product IDs and quantities; the API remains authoritative for prices, stock, delivery fees, and totals.
- Read the relevant Next.js guide under `node_modules/next/dist/docs/` before changing Next.js-specific code. The imported `AGENTS.md` contains the generated version-specific rule; do not duplicate or remove it.
- The API contract shared with the other apps is `..\API_ENDPOINTS.md`.

### Design rules

- Keep the page layout as it is; restyle within the existing structure rather than moving, adding or removing sections.
- Use the brand tokens in `app/globals.css` (colours and the named `text-nav` / `text-title-*` sizes) instead of one-off hex or `text-[Npx]` values.
- One corner radius: `rounded-sm` for buttons, badges, cards and panels. Only truly circular things (icon buttons, dots, the logo dot) use `rounded-full`. Buttons use `.btn` with `.btn-primary` or `.btn-secondary`.
- Sentence case for all labels, buttons and headings; no all-caps labels, no "→" appended to button text.
- Dialogs and pop-out panels use `lib/useDialog.ts` for Escape, focus and scroll handling.

### Testing and CI

- Vitest runs `*.test.ts(x)` files placed next to the code they cover. The default environment is Node; add `// @vitest-environment jsdom` to files that need browser APIs such as `localStorage`.
- Keep `lib/` at full coverage: add or update tests with any change to `lib/api.ts`, `lib/cartStore.ts` or `lib/utils.ts`. Mock `fetch` with `vi.stubGlobal`; never call a real API from tests.
- `pnpm typecheck` runs `next typegen` first because `PageProps` and `LayoutProps` are generated globals; plain `tsc` fails without them.
- GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck and tests with coverage on every pull request and push to `master`. Keep it green.

### Manual operation

Do not start the dev server, build, lint, or preview commands automatically; the workspace owner runs them manually.


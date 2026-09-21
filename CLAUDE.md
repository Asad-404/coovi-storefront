@AGENTS.md

## Commands

Run from this repository with pnpm 10.28.2:

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Project rules

- This is a Next.js 16 App Router storefront. Keep Server Components as the default; use Client Components only for browser state, events, or APIs that require them.
- Zustand persists the guest cart in the browser. Checkout must use the API contract and send product IDs and quantities; the API remains authoritative for prices, stock, delivery fees, and totals.
- Read the relevant Next.js guide under `node_modules/next/dist/docs/` before changing Next.js-specific code. The imported `AGENTS.md` contains the generated version-specific rule; do not duplicate or remove it.
- The API contract shared with the other apps is `..\API_ENDPOINTS.md`.

### Manual operation

Do not start the dev server, build, lint, or preview commands automatically; the workspace owner runs them manually.


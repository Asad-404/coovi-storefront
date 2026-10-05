# Coovi Storefront

The customer-facing storefront for Coovi, an online saree shop serving customers across Bangladesh. Shoppers browse products, keep a guest cart in the browser, check out with Cash on Delivery, and track orders by order number and phone.

Built with Next.js 16 (App Router), React 19, Tailwind CSS 4 and Zustand.

## Getting started

Requires Node.js 20.9+ and pnpm 10.28.2 (pinned via `packageManager`).

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The storefront needs the Coovi API running; by default it calls `http://localhost:5000/api`.

### Environment variables

Set these in `.env.local`:

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Base URL of the Coovi API |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL, used for metadata, the sitemap and WhatsApp share links |

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Generate Next.js route types (`next typegen`), then run `tsc --noEmit` |
| `pnpm test` | Run the test suite once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm coverage` | Run tests with a coverage report (written to `coverage/`, open `coverage/index.html`) |

## Testing

Tests use [Vitest](https://vitest.dev) and live next to the code they cover as `*.test.ts(x)`. The default environment is Node; files that need browser APIs opt in with a `// @vitest-environment jsdom` comment at the top (see `lib/cartStore.test.ts`).

Covered today, at 100% line and branch coverage:

- `lib/api.ts`: request URLs and query params, error and timeout handling, and that orders send only product IDs and quantities
- `lib/cartStore.ts`: cart actions, `localStorage` persistence, totals and counts
- `lib/utils.ts`: price formatting

Components and pages are not tested yet.

## Continuous integration

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and on pushes to `master`, as three parallel jobs:

- **Lint**: `pnpm lint`
- **Typecheck**: `pnpm typecheck`
- **Test**: `pnpm coverage`, with the coverage report uploaded as a build artifact for 14 days

## Project structure

```
app/          Routes: home, products/[slug], cart, checkout,
              order-confirmation/[orderNumber], track-order, about, contact
components/   UI components (cart drawer, filters, product card, gallery, ...)
lib/
  api.ts        API client (fetch with an 8s timeout)
  cartStore.ts  Zustand guest cart, persisted to localStorage as "coovi-cart"
  types.ts      Shared types for products, cart items and orders
  utils.ts      Formatting helpers
```

## How the cart and checkout work

The cart lives only in the browser. At checkout the storefront sends the customer's details plus product IDs and quantities, and nothing else. The API is authoritative for prices, stock, delivery fees and totals, and recomputes them from its own database. The API contract shared with the other Coovi apps is `../API_ENDPOINTS.md`.

## Deployment

Any Next.js host works. Run `pnpm build` and `pnpm start`, or deploy to [Vercel](https://vercel.com). Set both environment variables in production. Product images are allowed from `images.unsplash.com` and `picsum.photos` (see `next.config.ts`).

## Summary

<!-- What does this PR change, and why? -->

## Related issue

<!-- e.g. Closes #12. Delete this section if there is none. -->

## Type of change

- [ ] Bug fix
- [ ] New feature or page
- [ ] Styling or content
- [ ] Refactor or cleanup
- [ ] Dependencies or tooling

## Screenshots

<!-- Before/after screenshots for UI changes, ideally on desktop and mobile. Delete this section if there is none. -->

## How was this tested?

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test` (or `pnpm coverage`)
- [ ] Checked the change in the running app

## Checklist

- [ ] Server Components remain the default; any new `"use client"` is needed for browser state, events or browser APIs
- [ ] Checkout sends only product IDs and quantities; prices, stock, delivery fees and totals come from the API
- [ ] `lib/` stays at full coverage, with tests updated for changes to `lib/api.ts`, `lib/cartStore.ts` or `lib/utils.ts`
- [ ] Tests mock `fetch` and never call a real API
- [ ] Requests match `API_ENDPOINTS.md`, and the contract is updated if it changed
- [ ] No credentials or real environment values are committed

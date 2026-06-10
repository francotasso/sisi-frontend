# Sisi — Beauty Products Catalog

## Tech Stack
- **Next.js 15** (App Router) + **React 19** + **TypeScript 6** (strict)
- **Tailwind CSS v4** (PostCSS `@tailwindcss/postcss`)
- **Redux Toolkit** + **redux-persist** (persisted to localStorage)
- **Vitest** + **React Testing Library** (unit + component tests)

## Commands
| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build (both required before PR) |
| `npm run lint` | `next lint` (ESLint) |
| `npm run test` | Vitest (single run) |
| `npm run test:watch` | Vitest (watch mode) |

## Architecture

### Folder Layout
```
data/                          JSON data sources
  products.json                32 beauty products (truth source)
  store-info.json              Store branding info
app/                           Next.js App Router pages
  page.tsx                     Home (catalog)
  wishlist/page.tsx            Wishlist page
  product/[slug]/page.tsx      Product detail (SSG, generateStaticParams)
  api/products/route.ts        JSON products API endpoint
  sitemap.ts                   Dynamic sitemap generation
features/                      Feature modules (domain-driven)
  catalog/                     Catalog listing, filtering, search
  product/                     Product detail
  wishlist/                    Wishlist with WhatsApp ordering
shared/
  store/                       Redux: wishlistSlice only (cart was removed)
  components/                  AppHeader, Footer, Providers, SafeImage, SearchDropdown
  utils/constants.ts           WhatsApp number, store name, config
  hooks/                       Shared hooks
```

### Data Flow
- `data/products.json` → `productsRepository.ts` (in-memory JSON read) → `catalogService.ts` → pages
- `app/api/products/route.ts` exposes same data as JSON endpoint
- Products are SSG (`generateStaticParams` for `[slug]`)

### Key Business Rules
- **New product detection**: `createdAt ≤ 14 days` via `catalogService.isNewProduct()`
- **Discount price**: `discountPrice` field in JSON (marketing-only, no calculation). UI shows original struck through + discount price + `-X%` badge. `catalogService.getDiscountPercentage()` computes the percentage. Sort by price uses `discountPrice ?? price`.
- **WhatsApp ordering only**: No cart. Order via `wa.me/${WHATSAPP_NUMBER}?text=...`
- **Wishlist sharing**: `?items=id1,id2,id3` query param on `/wishlist`

### Persisted State
- Only `wishlist` slice is persisted to localStorage (key: `persist:root`)
- `shared/store/index.ts` whitelist controls this — modifying requires updating whitelist

## Design System
- **`DESIGN.md`** is the single source of truth for all UI decisions (colors, typography, spacing, rounded corners, components, animations).
- All UI changes must follow the tokens and guidance in `DESIGN.md`. Do not introduce colors, font sizes, padding, border radii, shadows, or component styles that contradict it.

## Styling
- All styles in `app/globals.css` (Tailwind directives + custom CSS classes)
- Custom palette: fuchsia `#d4145a`, gold `#c9a84c`, cream background `#fdf6f0`
- Light mode only (no dark mode, no media query toggle)
- Mobile-first responsive, class names prefixed (e.g. `.wishlist-page`, `.catalog-page`, `.product-detail`)

## Conventions
- **Code is always English**: variable names, function names, types, comments, file names — all in English
- **UI is Spanish**: all user-facing strings (labels, messages, descriptions, alt text, etc.) in Spanish

## Path Aliases
- `@/*` maps to project root (`tsconfig.json`: `"paths": { "@/*": ["./*"] }`)

## Test Infrastructure
- Tests in `features/**/__tests__/` (colocated with source)
- `shared/test/testUtils.tsx` provides `renderWithProviders()` (wraps Redux Provider + mocked Next.js Link), `createProduct()` fixture factory, `createTestStore()`
- `shared/test/setup.ts` loads `@testing-library/jest-dom/vitest` matchers
- All tests must pass before PR (`npm run test && npm run build`)
- Run `npm run test:watch` during development for quick feedback

## Gotchas
- `useSearchParams()` in Next.js 15 **requires `<Suspense>` boundary** — always wrap components using it
- `sharedItemIds` passed as prop must be **memoized** (`useMemo`) — creating new array reference per render causes infinite `useEffect` loop
- Redux store uses `combineReducers` + `persistReducer` — store shape is `{ wishlist: WishlistState }`
- No `next/image` — use custom `<SafeImage>` with `width`/`height` props supported
- Product specs keys are English (`brand`, `type`, `shade`, `finish`, `size`, etc.) — mapped to Spanish labels in `ProductSpecs.tsx`
- Product type uses `shortDescription` (not `descripcionCorta`)

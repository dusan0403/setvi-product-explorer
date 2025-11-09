# Product Explorer

A React-based product browsing application with infinite scrolling, search, filtering, and an "AI-powered" summary feature.

## Setup & Run

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=https://dummyjson.com
VITE_API_TIMEOUT=5000
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Build

```bash
npm run build
npm run preview # to preview production build
```

## Architecture Overview

### Tech Stack
- **React 19** with TypeScript
- **Vite** for bundling
- **TanStack Query** (React Query) for server state
- **React Router** for URL state management
- **React Window** for virtualized list rendering
- **Axios** for HTTP requests
- **CSS Modules** for styling

### Folder Structure

```
src/
├── core/ # Core infrastructure
│ ├── config/ # Query client setup
│ └── services/ # HTTP client (axios instance)
├── features/ # Feature-based modules
│ ├── products/ # Product browsing feature
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── services/
│ │ ├── types/
│ │ └── constants/
│ └── quotes/ # Quote fetching for "AI" summaries
├── shared/ # Shared utilities
│ ├── components/
│ ├── hooks/
│ ├── utils/
│ └── constants/
└── pages/ # Page-level components
```

### Data Flow

1. **URL as Source of Truth**: Search term, category filter, and current page are stored in URL params. This makes the app shareable and supports back/forward navigation properly.

2. **React Query**: Handles all server state. Products are fetched using `useInfiniteQuery` which automatically manages pagination. Categories are fetched once and cached for an hour.

3. **Virtualization**: The product list uses `react-window` to render only visible rows. This keeps performance smooth even with thousands of items loaded.

4. **Infinite Scroll**: As you scroll near the bottom, the app prefetches the next page. The `onRowsRendered` callback from react-window triggers `fetchNextPage` when you're within 5 items of the end.

5. **URL Syncing**: The current page in the URL updates as you scroll, but it's debounced (300ms) to avoid spamming history. This lets you bookmark or share a specific position in the list.

### Component Boundaries

**Page Level** (`ProductsPage`)

**Feature Level** (under `features/products`):
- `ProductFilters`: Search input + category dropdown. Updates URL params.
- `ProductTable`: Virtualized table that fetches and displays products.
- `ProductDetailDrawer`: Side drawer showing product details. Has a "Generate Summary" button.
- `TypewriterText`: Animates text character-by-character for the summary.

**Shared** (`shared/`):
- `SimpleSelect`: Custom accessible dropdown (no external library).
- `useDebounce`, `useClickOutside`: Reusable hooks.
- `safeLocalStorage`: Wrapper for localStorage with error handling.

## Trade-offs & What I'd Do With More Time

### Trade-offs Made

**Custom select instead of a library**: I built my own accessible dropdown rather than using something like Radix,  Shadcn or Headless UI. This was mostly for practice and to avoid adding dependencies, but in production I'd probably just use a battle-tested library.

**Basic error handling**: Errors just show a generic "Error loading products" message. There's no retry UI, no specific error types, no toast notifications.

**CSS Modules only**: No design system, no theming, just plain CSS Modules. Works fine for a small app, but doesn't scale well.

**No testing**: Zero tests. In a real app, I'd at least have tests for the hooks, especially the infinite scroll + URL sync logic which is kind of gnarly.

### What I'd Add

**Real AI**: If this were a real product, I'd integrate with an LLM API. You'd send the product title, description, reviews, and specs, and get back a proper summary. The typewriter effect would stay—it's a nice touch—but you'd cache the *actual* summary, not random quotes.

**Better UX for infinite scroll**: Right now, if you scroll fast, you might briefly see a loading spinner at the bottom. I'd add skeleton rows that blend in better. Also, the "page" in the URL is kind of an implementation detail—users don't care about page numbers. I might switch to something like a scroll position or just remove it entirely.

**Image optimization**: Product images are loaded as-is from the API. I'd add lazy loading (beyond browser native), maybe blur-up placeholders, and ideally use a CDN with automatic resizing.

**Filtering improvements**: Right now you can search OR filter by category, but not both at once.  I'd also add price range filters, rating filters, etc. Or at least sorting table columns.

**Mobile responsive**: I only spent 20 minutes on it. 

**State persistence**: If you refresh the page, your scroll position is lost. I'd save it to session storage and restore it on mount. React Query has some of this built in, but it's not perfect.

---


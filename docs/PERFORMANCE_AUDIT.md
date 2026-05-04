# Performance Audit Report

This document summarizes the performance optimizations applied and remaining recommendations.

## 1. MEMORY LEAKS — FIXED

### Landing page (`src/app/page.tsx`)
- **Issue:** Floating background elements used `setTimeout` to remove DOM nodes; timeout IDs were never stored or cleared on unmount, causing leaks and possible setState-after-unmount.
- **Fix:** Store all timeout IDs in `floatingTimeoutsRef` and clear them in the effect cleanup along with the interval.

### Zyncers search (`src/app/zyncers/page.tsx`)
- **Issue:** Debounced search used `setTimeout` in the input handler; the returned cleanup was ignored (event handler return value is not used), so timeouts were never cleared on unmount or when the user typed again.
- **Fix:** Use `searchTimeoutRef` to hold the current timeout; clear it before setting a new one in `handleInputChange` and clear on unmount in a `useEffect` cleanup.

### Already correct (no change)
- **AchievementCelebration:** `setInterval` cleared in effect return when `isOpen` changes or on unmount.
- **discover/page:** Slider interval and scroll listener have cleanup; escape key listener has cleanup.
- **usePWAInstall:** All three listeners (`beforeinstallprompt`, `appinstalled`, `load`) removed in cleanup.
- **remindModal, NotificationDropdown, createclub, magic-card, animated-modal, FuzzyText, SkipperLanding, clubs/page, resources/layout, leaderboard/layout, etc.:** Event listeners and intervals have proper cleanup.

---

## 2. UNNECESSARY RE-RENDERS — RECOMMENDATIONS

- **Discover feed:** Consider extracting a `DiscoverPostCard` component wrapped in `React.memo` and passing stable callbacks (`useCallback`) for `onCardClick`, `onToggleExpand`, `onImageClick`, `onShare` so only the affected post re-renders when expand state or votes change.
- **formatDate / getTimeAgo:** Already defined in component; if passed to memoized children, move to `useCallback` or outside the component.
- **Clubs list, events list:** Same idea — memoize list item components and pass stable props.

---

## 3. STATE OPTIMIZATION

- **Discover:** Posts are appended on infinite scroll (`setPost(prev => [...prev, ...newPosts])`). Cap is effectively the API page size (e.g. 10); consider capping total in-memory posts (e.g. max 50–100) and/or virtualizing.
- **Clubs page:** When searching, all pages are fetched and stored in `allClubs`/`data`; for very large result sets consider keeping only the current “window” or paginating on the server.

---

## 4. LIST RENDERING

- **Discover:** `posts.length` can grow with infinite scroll. If it regularly exceeds ~50 items, add virtualization (e.g. `react-window` or `@tanstack/react-virtual`) or a hard cap + “Load more” instead of infinite scroll.
- **Clubs list, events list:** Same recommendation if lists exceed ~50 items.

---

## 5. BUNDLE / IMAGE / NETWORK

- **Debug cleanup:** Removed `console.log` from ZynvoClubAnnouncement, createPost, usePWAInstall, zyncers (search). Left `console.error` in critical catch blocks where useful for production debugging.
- **Image:** Replaced `<img>` with `next/image` in `remindModal.tsx` (sign-in illustration).
- **Discover escape handler:** Added `closeImageModal` to the `useEffect` dependency array so the escape listener is correct and stable.

---

## 6. DEPENDENCY ARRAYS

- **Discover image modal escape:** Effect now depends on `[isImageModalOpen, closeImageModal]` so cleanup and handler stay correct.

---

## Summary of File Changes

| File | Change |
|------|--------|
| `src/app/page.tsx` | Clear floating element timeouts on unmount |
| `src/app/zyncers/page.tsx` | Debounce timeout ref + cleanup; remove debug logs |
| `src/app/discover/page.tsx` | Escape effect deps; remove console.error in share |
| `src/components/modals/remindModal.tsx` | Use next/image for illustration |
| `src/components/ZynvoClubAnnouncement.tsx` | Remove console.log |
| `src/app/createPost/page.tsx` | Remove console.log |
| `src/hooks/usePWAInstall.ts` | Remove console.log (user choice) |

---

## Next Steps (optional)

1. Add `React.memo` to discover post cards and pass `useCallback` handlers.
2. Introduce virtualization for discover feed if post count often exceeds 50.
3. Cap or virtualize clubs/events lists if they grow large.
4. Run Lighthouse and Chrome Memory profiler after navigation-heavy usage to confirm no leaks and good LCP/INP.

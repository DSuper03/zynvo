# Public Clubs Landing-Page Prompt

Add a responsive “Clubs” section to the landing page using:

`GET {API_BASE_URL}/api/v1/clubs/public?page=1&limit=12&collegeName={query}`

This endpoint is public and requires no `Authorization` header. Use the existing API environment variable; do not hardcode the base URL. Keep the request working for signed-out visitors.

Implement:

- A responsive grid: 1 column on mobile, 2 on tablet, and 3 on desktop.
- Club logo, with initials fallback when `profilePicUrl` is missing or broken.
- Club name, type badge, college name, clamped description, and up to 3 wings.
- Social links only when URLs exist. External links must use `target="_blank"` and `rel="noopener noreferrer"`; stop propagation so they do not trigger card navigation.
- Debounced college-name filtering (300ms), resetting to page 1.
- “Load more” pagination using `page` and `totalPages`.
- Loading skeletons, an empty state, and a retryable error state that does not break the rest of the landing page.
- If an existing club detail route exists, make cards keyboard-focusable and link to it. Otherwise render cards as non-clickable.
- Accessibility: use alt text `"{club name} logo"`, a properly labelled filter input, keyboard-focusable cards, and accessible buttons.
- Match the existing landing-page branding and styling. Do not add a new data-fetching library if the project already has one.

Use an allowed frontend origin during local development, such as `localhost:3000`.

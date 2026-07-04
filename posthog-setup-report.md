# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Zynvo. PostHog is initialized client-side via `instrumentation-client.ts` (Next.js 15.3+ pattern) with a reverse proxy through `/ingest/` to avoid ad-blocker interference. A server-side client is available at `src/lib/posthog-server.ts` for future API route usage. Environment variables are written to `.env.local`. Users are identified on every login and signup path so sessions correlate correctly across email and Google OAuth flows.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created a new account via email and password. | `src/app/auth/signup/page.tsx` |
| `user_signed_in` | User successfully signed in with email and password credentials. | `src/app/auth/signin/page.tsx` |
| `user_oauth_signup` | New user completed account creation via Google OAuth and profile form. | `src/app/auth/sso-callback/page.tsx` |
| `user_oauth_signin` | Existing user signed in successfully via Google OAuth. | `src/app/auth/sso-callback/page.tsx` |
| `event_created` | Club founder successfully created and published a new event. | `src/app/events/components/EventCreationModel.tsx` |
| `club_created` | User successfully created a new club on the platform. | `src/app/clubs/createclub.tsx` |
| `club_joined` | User successfully submitted a request to join a club. | `src/app/clubs/joinclub.tsx` |
| `post_created` | User created and published a new post in the discover feed. | `src/app/discover/components/CreatePostModal.tsx` |
| `ai_queried` | User submitted a prompt to the Zynvo AI assistant. | `src/app/ai/page.tsx` |
| `event_registered` | User successfully registered or joined an event. | `src/app/events/[id]/page.tsx` |
| `contact_form_submitted` | User submitted the contact form to reach the Zynvo team. | `src/components/ContactSection.tsx` |
| `password_reset_requested` | User requested a password reset email. | `src/app/auth/forgot-password/page.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/497459/dashboard/1798452)
- [New User Signups (wizard)](https://us.posthog.com/project/497459/insights/RUSkNaK2)
- [User Sign-ins by Method (wizard)](https://us.posthog.com/project/497459/insights/ZVPmhMLt)
- [Platform Content Creation (wizard)](https://us.posthog.com/project/497459/insights/cYk7vebO)
- [Signup to First Engagement Funnel (wizard)](https://us.posthog.com/project/497459/insights/cxGGKlKf)
- [AI Feature Adoption (wizard)](https://us.posthog.com/project/497459/insights/LhwMaMrC)

## Verify before merging

- [ ] Run a full production build (`bun run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on fresh login/signup only. Consider calling `posthog.identify()` on page load when a valid session token is found in `localStorage` so returning sessions are not anonymous.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

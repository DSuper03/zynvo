# PostHog in Zynvo

Project: https://us.posthog.com/project/497459 · Client init: `instrumentation-client.ts` · Helpers: `src/lib/analytics.ts`

## Identity

- Every person is keyed on the **backend user `id`** from our JWT (never email). Use `identifyFromToken()`; never call `posthog.identify` directly.
- Returning visitors are identified on load by `PostHogIdentifyBootstrap`.
- `resetAnalytics()` runs on every logout, 401/expired session and account deletion.
- Groups: `club` (key = club id) and `college` (key = lowercased college name), set via `setClubGroup` / `setCollegeGroup`. Enable group analytics for both types in project settings.

## Privacy

- `before_send` redacts `token`, `code`, `state`, `email`, `otp` … from URL properties (reset links carried live tokens before).
- Session replay masks all inputs; add `data-ph-mask` to mask text or `data-ph-block` to hide an element. Turn replay on / set sampling in project settings.
- Free text is never sent; we send `lengthBucket()` instead (search terms are truncated to 100 chars).

## Client events

| Event | Where | Key properties |
|---|---|---|
| `user_signed_up` / `user_signed_in` | auth/signup, auth/signin | `auth_method`, `college` |
| `user_oauth_signup` / `user_oauth_signin` | auth/sso-callback | `auth_method`, `college` |
| `auth_failed` | signin, signup, sso-callback | `auth_method`, `stage`, `status`, `reason` |
| `user_logged_out` | `resetAnalytics('logout')` | |
| `password_reset_requested` / `_completed` | auth/forgot-password, auth/reset-password | |
| `account_deleted` | delete-account | `gave_reason` |
| `profile_updated` / `profile_completed` | dashboard profile form | `fields_filled`, `tags_count` |
| `club_created` | clubs/createclub | `club_id`, `club_type`, `wings_count` |
| `club_joined` / `club_join_failed` | clubs/joinclub | `club_id`, `already_member` |
| `club_left` | leaveBtn, dashboard, clubs/[id] | `club_id`, `source` |
| `club_viewed` / `club_shared` | clubs/[id] | `club_id`, `member_count`, `method` |
| `event_created` / `event_creation_failed` | EventCreationModel | `event_id`, `club_id`, `event_type`, `event_mode`, `is_paid` |
| `event_viewed` | events/[id] | `event_id`, `club_id`, `is_paid`, `application_status` |
| `event_registered` / `event_registration_failed` | events/[id] | `event_id`, `is_paid`, `approval_status`, `reason` |
| `event_shared` | EventCard, events/[id] invite | `event_id`, `method`, `source` |
| `post_created` | CreatePostModal | `post_id`, `club_id`, `has_image`, `text_length` |
| `post_voted` | `useVote` hook | `post_id`, `vote_type`, `action` |
| `post_shared` | discover, post/[id] | `post_id`, `method`, `source` |
| `search_performed` | events page | `surface`, `query`, `results_count` |
| `ai_queried` / `ai_response_received` / `ai_query_failed` | ai page | `prompt_length`, `events_found`, `duration_ms` |
| `contact_form_submitted` | ContactSection | `subject` |

Plus autocapture: `$pageview`, `$pageleave`, clicks, `$exception`.

## Server events (source of truth)

Emitted by the API proxy (`src/lib/server/proxy.ts` + `server-events.ts`) only when the backend returns 2xx. Ad-blockers can't drop them. All carry `source: 'server'`.

`server_user_authenticated`, `server_club_joined`, `server_club_left`, `server_club_created`, `server_event_created`, `server_event_registered`, `server_event_application_approved`, `server_post_created`, `server_profile_updated`, `server_account_deleted`, `server_club_ownership_transferred`.

Use these for KPIs; use the client events for funnels and UX context.

## Logs (PostHog Logs)

- **Browser**: `logger.info/warn/error` (`src/lib/logger.ts`) and every client telemetry error (`src/lib/telemetry.ts`) go to PostHog Logs, linked to the person and session replay. Service `zynvo-web`.
- **Server**: OpenTelemetry → `https://us.i.posthog.com/i/v1/logs` (`src/lib/server/posthog-telemetry.ts`). Includes an access log for every proxied API call, warnings (rate limits, missing auth), errors (timeouts, upstream 5xx with the real backend message) and unhandled request errors from `instrumentation.ts`. Service `zynvo-web-server`; `posthogDistinctId` attribute links to the person.
- Flushed with `after()` so serverless functions don't drop buffered logs.

## Feature flags

`useFeatureFlag('flag-key')` / `useFeatureFlagVariant('flag-key')` in `src/hooks/useFeatureFlag.ts`. `undefined` = not loaded yet, so render the current UI.

## Env

| Var | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | client + server | `phc_…` project token (public) |
| `POSTHOG_HOST` | server, optional | default `https://us.i.posthog.com` |
| `POSTHOG_LOGS_LEVEL` | server, optional | `debug`/`info`/`warn`/`error`, default `info` |
| `POSTHOG_LOGS_DISABLED` | server, optional | `true` turns server logs off |

## Still to do

- [ ] Upload source maps to PostHog error tracking (needs a personal API key in CI) so `$exception` stack traces de-minify.
- [ ] Worker-side logs from `zynvo-backend-worker` (backend change, pending approval).

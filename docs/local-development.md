# Local Development

## Required Environment

All browser API calls should use same-origin paths such as `/api/v1/...` or
`/api/v2/...`. Next.js forwards those requests to `BACKEND_BASE_URL` and adds
`x-internal-proxy-secret`.

`INTERNAL_PROXY_SECRET` must be the same value configured on the backend. The
placeholder value in `.env` is intentionally rejected by the frontend proxy so
local requests fail with a clear configuration error instead of a confusing
backend 401/403.

Ask whoever owns the backend deployment for the current shared proxy secret, put
it in `.env`, then restart `next dev`.

## Windows Checks

If PowerShell blocks `npm.ps1`, run checks through Node directly:

```bat
scripts\local-check.cmd
```

Or run the individual commands:

```bat
node node_modules\typescript\bin\tsc --noEmit
node node_modules\next\dist\bin\next build --webpack
```

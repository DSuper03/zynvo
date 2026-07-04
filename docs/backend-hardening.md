# Backend Hardening Guide — Zynvo API

This document describes the changes required in the **separate Express backend service**
to complete the secure proxy architecture.

The Next.js frontend now routes all traffic through `src/app/api/v1/[...path]` and
`src/app/api/v2/[...path]` proxy handlers. The backend must be updated to:

1. Reject any request that does not carry `x-internal-proxy-secret`.
2. Accept and verify Clerk JWTs directly (the backend-issued JWT flow becomes optional).
3. Restrict CORS so the browser cannot reach the backend directly.
4. Forward `x-request-id` through logs for end-to-end tracing.

---

## 1. Environment Variables (Backend)

Add these to the backend `.env`:

```
INTERNAL_PROXY_SECRET=<same value as in the Next.js INTERNAL_PROXY_SECRET env var>
CLERK_PUBLISHABLE_KEY=<your Clerk publishable key>
CLERK_SECRET_KEY=<your Clerk secret key>
ALLOWED_PROXY_ORIGIN=https://zynvosocial.com
```

The `INTERNAL_PROXY_SECRET` must match exactly between the Next.js proxy and the backend.

---

## 2. Proxy Secret Middleware

Add this middleware **before all protected route groups**:

```typescript
// middleware/verifyProxySecret.ts
import { Request, Response, NextFunction } from 'express';

const PROXY_SECRET = process.env.INTERNAL_PROXY_SECRET;

export function verifyProxySecret(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!PROXY_SECRET) {
    console.error('[security] INTERNAL_PROXY_SECRET is not configured');
    res.status(500).json({ error: 'Backend misconfigured' });
    return;
  }

  const provided = req.headers['x-internal-proxy-secret'];

  if (!provided || provided !== PROXY_SECRET) {
    res.status(403).json({
      error: 'Forbidden: missing or invalid proxy secret',
      requestId: req.headers['x-request-id'] ?? 'unknown',
    });
    return;
  }

  next();
}
```

Apply globally or per router:

```typescript
// app.ts
import { verifyProxySecret } from './middleware/verifyProxySecret';

// Apply before all API routes
app.use('/api', verifyProxySecret);
```

> **Important:** The proxy secret is an extra defense-in-depth layer.
> Continue validating Clerk JWTs on every authenticated endpoint.
> Never trust requests solely because they carry the secret.

---

## 3. Clerk JWT Verification

Install the Clerk backend SDK:

```bash
npm install @clerk/clerk-sdk-node
# or
npm install @clerk/express
```

Add JWT verification middleware for authenticated routes:

```typescript
// middleware/verifyClerkAuth.ts
import { Request, Response, NextFunction } from 'express';
import { clerkClient, getAuth } from '@clerk/express';

export function requireClerkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);

  if (!auth?.userId) {
    res.status(401).json({
      error: 'Unauthorized',
      requestId: req.headers['x-request-id'] ?? 'unknown',
    });
    return;
  }

  // Attach userId to request for downstream handlers
  (req as any).userId = auth.userId;
  next();
}
```

Configure Clerk middleware at the app level:

```typescript
// app.ts
import { clerkMiddleware } from '@clerk/express';

app.use(clerkMiddleware());
```

The backend must verify both the proxy secret AND the Clerk JWT for authenticated routes.
Neither alone is sufficient.

---

## 4. CORS Restriction

The backend should only accept requests from the Next.js server, not from browsers.

```typescript
// app.ts
import cors from 'cors';

const ALLOWED_ORIGIN = process.env.ALLOWED_PROXY_ORIGIN || 'https://zynvosocial.com';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, health checks)
      if (!origin) return callback(null, true);

      // Block direct browser requests to the backend
      if (origin !== ALLOWED_ORIGIN) {
        return callback(
          new Error(`CORS: origin ${origin} is not allowed`),
          false
        );
      }

      callback(null, true);
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'x-request-id',
      'x-internal-proxy-secret',
    ],
    exposedHeaders: ['x-request-id'],
  })
);
```

---

## 5. Request ID Propagation

The proxy forwards `x-request-id` for tracing. Log it on every request:

```typescript
// middleware/requestId.ts
import { Request, Response, NextFunction } from 'express';

export function attachRequestId(req: Request, _res: Response, next: NextFunction): void {
  const id = req.headers['x-request-id'];
  (req as any).requestId = typeof id === 'string' ? id : 'unknown';
  next();
}
```

Then in your logger:

```typescript
logger.info({
  requestId: (req as any).requestId,
  method: req.method,
  path: req.path,
  userId: (req as any).userId ?? null,
  status: res.statusCode,
});
```

---

## 6. Error Response Format

Ensure backend error responses match the proxy's normalized format so `x-request-id`
surfaces to end users:

```typescript
// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = (req as any).requestId ?? 'unknown';
  console.error(`[${requestId}] Unhandled error:`, err.message);

  // Never leak stack traces in production
  res.status(500).json({
    success: false,
    message: 'An internal error occurred.',
    requestId,
    timestamp: new Date().toISOString(),
  });
});
```

---

## 7. Health Check Exemption

The health check endpoint should bypass secret verification:

```typescript
// Health check — no secret required
app.get('/health', (_req, res) => res.json({ ok: true }));

// Secret verification for everything else
app.use('/api', verifyProxySecret);
app.use('/api', clerkMiddleware());
```

---

## Deployment Checklist

- [ ] `INTERNAL_PROXY_SECRET` set in backend env (min 32 characters, random hex)
- [ ] `INTERNAL_PROXY_SECRET` matches exactly between frontend and backend
- [ ] `verifyProxySecret` middleware applied before all `/api` routes
- [ ] Clerk `clerkMiddleware()` applied
- [ ] `requireClerkAuth` applied to all authenticated endpoints
- [ ] CORS restricted to `ALLOWED_PROXY_ORIGIN` only
- [ ] No stack traces in production error responses
- [ ] `x-request-id` logged on every request
- [ ] Direct backend URL removed from any public documentation or client bundles

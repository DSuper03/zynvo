/**
 * Server-only environment validation.
 * Never import from client code. Never use NEXT_PUBLIC_ for backend URLs.
 */
import { z } from 'zod';

const schema = z.object({
  BACKEND_BASE_URL: z
    .string()
    .url('BACKEND_BASE_URL must be a valid URL')
    .default('https://zynvosocial-be-274792984950.asia-south1.run.app'),
  INTERNAL_PROXY_SECRET: z
    .string()
    .min(16, 'INTERNAL_PROXY_SECRET must be at least 16 characters'),
  PROXY_TIMEOUT: z.coerce.number().int().positive().default(15000),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  CLERK_SECRET_KEY: z.string().min(1, 'CLERK_SECRET_KEY is required'),
  JWT_SECRET: z.string().optional(),
});

function parseServerEnv() {
  const result = schema.safeParse({
    BACKEND_BASE_URL: process.env.BACKEND_BASE_URL,
    INTERNAL_PROXY_SECRET: process.env.INTERNAL_PROXY_SECRET,
    PROXY_TIMEOUT: process.env.PROXY_TIMEOUT,
    NODE_ENV: process.env.NODE_ENV,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[proxy] Server environment is misconfigured:\n${issues}`);
  }

  return result.data;
}

let _cached: z.infer<typeof schema> | null = null;

export function getServerEnv(): z.infer<typeof schema> {
  if (_cached) return _cached;
  _cached = parseServerEnv();
  return _cached;
}

export type ServerEnv = z.infer<typeof schema>;

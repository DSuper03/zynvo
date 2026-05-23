import { captureApiFailure } from '@/lib/telemetry';

// Production-safe logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
    const [firstArg] = args;
    if (typeof window !== 'undefined') {
      captureApiFailure({
        error: firstArg instanceof Error ? firstArg : new Error(String(firstArg ?? 'Unknown logger error')),
        context: 'logger.error',
        metadata: { args: args.slice(0, 3).map((v) => (typeof v === 'string' ? v : undefined)).filter(Boolean) },
      });
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// Error boundary helper
export const handleError = (error: Error, context?: string) => {
  logger.error(`Error in ${context || 'unknown context'}:`, error);
  
  // In production, send to error tracking service
  if (!isDevelopment) {
    // Example: Sentry.captureException(error, { tags: { context } });
  }
};
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
    // In production, you might want to send errors to a logging service
    // Example: sendToLoggingService(args);
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
'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  /** Extra actions below retry (e.g. link home) */
  children?: React.ReactNode;
};

/**
 * Failed load pattern — message + optional retry (avoids toast-only failures).
 */
export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
  children,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-12 sm:py-14 max-w-lg mx-auto',
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10">
        <AlertCircle className="h-7 w-7 text-red-400" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{message}</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            className="min-h-11 px-6 bg-yellow-500 text-black hover:bg-yellow-400 font-medium"
          >
            {retryLabel}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

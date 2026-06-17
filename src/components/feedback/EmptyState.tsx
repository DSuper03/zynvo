'use client';

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  /** Primary action (e.g. button) */
  children?: React.ReactNode;
};

/**
 * Centered empty list / no-results pattern — icon, title, optional body, optional actions.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  children,
}: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 py-12 sm:py-14',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-yellow-500/25 bg-yellow-500/10">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-400" aria-hidden />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white max-w-md">{title}</h3>
      {description && (
        <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="mt-6 flex flex-col sm:flex-row gap-3">{children}</div>}
    </div>
  );
}

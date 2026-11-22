'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Site-wide toasts. The site is dark-only (no theme provider), so the theme is
 * fixed to dark — following the OS theme rendered white toasts on light-mode
 * devices. Top-center keeps them clear of the mobile bottom tab bar.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      closeButton
      visibleToasts={3}
      duration={3500}
      gap={8}
      offset={16}
      mobileOffset={12}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast !w-full !bg-zinc-950/95 !backdrop-blur-md !text-zinc-100 !border !border-zinc-800 !rounded-2xl !shadow-2xl !shadow-black/60 !px-4 !py-3 !gap-3 !font-sans',
          title: '!text-sm !font-semibold !leading-snug',
          description: '!text-xs !text-zinc-400 !leading-snug',
          icon: '!mr-0',
          actionButton:
            '!bg-yellow-400 hover:!bg-yellow-300 !text-black !font-semibold !text-xs !rounded-lg !px-3 !h-8',
          cancelButton: '!bg-zinc-800 !text-zinc-300 !text-xs !rounded-lg !px-3 !h-8',
          closeButton:
            '!bg-zinc-900 !border-zinc-700 !text-zinc-400 hover:!text-white hover:!bg-zinc-800',
          success: '!border-emerald-500/40 [&_[data-icon]]:!text-emerald-400',
          error: '!border-red-500/40 [&_[data-icon]]:!text-red-400',
          warning: '!border-yellow-500/40 [&_[data-icon]]:!text-yellow-400',
          info: '!border-sky-500/40 [&_[data-icon]]:!text-sky-400',
          loading: '[&_[data-icon]]:!text-yellow-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

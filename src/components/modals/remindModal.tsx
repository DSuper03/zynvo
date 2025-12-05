import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type NoTokenModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  /** If true, user has token but no active session - redirect to signin. If false/undefined, no token - redirect to signup */
  hasToken?: boolean;
};

export default function NoTokenModal({
  isOpen,
  onOpenChange,
  hasToken = false,
}: NoTokenModalProps) {
  const router = useRouter();

  // Redirect based on whether user has token or not
  // No token → signup (new user)
  // Has token but no session → signin (returning user)
  const handleDismiss = () => {
    onOpenChange(false);
    router.push(hasToken ? '/auth/signin' : '/auth/signup');
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleDismiss();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onOpenChange, router]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  const handleClose = () => {
    handleDismiss();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-slate-900 border border-yellow-400 rounded-xl shadow-lg max-w-md w-full mx-4 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
          <ShieldAlert className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-400">
            Sign in required
          </h3>
        </div>

        {/* Body with image */}
        <div className="px-6 py-4 flex gap-4 items-center">
          {/* Info Section */}
          <div className="flex-1">
            <p className="text-white mb-4">
              You need to be signed in to use AI features. Please sign in to
              continue.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-white">
              <li>Access personalized answers</li>
              <li>See your recent activity</li>
              <li>Sync across devices</li>
            </ul>
          </div>
          {/* Image Section */}
          <img
            src="/modal/legomodalreminder.png"
            alt="Sign in illustration"
            className="w-40 h-40 object-contain"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-white hover:bg-red-400  rounded-md transition-colors duration-200"
          >
            Not now
          </button>
          <Link href="/auth/signin" className="inline-flex">
            <button className="px-4 py-2 bg-yellow-500 text-black hover:bg-yellow-400 rounded-md transition-colors duration-200 font-medium">
              Sign in
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

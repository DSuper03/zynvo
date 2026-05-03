'use client';

import { useState, useCallback, useEffect } from 'react';
import { X, Sparkles, Copy, Check } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamName: string) => Promise<any>;
  isSubmitting: boolean;
}

export default function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTeamName('');
      setCreatedCode(null);
      setCopied(false);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleCreate = async () => {
    if (!teamName.trim()) return;
    try {
      const result = await onSubmit(teamName.trim());
      if (result?.team?.teamCode) {
        setCreatedCode(result.team.teamCode);
      }
    } catch {
      // Error handled by hook
    }
  };

  const handleCopy = useCallback(() => {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [createdCode]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-[#0d0d0d] border border-yellow-500/40 rounded-2xl shadow-2xl shadow-yellow-500/5 max-w-md w-full mx-4 animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              {createdCode ? 'Team Created!' : 'Create Your Team'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {!createdCode ? (
            /* ── Step 1: Enter team name ───────────────────────────────── */
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="teamNameInput"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Team Name
                </label>
                <input
                  id="teamNameInput"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="e.g. Code Crushers"
                  maxLength={40}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/30 transition-all"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Choose a name your teammates will recognise
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!teamName.trim() || isSubmitting}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 
                  disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
                  bg-yellow-400 hover:bg-yellow-500 text-black active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Team'
                )}
              </button>
            </div>
          ) : (
            /* ── Step 2: Show invite code ─────────────────────────────── */
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  Share this code with your teammates so they can join
                </p>

                {/* Code display */}
                <div className="relative inline-flex items-center gap-1 bg-gray-900 border border-yellow-500/30 rounded-xl px-6 py-4">
                  {createdCode.split('').map((char, i) => (
                    <span
                      key={i}
                      className="w-9 h-11 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg text-yellow-400 text-xl font-mono font-bold"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-yellow-300/80 text-center">
                  💡 Your teammates need to register for the event first, then
                  use this code to join your team.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-800 hover:bg-gray-700 text-white transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

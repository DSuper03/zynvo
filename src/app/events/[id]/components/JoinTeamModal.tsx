'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Users, Loader2 } from 'lucide-react';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamCode: string) => Promise<any>;
  isSubmitting: boolean;
}

const CODE_LENGTH = 6;

export default function JoinTeamModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: JoinTeamModalProps) {
  const [code, setCode] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCode(new Array(CODE_LENGTH).fill(''));
      // Focus first input after render
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Lock body scroll
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

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow alphanumeric
      const char = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(-1);
      const newCode = [...code];
      newCode[index] = char;
      setCode(newCode);

      // Auto-advance to next input
      if (char && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!code[index] && index > 0) {
          // Move back on empty backspace
          const newCode = [...code];
          newCode[index - 1] = '';
          setCode(newCode);
          inputRefs.current[index - 1]?.focus();
        } else {
          const newCode = [...code];
          newCode[index] = '';
          setCode(newCode);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, CODE_LENGTH);

    const newCode = new Array(CODE_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus the input after the last pasted char
    const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  const codeString = code.join('');
  const isComplete = codeString.length === CODE_LENGTH;

  const handleJoin = async () => {
    if (!isComplete) return;
    try {
      await onSubmit(codeString);
      onClose();
    } catch {
      // Error handled by hook
    }
  };

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
            <Users className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Join a Team</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">
              Enter the 6-character invite code from your team leader
            </p>
          </div>

          {/* Code input boxes */}
          <div className="flex items-center justify-center gap-2">
            {code.map((char, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`w-11 h-14 text-center text-xl font-mono font-bold rounded-xl border-2 bg-gray-900 
                  outline-none transition-all duration-150
                  ${
                    char
                      ? 'border-yellow-500/60 text-yellow-400'
                      : 'border-gray-700 text-white'
                  }
                  focus:border-yellow-400 focus:ring-2 focus:ring-yellow-500/20
                  placeholder-gray-600`}
                placeholder="·"
                autoComplete="off"
              />
            ))}
          </div>

          <div className="bg-gray-900/60 border border-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 text-center">
              Ask your team leader for the invite code. It's a 6-character code
              like <span className="text-yellow-400 font-mono">A3BK7N</span>
            </p>
          </div>

          <button
            onClick={handleJoin}
            disabled={!isComplete || isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
              disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
              bg-yellow-400 hover:bg-yellow-500 text-black active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Joining...
              </span>
            ) : (
              'Join Team'
            )}
          </button>
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

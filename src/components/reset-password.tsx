import { res } from "@/hooks/useResetPw";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Props = {
  onSubmit?: (oldPassword: string, newPassword: string) => Promise<void> | void;
};

export default function ResetPassword({ onSubmit }: Props) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword) {
      setError("Both current and new password are required.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from current password.");
      return;
    }

    setLoading(true);
    try {
      await res(oldPassword, newPassword);
      setSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      toast.success("Password updated successfully!");
    } catch (err) {
      setError("Unable to update password. Please try again.");
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back to Dashboard Button - Top Left */}
      <Button
        onClick={() => router.push('/dashboard')}
        variant="ghost"
        size="icon"
        className="absolute top-10 left-8 sm:top-6 sm:left-6 h-10 w-10 rounded-full bg-gray-800/50 hover:bg-gray-800 border border-gray-100 hover:border-yellow-400/50 text-gray-400 hover:text-yellow-400 transition-all duration-200 z-20"
        aria-label="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </Button>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl"
          aria-label="reset-password-form"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400/10 rounded-full mb-4">
              <Lock className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-400 text-sm">
              Enter your current password and choose a new one
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          {/* Current Password Field */}
          <div className="mb-6">
            <Label htmlFor="oldPassword" className="text-yellow-400 text-sm font-medium mb-2 block">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              >
                {showOldPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="mb-6">
            <Label htmlFor="newPassword" className="text-yellow-400 text-sm font-medium mb-2 block">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 pr-10 focus:border-yellow-400 focus:ring-yellow-400/20"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !oldPassword || !newPassword}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </Button>

          {/* Helper Text */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            Use a strong password with at least 8 characters
          </p>

          {/* Google Password Save Suggestion */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-300 mb-1">
                  Save your password securely
                </p>
                <p className="text-xs text-blue-400/80 leading-relaxed">
                  Consider saving your new password with Google Password Manager for easy and secure access across all your devices.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
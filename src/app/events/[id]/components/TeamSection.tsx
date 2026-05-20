'use client';

import { useState, useCallback } from 'react';
import {
  Users,
  Plus,
  UserPlus,
  Crown,
  Copy,
  Check,
  LogOut,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { useTeam } from '@/hooks/useTeam';
import type { TeamData, TeamMember } from '@/types/teamTypes';
import CreateTeamModal from './CreateTeamModal';
import JoinTeamModal from './JoinTeamModal';

interface TeamSectionProps {
  eventId: string;
  token: string | null;
  teamSize: number;
}

export default function TeamSection({
  eventId,
  token,
  teamSize,
}: TeamSectionProps) {
  const {
    myTeam,
    isLoading,
    createTeam,
    joinTeam,
    leaveTeam,
    isCreating,
    isJoining,
    isLeaving,
  } = useTeam(eventId, token);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const handleCreateTeam = useCallback(
    async (teamName: string) => {
      const result = await createTeam({ eventId, teamName });
      return result;
    },
    [createTeam, eventId]
  );

  const handleJoinTeam = useCallback(
    async (teamCode: string) => {
      await joinTeam({ eventId, teamCode });
    },
    [joinTeam, eventId]
  );

  const handleLeaveTeam = useCallback(async () => {
    if (!myTeam) return;
    await leaveTeam(myTeam.id);
    setShowLeaveConfirm(false);
  }, [leaveTeam, myTeam]);

  const handleCopyCode = useCallback(async () => {
    if (!myTeam?.teamCode) return;
    try {
      await navigator.clipboard.writeText(myTeam.teamCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setCodeCopied(false);
    }
  }, [myTeam?.teamCode]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900/70 p-5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-gray-800 animate-pulse" />
          <div className="h-4 w-32 rounded bg-gray-800 animate-pulse" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-24 rounded-xl bg-gray-800/60 animate-pulse" />
          <div className="h-24 rounded-xl bg-gray-800/60 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── No team yet → Create / Join options ────────────────────────────────────
  if (!myTeam) {
    return (
      <>
        <div className="mt-4 rounded-xl border border-gray-800 bg-gray-900/70 p-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-semibold text-white">
              Team Up!
            </h3>
            <span className="text-xs text-gray-400 sm:ml-auto">
              Max {teamSize} members
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            This is a team event. Create a new team or join one with an invite
            code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Create Team Card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="group relative rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-left
                hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-400 mb-3 group-hover:bg-yellow-500/20 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Create Team
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Start a new team and get an invite code to share
              </p>
            </button>

            {/* Join Team Card */}
            <button
              onClick={() => setShowJoinModal(true)}
              className="group relative rounded-xl border border-gray-800 bg-gray-900/60 p-4 text-left
                hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all duration-200"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500/10 text-yellow-400 mb-3 group-hover:bg-yellow-500/20 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Join Team
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Have an invite code? Join your teammate's team
              </p>
            </button>
          </div>
        </div>

        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTeam}
          isSubmitting={isCreating}
        />
        <JoinTeamModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinTeam}
          isSubmitting={isJoining}
        />
      </>
    );
  }

  // ── Team Dashboard ─────────────────────────────────────────────────────────
  return (
    <>
      <div className="mt-4 rounded-xl border border-yellow-500/20 bg-gray-900/70 p-5">
        {/* Header Row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Users className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-white">
                {myTeam.teamName}
              </h3>
              {myTeam.myRole === 'leader' && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-500/15 border border-yellow-500/25 rounded text-[10px] font-medium text-yellow-400">
                  <Crown className="w-3 h-3" /> Leader
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {myTeam.currentMembers}/{myTeam.maxMembers} members
            </p>
          </div>

          {/* Invite Code */}
          <button
            onClick={handleCopyCode}
            className="flex w-full items-center justify-between gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all active:scale-95 sm:w-auto sm:justify-start"
            title="Copy invite code"
          >
            <span className="font-mono text-sm font-bold text-yellow-400 tracking-wider">
              {myTeam.teamCode}
            </span>
            {codeCopied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
              style={{
                width: `${(myTeam.currentMembers / myTeam.maxMembers) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-2 mb-4">
          {myTeam.members.map((member: TeamMember) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/80 border border-gray-800/80"
            >
              {/* Avatar */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                {member.user.profileAvatar ? (
                  <Image
                    src={member.user.profileAvatar}
                    alt={member.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    <span className="text-black font-bold text-xs">
                      {member.user.name
                        ? member.user.name.charAt(0).toUpperCase()
                        : 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {member.user.name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {member.user.email}
                </p>
              </div>

              {/* Role Badge */}
              {member.role === 'leader' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-medium text-yellow-400">
                  <Crown className="w-3 h-3" />
                  Leader
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-[10px] font-medium text-gray-300">
                  Member
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            Share the code so teammates can join
          </p>
          {!showLeaveConfirm ? (
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="text-xs text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Leave
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveTeam}
                disabled={isLeaving}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isLeaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3" />
                )}
                Confirm Leave
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keep modals available for when user returns after leaving */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTeam}
        isSubmitting={isCreating}
      />
      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinTeam}
        isSubmitting={isJoining}
      />
    </>
  );
}

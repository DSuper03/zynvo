import Image from 'next/image';

type EventBadgeProps = {
  eventName: string;
  eventTimings: string;
  collegeName: string;
  clubName: string;
  profileImage?: string;
  qrCodeImage?: string;
  status?: 'upcoming' | 'active' | 'past';
};

const EventBadgeCard: React.FC<EventBadgeProps> = ({
  eventName,
  eventTimings,
  collegeName,
  clubName,
  profileImage,
  qrCodeImage,
  status = 'upcoming',
}) => {
  const badgeStyles: Record<EventBadgeProps['status'], { label: string; color: string; bg: string }> = {
    upcoming: { label: 'Upcoming', color: 'text-yellow-300', bg: 'bg-yellow-500/10' },
    active: { label: 'Active', color: 'text-green-300', bg: 'bg-green-500/10' },
    past: { label: 'Past', color: 'text-gray-300', bg: 'bg-gray-500/10' },
  };
  const tone = badgeStyles[status];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[320px] rounded-3xl bg-gradient-to-b from-black to-[#111] text-white shadow-2xl overflow-hidden ring-2 ring-yellow-500/40">
        {/* Accent bar */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />

        {/* Header */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-yellow-400 text-black font-extrabold flex items-center justify-center shadow-lg">
              Z
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-yellow-200">
                Zynvo Pass
              </div>
              <div className="text-lg font-semibold text-white">{clubName}</div>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border border-white/10 ${tone.bg} ${tone.color}`}>
            {tone.label}
          </span>
        </div>

        <div className="px-5 space-y-4 pb-5">
          <div className="space-y-1">
            <div className="text-sm text-yellow-200 font-semibold">{collegeName}</div>
            <div className="text-2xl font-bold leading-tight">{eventName}</div>
            <div className="text-sm text-gray-300">{eventTimings}</div>
          </div>

          <div className="rounded-2xl bg-[#0c0c0c] border border-white/5 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profileImage && (
                <div className="relative h-12 w-12 rounded-xl overflow-hidden ring-2 ring-yellow-400/70 shadow-lg">
                  <img src={profileImage} alt="Profile" crossOrigin="anonymous" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="text-sm text-gray-200">
                <div className="font-semibold text-white">Entry Holder</div>
                <div className="text-xs text-gray-400">Show this at the gate</div>
              </div>
            </div>
            {qrCodeImage && (
              <div className="h-16 w-16 rounded-xl bg-white flex items-center justify-center shadow-inner">
                <img src={qrCodeImage} alt="QR Code" crossOrigin="anonymous" className="h-14 w-14" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-yellow-200 font-semibold text-[11px]">Check-in</div>
              <div className="text-base font-semibold mt-1 text-white">Scan QR</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <div className="text-yellow-200 font-semibold text-[11px]">Status</div>
              <div className="text-base font-semibold mt-1 text-white">{tone.label}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBadgeCard;

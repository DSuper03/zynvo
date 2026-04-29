//'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Calendar,
  Users,
  User,
  LogOut,
  Trophy,
  MapPinCheck,
} from 'lucide-react';
import { FaBahai, FaUsers } from 'react-icons/fa';
import { useWarmup } from './WarmupProvider';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ZYNVO_LOGO_URL =
  'https://ik.imagekit.io/3toclb9et/2.png?updatedAt=1759691211226&v=3';

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { userData, loading } = useWarmup();
  const { name, profileAvatar: profile } = userData;

  const menuItems = [
    { icon: <Search size={22} />, label: 'Discover', href: '/discover' },
    { icon: <FaUsers size={22} />, label: 'Zyncers', href: '/zyncers' },
    { icon: <Calendar size={22} />, label: 'Events', href: '/events' },
    { icon: <Users size={22} />, label: 'Clubs', href: '/clubs' },
    { icon: <FaBahai size={20} />, label: 'AI', href: '/ai', accent: true },
    { icon: <MapPinCheck size={22} />, label: 'Campus Map', href: '/cmap' },
    { icon: <Trophy size={22} />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <User size={22} />, label: 'Profile', href: '/dashboard' },
  ];

  const accountItems = [
    { icon: <LogOut size={22} />, label: 'Logout', href: '/' },
  ];

  const showText = isOpen;

  return (
    <aside
      className={cn(
        'group relative h-full min-h-screen border-r border-zinc-900 bg-[#050505] text-white transition-all duration-300 ease-in-out',
        isOpen ? 'w-56' : 'w-16'
      )}
      aria-label="Primary navigation"
    >
      <div className="relative flex h-full min-h-screen flex-col">
        <div className="px-2.5 pb-3 pt-3">
          <Link
            href="/discover"
            onClick={onClose}
            className={cn(
              'mb-3 flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-zinc-900',
              !isOpen && 'justify-center px-0'
            )}
            aria-label="Go to Discover"
          >
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={ZYNVO_LOGO_URL}
                alt="Zynvo"
                fill
                className="object-cover"
                priority
                sizes="32px"
              />
            </div>
            {showText && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-white">
                  Zynvo
                </p>
                <p className="truncate text-[11px] text-zinc-500">
                  Campus OS
                </p>
              </div>
            )}
          </Link>

          <Link
            href="/dashboard"
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border border-zinc-900 bg-zinc-950/70 p-2 transition hover:bg-zinc-900',
              !isOpen && 'justify-center px-1.5'
            )}
            aria-label="Open profile"
          >
            <div
              className={cn(
                'relative shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200',
                isOpen ? 'h-9 w-9' : 'h-8 w-8'
              )}
            >
              {profile ? (
                <Image
                  src={profile}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                  sizes={isOpen ? '36px' : '32px'}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
            {showText && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">
                  {loading ? 'Loading...' : name || 'Zynvo User'}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="truncate text-[11px] text-zinc-500">Online</p>
                </div>
              </div>
            )}
          </Link>
        </div>

        <nav className="relative flex-1 space-y-0.5 overflow-y-auto px-2.5 py-1">
          {showText && (
            <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Navigate
            </p>
          )}
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                title={!showText ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-zinc-500 transition duration-200 hover:bg-zinc-900 hover:text-zinc-100',
                  !isOpen && 'justify-center px-0',
                  isActive &&
                    'bg-zinc-900 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]',
                  item.accent && !isActive && 'text-zinc-300'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-yellow-400" />
                )}
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition',
                    isActive
                      ? 'bg-zinc-800 text-yellow-300'
                      : 'text-current group-hover:bg-zinc-800'
                  )}
                >
                  {item.icon}
                </span>
                {showText && (
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {item.label}
                  </span>
                )}
                {showText && item.accent && (
                  <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-400">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-900 p-2.5">
          {accountItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={!showText ? item.label : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-zinc-500 transition hover:bg-zinc-900 hover:text-red-300',
                !isOpen && 'justify-center px-0'
              )}
              onClick={() => {
                sessionStorage.removeItem('activeSession');
                sessionStorage.removeItem('founder');
                onClose?.();
              }}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                {item.icon}
              </span>
              {showText && (
                <span className="truncate text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

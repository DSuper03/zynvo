'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Bell, X, Calendar, Activity, Sparkles, Users, Hand, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import {
  sampleNotifications,
  getRelativeTime,
  type Notification,
  type NotificationType,
} from './notifications-data';

type TabType = 'foryou' | 'upcoming';

/** A notification stored for the signed-in user (GET /api/v1/notifications). */
type ServerNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: { route?: string; image?: string } | null;
  read: boolean;
  createdAt: string;
};

const POLL_MS = 60_000;

const typeIcons: Record<NotificationType, React.ReactNode> = {
  upcoming: <Calendar className="w-3 h-3" />,
  activity: <Activity className="w-3 h-3" />,
  update: <Sparkles className="w-3 h-3" />,
};

const typeColors: Record<NotificationType, string> = {
  upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  activity: 'bg-green-500/20 text-green-400 border-green-500/30',
  update: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const serverTypeIcon = (type: string) => {
  if (type.startsWith('core_')) return <Users className="w-5 h-5 text-yellow-400" />;
  if (type === 'wave') return <Hand className="w-5 h-5 text-yellow-400" />;
  if (type.includes('event')) return <Calendar className="w-5 h-5 text-yellow-400" />;
  return <Bell className="w-5 h-5 text-yellow-400" />;
};

/** Server routes → web paths. Only internal paths are followed. */
const webRoute = (route?: string): string | null => {
  if (typeof route !== 'string') return null;
  const r = route.trim();
  if (!r.startsWith('/') || r.startsWith('//')) return null;
  if (r.startsWith('/profile/')) return `/zyncers/${r.slice('/profile/'.length)}`;
  return r;
};

const readToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('token');
    return token && sessionStorage.getItem('activeSession') === 'true' ? token : null;
  } catch {
    return null;
  }
};

function UpcomingRow({ notification, isSelected, onSelect }: {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const relativeTime = getRelativeTime(notification.date);
  const isFuture = new Date(notification.date) > new Date();

  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-start gap-3 p-3 text-left transition-all duration-200
        hover:bg-gray-800/50 focus:bg-gray-800/50 focus:outline-none
        ${isSelected ? 'bg-gray-800/70 ring-1 ring-yellow-500/30' : ''}
        border-l-2 border-transparent
      `}
      role="option"
      aria-selected={isSelected}
    >
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-700">
        <Image src={notification.image} alt="" fill className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h4 className="text-sm font-medium text-white truncate min-w-0 flex-1">{notification.title}</h4>
          <span className={`flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded border ${typeColors[notification.type]}`}>
            {typeIcons[notification.type]}
          </span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 sm:line-clamp-1 mt-0.5 break-words">{notification.subtitle}</p>
        <p className={`text-[11px] mt-1 ${isFuture ? 'text-blue-400' : 'text-gray-500'}`}>{relativeTime}</p>
      </div>
    </button>
  );
}

function ServerRow({ notification, isSelected, onSelect }: {
  notification: ServerNotification;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const image = notification.data?.image;
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-start gap-3 p-3 text-left transition-all duration-200
        hover:bg-gray-800/50 focus:bg-gray-800/50 focus:outline-none
        ${isSelected ? 'bg-gray-800/70 ring-1 ring-yellow-500/30' : ''}
        ${!notification.read ? 'border-l-2 border-yellow-500 bg-yellow-500/[0.03]' : 'border-l-2 border-transparent'}
      `}
      role="option"
      aria-selected={isSelected}
    >
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
        {image ? <Image src={image} alt="" fill className="object-cover" unoptimized /> : serverTypeIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <h4 className={`text-sm truncate ${notification.read ? 'text-gray-200' : 'text-white font-semibold'}`}>
          {notification.title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 mt-0.5 break-words">{notification.body}</p>
        <p className="text-[11px] mt-1 text-gray-500">{getRelativeTime(notification.createdAt)}</p>
      </div>
    </button>
  );
}

export default function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('foryou');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 384 });
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [items, setItems] = useState<ServerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setToken(readToken());
  }, []);

  const loadNotifications = useCallback(async () => {
    const tok = readToken();
    setToken(tok);
    if (!tok) {
      setItems([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get<{ notifications: ServerNotification[]; unreadCount: number }>(
        '/api/v1/notifications?limit=30',
        { headers: { authorization: `Bearer ${tok}` } }
      );
      setItems(Array.isArray(res.data.notifications) ? res.data.notifications : []);
      setUnreadCount(res.data.unreadCount ?? 0);
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount, refresh every minute while the tab is visible, and on focus.
  useEffect(() => {
    loadNotifications();
    const tick = () => {
      if (document.visibilityState === 'visible') loadNotifications();
    };
    const id = window.setInterval(tick, POLL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [loadNotifications]);

  useEffect(() => {
    if (isOpen) loadNotifications();
  }, [isOpen, loadNotifications]);

  const upcoming = React.useMemo(() => {
    const now = Date.now();
    return [...sampleNotifications]
      .filter((n) => n.type === 'upcoming' || new Date(n.date).getTime() > now)
      .sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        const aFuture = aTime >= now;
        const bFuture = bTime >= now;
        if (aFuture && bFuture) return aTime - bTime;
        if (!aFuture && !bFuture) return bTime - aTime;
        return aFuture ? -1 : 1;
      });
  }, []);

  const listLength = activeTab === 'foryou' ? items.length : upcoming.length;

  const updateDropdownPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 16;
    const width = Math.min(384, vw - margin * 2);
    let left = rect.right - width;
    left = Math.max(margin, Math.min(left, vw - width - margin));
    const gap = 8;
    let top = rect.bottom + gap;
    const estHeight = dropdownRef.current?.getBoundingClientRect().height || 420;
    if (top + estHeight > vh - margin) {
      const above = rect.top - estHeight - gap;
      top = above >= margin ? above : Math.max(margin, vh - estHeight - margin);
    }
    setDropdownPosition({ top, left, width });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    const onViewportChange = () => updateDropdownPosition();
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    const id = requestAnimationFrame(() => updateDropdownPosition());
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }, [isOpen, updateDropdownPosition, activeTab, listLength]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        close();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  const openServerNotification = useCallback(async (n: ServerNotification) => {
    if (!n.read && token) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      axios
        .post('/api/v1/notifications/read', { id: n.id }, { headers: { authorization: `Bearer ${token}` } })
        .catch(() => {});
    }
    const path = webRoute(n.data?.route);
    if (path) {
      close();
      router.push(path);
    }
  }, [token, router, close]);

  const openUpcoming = useCallback((n: Notification) => {
    if (n.url) {
      window.open(n.url, '_blank', 'noopener,noreferrer');
      close();
    }
  }, [close]);

  const markAllRead = async () => {
    if (!token || unreadCount === 0) return;
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    setUnreadCount(0);
    try {
      await axios.post('/api/v1/notifications/read-all', {}, { headers: { authorization: `Bearer ${token}` } });
    } catch {
      loadNotifications();
    }
  };

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex((prev) => (prev < listLength - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : listLength - 1));
        break;
      case 'Tab':
        event.preventDefault();
        setActiveTab((prev) => (prev === 'foryou' ? 'upcoming' : 'foryou'));
        setSelectedIndex(-1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (selectedIndex >= 0) {
          if (activeTab === 'foryou') openServerNotification(items[selectedIndex]);
          else openUpcoming(upcoming[selectedIndex]);
        }
        break;
    }
  }, [isOpen, listLength, selectedIndex, activeTab, items, upcoming, openServerNotification, openUpcoming]);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      (listRef.current.children[selectedIndex] as HTMLElement | undefined)?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const tabClass = (tab: TabType) => `
    flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200
    ${activeTab === tab
      ? 'text-yellow-400 border-b-2 border-yellow-500 bg-yellow-500/5'
      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
  `;

  const renderForYou = () => {
    if (!token) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <Bell className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm">Sign in to see your notifications</p>
          <button
            onClick={() => { close(); router.push('/auth/signin'); }}
            className="mt-3 text-sm font-medium text-yellow-400 hover:text-yellow-300"
          >
            Sign in
          </button>
        </div>
      );
    }
    if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="w-10 h-10 text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading…' : loadError ? "Couldn't load notifications" : 'No notifications yet'}
          </p>
          {!loading && !loadError && (
            <p className="text-gray-500 text-xs mt-1">We&apos;ll let you know when something happens</p>
          )}
        </div>
      );
    }
    return items.map((n, index) => (
      <ServerRow
        key={n.id}
        notification={n}
        isSelected={selectedIndex === index}
        onSelect={() => { setSelectedIndex(index); openServerNotification(n); }}
      />
    ));
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => { setIsOpen(!isOpen); setSelectedIndex(-1); }}
        onKeyDown={handleKeyDown}
        className={`
          relative p-2.5 rounded-xl transition-all duration-200
          bg-yellow-500 hover:bg-yellow-400
          focus:outline-none focus:ring-2 focus:ring-yellow-500/50
          ${isOpen ? 'ring-2 ring-yellow-300' : ''}
        `}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Bell className="w-5 h-5 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-yellow-500 bg-black border-2 border-yellow-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && mounted && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden overflow-x-hidden box-border"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxWidth: 'min(24rem, calc(100vw - 2rem))',
            zIndex: 9999,
            animation: 'fadeSlideIn 0.2s ease-out',
          }}
          role="listbox"
          aria-label="Notifications"
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-1">
              {activeTab === 'foryou' && unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-yellow-400 hover:bg-gray-800"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button onClick={close} className="p-1 rounded-lg hover:bg-gray-800 transition-colors" aria-label="Close notifications">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-800">
            <button
              onClick={() => { setActiveTab('foryou'); setSelectedIndex(-1); }}
              className={tabClass('foryou')}
              role="tab"
              aria-selected={activeTab === 'foryou'}
            >
              For you
              {unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-yellow-500 text-black rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('upcoming'); setSelectedIndex(-1); }}
              className={tabClass('upcoming')}
              role="tab"
              aria-selected={activeTab === 'upcoming'}
            >
              Upcoming
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full">{upcoming.length}</span>
            </button>
          </div>

          <div ref={listRef} className="max-h-[360px] overflow-y-auto divide-y divide-gray-800/50 scrollbar-overlay">
            {activeTab === 'foryou'
              ? renderForYou()
              : upcoming.length > 0
                ? upcoming.map((n, index) => (
                    <UpcomingRow
                      key={n.id}
                      notification={n}
                      isSelected={selectedIndex === index}
                      onSelect={() => { setSelectedIndex(index); openUpcoming(n); }}
                    />
                  ))
                : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="w-10 h-10 text-gray-600 mb-3" />
                    <p className="text-gray-400 text-sm">No upcoming events</p>
                  </div>
                )}
          </div>
        </div>,
        document.body
      )}

      {mounted && createPortal(
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>,
        document.head
      )}
    </div>
  );
}

// Re-export for convenience
export { sampleNotifications } from './notifications-data';

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, X, Calendar, Activity, Sparkles } from 'lucide-react';
import Image from 'next/image';
import {
  sampleNotifications,
  getRelativeTime,
  type Notification,
  type NotificationType,
} from './notifications-data';

type TabType = 'all' | 'upcoming';

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

interface NotificationRowProps {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
}

function NotificationRow({ notification, isSelected, onSelect }: NotificationRowProps) {
  const relativeTime = getRelativeTime(notification.date);
  const isFuture = new Date(notification.date) > new Date();

  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-start gap-3 p-3 text-left transition-all duration-200
        hover:bg-gray-800/50 focus:bg-gray-800/50 focus:outline-none
        ${isSelected ? 'bg-gray-800/70 ring-1 ring-yellow-500/30' : ''}
        ${!notification.read ? 'border-l-2 border-yellow-500' : 'border-l-2 border-transparent'}
      `}
      role="option"
      aria-selected={isSelected}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-700">
        <Image
          src={notification.image}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-white truncate">
            {notification.title}
          </h4>
          <span
            className={`
              flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 
              text-[10px] font-medium rounded border
              ${typeColors[notification.type]}
            `}
          >
            {typeIcons[notification.type]}
          </span>
        </div>
        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
          {notification.subtitle}
        </p>
        <p className={`text-[11px] mt-1 ${isFuture ? 'text-blue-400' : 'text-gray-500'}`}>
          {relativeTime}
        </p>
      </div>
    </button>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Filter and sort notifications
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...sampleNotifications];

    if (activeTab === 'upcoming') {
      const now = new Date();
      filtered = filtered.filter(
        (n) => n.type === 'upcoming' || new Date(n.date) > now
      );
    }

    // Sort by date descending (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [activeTab]);

  // Unread count
  const unreadCount = sampleNotifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSelectedIndex(-1);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
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
          setSelectedIndex((prev) =>
            prev < filteredNotifications.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredNotifications.length - 1
          );
          break;
        case 'Tab':
          // Switch tabs with Tab key when dropdown is open
          event.preventDefault();
          setActiveTab((prev) => (prev === 'all' ? 'upcoming' : 'all'));
          setSelectedIndex(-1);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (selectedIndex >= 0) {
            // Handle notification selection
            console.log('Selected:', filteredNotifications[selectedIndex]);
          }
          break;
      }
    },
    [isOpen, selectedIndex, filteredNotifications]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          setSelectedIndex(-1);
        }}
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
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] px-1 text-[10px] font-bold text-yellow-500 bg-black border-2 border-yellow-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown - rendered via portal to escape overflow clipping */}
      {isOpen && mounted && createPortal(
        <div
          ref={dropdownRef}
          className="fixed w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          style={{
            top: dropdownPosition.top,
            right: Math.max(16, dropdownPosition.right),
            zIndex: 9999,
            animation: 'fadeSlideIn 0.2s ease-out',
          }}
          role="listbox"
          aria-label="Notifications"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <h3 className="text-base font-semibold text-white">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedIndex(-1);
              }}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  activeTab === 'all'
                    ? 'text-yellow-400 border-b-2 border-yellow-500 bg-yellow-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'all'}
            >
              All
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full">
                {sampleNotifications.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('upcoming');
                setSelectedIndex(-1);
              }}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200
                ${
                  activeTab === 'upcoming'
                    ? 'text-yellow-400 border-b-2 border-yellow-500 bg-yellow-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
              `}
              role="tab"
              aria-selected={activeTab === 'upcoming'}
            >
              Upcoming
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-gray-800 rounded-full">
                {sampleNotifications.filter((n) => n.type === 'upcoming' || new Date(n.date) > new Date()).length}
              </span>
            </button>
          </div>

          {/* Notification List */}
          <div
            ref={listRef}
            className="max-h-[360px] overflow-y-auto divide-y divide-gray-800/50"
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  isSelected={selectedIndex === index}
                  onSelect={() => {
                    setSelectedIndex(index);
                    console.log('Clicked notification:', notification);
                  }}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-10 h-10 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
                <p className="text-gray-500 text-xs mt-1">
                  We'll notify you when something arrives
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-gray-800 p-2">
              <button
                onClick={() => {
                  console.log('View all notifications');
                  setIsOpen(false);
                }}
                className="w-full py-2 text-sm font-medium text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Global styles for animation */}
      {mounted && createPortal(
        <style>{`
          @keyframes fadeSlideIn {
            from { 
              opacity: 0; 
              transform: translateY(-8px);
            }
            to { 
              opacity: 1; 
              transform: translateY(0);
            }
          }
        `}</style>,
        document.head
      )}
    </div>
  );
}

// Re-export for convenience
export { sampleNotifications } from './notifications-data';



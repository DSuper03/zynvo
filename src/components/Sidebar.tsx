'use client';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  CreditCard,
  Users,
  Globe,
  Inbox,
  Bell,
  MessageCircle,
  Menu,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* Full Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-black text-yellow-400 border-r border-yellow-900/30 h-screen sticky top-0 transition-all duration-300 shadow-lg`}
      >
        <div className="p-5 flex justify-between items-center border-b border-yellow-900/30">
          {!collapsed && (
            <h1 className="text-lg font-bold tracking-tight text-yellow-400">
              Zynvo
            </h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-yellow-500/10 text-yellow-400"
          >
            {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-4 pb-4">
          {!collapsed && (
            <p className="text-xs font-semibold text-yellow-500/80 mb-3 px-2 mt-4">
              NAVIGATION
            </p>
          )}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <LayoutDashboard
                className={`h-5 w-5 ${isActive('/dashboard') ? 'text-black' : 'text-yellow-400'}`}
              />
              {!collapsed && (
                <span
                  className={`font-medium ${isActive('/dashboard') ? 'text-black' : 'text-yellow-400'}`}
                >
                  Dashboard
                </span>
              )}
            </Link>

            <Link
              href="/clubs"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/clubs')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList
                  className={`h-5 w-5 ${isActive('/clubs') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/clubs') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Clubs
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/clubs')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '130'}
              </span>
            </Link>

            <Link
              href="/events"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/events')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package
                  className={`h-5 w-5 ${isActive('/events') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/events') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Upcoming Events
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/events')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '84'}
              </span>
            </Link>

            <Link
              href="/discover"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/discover')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <CreditCard
                className={`h-5 w-5 ${isActive('/discover') ? 'text-black' : 'text-yellow-400'}`}
              />
              {!collapsed && (
                <span
                  className={`font-medium ${isActive('/discover') ? 'text-black' : 'text-yellow-400'}`}
                >
                  Discover
                </span>
              )}
            </Link>

            <Link
              href="/users"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/users')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`h-5 w-5 ${isActive('/users') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/users') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Users
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/users')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '45k'}
              </span>
            </Link>

            <Link
              href="/post"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/post')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <Globe
                className={`h-5 w-5 ${isActive('/post') ? 'text-black' : 'text-yellow-400'}`}
              />
              {!collapsed && (
                <span
                  className={`font-medium ${isActive('/post') ? 'text-black' : 'text-yellow-400'}`}
                >
                  Posts
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Insight Section */}
        <div className="px-4 pb-4 mt-4">
          {!collapsed && (
            <p className="text-xs font-semibold text-yellow-500/80 mb-3 px-2">
              INSIGHT
            </p>
          )}
          <nav className="space-y-1">
            <Link
              href="/inbox"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/inbox')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox
                  className={`h-5 w-5 ${isActive('/inbox') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/inbox') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Inbox
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/inbox')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '84'}
              </span>
            </Link>

            <Link
              href="/notifications"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/notifications')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell
                  className={`h-5 w-5 ${isActive('/notifications') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/notifications') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Notifications
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/notifications')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '12'}
              </span>
            </Link>

            <Link
              href="/chat"
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/chat')
                  ? 'bg-yellow-500 text-black'
                  : 'hover:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageCircle
                  className={`h-5 w-5 ${isActive('/chat') ? 'text-black' : 'text-yellow-400'}`}
                />
                {!collapsed && (
                  <span
                    className={`font-medium ${isActive('/chat') ? 'text-black' : 'text-yellow-400'}`}
                  >
                    Chat
                  </span>
                )}
              </div>
              <span
                className={`text-xs px-2 py-0.5 ${
                  isActive('/chat')
                    ? 'bg-black/80 text-yellow-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                } rounded-full font-medium`}
              >
                {collapsed ? '•' : '43'}
              </span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-yellow-900/30">
          <div
            className={`p-4 ${collapsed ? 'justify-center' : ''} flex items-center gap-3`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-500/50">
              <Image
                src="https://i.pravatar.cc/150?img=32"
                alt="Profile"
                className="object-cover"
                width={32}
                height={32}

              />
            </div>

            {!collapsed && (
              <div>
                <p className="font-medium text-sm text-yellow-400">
                  Michael Gabson
                </p>
                <p className="text-xs text-yellow-500/70">michael@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar - collapsed by default */}
      <aside className="md:hidden fixed top-0 left-0 z-40 w-16 bg-black text-yellow-400 border-r border-yellow-900/30 h-screen shadow-lg">
        <div className="p-4 flex justify-center">
          <span className="font-bold text-sm text-yellow-400">Zy.</span>
        </div>

        <nav className="flex flex-col items-center gap-5 py-5">
          <Link
            href="/dashboard"
            className={`p-2 ${isActive('/dashboard') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <Link
            href="/clubs"
            className={`p-2 ${isActive('/clubs') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <ClipboardList className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link
            href="/events"
            className={`p-2 ${isActive('/events') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <Package className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link
            href="/discover"
            className={`p-2 ${isActive('/discover') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'}`}
          >
            <CreditCard className="h-5 w-5" />
          </Link>
          <Link
            href="/users"
            className={`p-2 ${isActive('/users') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <Users className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link
            href="/post"
            className={`p-2 ${isActive('/post') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'}`}
          >
            <Globe className="h-5 w-5" />
          </Link>
          <Link
            href="/inbox"
            className={`p-2 ${isActive('/inbox') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <Inbox className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link
            href="/notifications"
            className={`p-2 ${isActive('/notifications') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link
            href="/chat"
            className={`p-2 ${isActive('/chat') ? 'bg-yellow-500 text-black rounded-lg' : 'text-yellow-400 hover:text-yellow-300'} relative`}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
        </nav>

        <div className="absolute bottom-5 left-0 w-full flex justify-center">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-yellow-500/50">
            <Image
              src="https://i.pravatar.cc/150?img=32"
              alt="Profile"
              className="object-cover"
              width={32}
              height={32}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

'use client'
import Link from "next/link";
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
  ChevronRight 
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Full Sidebar */}
      <aside 
        className={`hidden md:flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-white text-gray-700 border-r border-gray-100 h-screen sticky top-0 transition-all duration-300 shadow-sm`}
      >
        <div className="p-5 flex justify-between items-center">
          {!collapsed && <h1 className="text-lg font-bold tracking-tight">Zynvo</h1>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
          >
            {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="px-4 pb-4">
          {!collapsed && <p className="text-xs font-semibold text-gray-500 mb-3 px-2">NAVIGATION</p>}
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-gray-600" />
              {!collapsed && <span className="font-medium text-gray-700">Dashboard</span>}
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Clubs</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-yellow-200 rounded-full font-medium text-yellow-700">
                {collapsed ? "•" : "130"}
              </span>
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Upcoming Events</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-teal-200 rounded-full font-medium text-teal-700">
                {collapsed ? "•" : "84"}
              </span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <CreditCard className="h-5 w-5 text-gray-600" />
              {!collapsed && <span className="font-medium text-gray-700">Registered Events</span>}
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Users</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-orange-200 rounded-full font-medium text-orange-700">
                {collapsed ? "•" : "45k"}
              </span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-5 w-5 text-gray-600" />
              {!collapsed && <span className="font-medium text-gray-700">Campaigns</span>}
            </Link>
          </nav>
        </div>

        {/* Insight Section */}
        <div className="px-4 pb-4 mt-4">
          {!collapsed && <p className="text-xs font-semibold text-gray-500 mb-3 px-2">INSIGHT</p>}
          <nav className="space-y-1">
            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Inbox className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Inbox</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-blue-200 rounded-full font-medium text-blue-700">
                {collapsed ? "•" : "84"}
              </span>
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Notifications</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-red-200 rounded-full font-medium text-red-700">
                {collapsed ? "•" : "12"}
              </span>
            </Link>

            <Link
              href="#"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                {!collapsed && <span className="font-medium text-gray-700">Chat</span>}
              </div>
              <span className="text-xs px-2 py-0.5 bg-purple-200 rounded-full font-medium text-purple-700">
                {collapsed ? "•" : "43"}
              </span>
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-100">
          <div className={`p-4 ${collapsed ? 'justify-center' : ''} flex items-center gap-3`}>
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="https://i.pravatar.cc/150?img=32" 
                alt="Profile" 
                className="object-cover"
              />
            </div>
            
            {!collapsed && (
              <div>
                <p className="font-medium text-sm">Michael Gabson</p>
                <p className="text-xs text-gray-500">michael@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile sidebar - collapsed by default */}
      <aside className="md:hidden fixed top-0 left-0 z-40 w-16 bg-white text-gray-700 border-r border-gray-100 h-screen shadow-sm">
        <div className="p-4 flex justify-center">
          <span className="font-bold text-sm">Sa.</span>
        </div>
        
        <nav className="flex flex-col items-center gap-5 py-5">
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600">
            <LayoutDashboard className="h-5 w-5" />
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <ClipboardList className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <Package className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-teal-400 rounded-full"></span>
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600">
            <CreditCard className="h-5 w-5" />
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <Users className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-orange-400 rounded-full"></span>
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600">
            <Globe className="h-5 w-5" />
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <Inbox className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-blue-400 rounded-full"></span>
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-400 rounded-full"></span>
          </Link>
          <Link href="#" className="p-2 text-gray-700 hover:text-blue-600 relative">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-purple-400 rounded-full"></span>
          </Link>
        </nav>

        <div className="absolute bottom-5 left-0 w-full flex justify-center">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img 
              src="https://i.pravatar.cc/150?img=32" 
              alt="Profile" 
              className="object-cover"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
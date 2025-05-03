"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  href: string;
}

interface TablistProps {
  tabs?: TabItem[];
  baseUrl?: string;
  currentTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'secondary';
}

// Default tabs based on the image
const defaultTabs: TabItem[] = [
  { id: 'overview', label: 'OVERVIEW', href: 'overview' },
  { id: 'prizes', label: 'PRIZES', href: 'prizes' },
  { id: 'speakers', label: 'SPEAKERS & JUDGES', href: 'speakers' },
  { id: 'schedule', label: 'SCHEDULE', href: 'schedule' },
  { id: 'gallery', label: 'GALLERY', href: 'gallery' },
];

export function Tablist({
  tabs = defaultTabs,
  baseUrl = '',
  currentTab: controlledTab,
  onTabChange,
  variant = 'default',
}: TablistProps) {
  // For controlled component usage
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  // Determine active tab - either from props or from URL
  const [activeTab, setActiveTab] = useState<string>(
    controlledTab || tabs.find(tab => tab.href === lastSegment)?.id || tabs[0].id
  );

  const handleTabClick = (tabId: string) => {
    if (!controlledTab) {
      setActiveTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  // Style variants
  const getTabStyle = (tabId: string) => {
    const isActive = tabId === (controlledTab || activeTab);
    
    if (variant === 'secondary') {
      return {
        button: `px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
          isActive 
            ? "text-yellow-500 border-yellow-500" 
            : "text-gray-500 border-transparent hover:text-yellow-400 hover:border-yellow-400/30"
        }`,
        container: "border-b border-gray-200 dark:border-gray-800"
      };
    }
    
    // Default/primary variant
    return {
      button: `px-5 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
        isActive
          ? "bg-yellow-400 text-gray-900" 
          : "text-gray-100 hover:bg-yellow-400/10 hover:text-yellow-400"
      }`,
      container: "bg-gray-900 p-1 rounded-lg"
    };
  };

  return (
    <div className={`flex overflow-x-auto hide-scrollbar ${getTabStyle('').container}`}>
      <div className="flex space-x-1">
        {tabs.map((tab) => {
          const style = getTabStyle(tab.id);
          const tabHref = `${baseUrl}${baseUrl && !baseUrl.endsWith('/') ? '/' : ''}${tab.href}`;
          
          return (
            <Link
              key={tab.id}
              href={tabHref}
              onClick={() => handleTabClick(tab.id)}
              className={style.button}
            >
              {tab.label}
              {tab.id === (controlledTab || activeTab) && variant === 'default' && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Tablist;
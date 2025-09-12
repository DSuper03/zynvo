import Image from 'next/legacy/image';
import { Tablist } from '@/components/Tablist';
import { EventLayoutProps } from '@/types/global-Interface';

const eventTabItems = [
  { id: 'overview', label: 'OVERVIEW', href: '/' },
  { id: 'prizes', label: 'PRIZES', href: 'prizes' },
  { id: 'speakers', label: 'SPEAKERS & JUDGES', href: 'speakers' },
  { id: 'schedule', label: 'SCHEDULE', href: 'schedule' },
  { id: 'gallery', label: 'GALLERY', href: 'gallery' },
];

export default function EventLayout({ children, params }: EventLayoutProps) {
  const eventId = params.id;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Main Content - Responsive padding */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

import Image from 'next/image';
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
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header - Fixed portion */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-24">
        {/* Your header content - Add this section */}
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
          <Image
            src="/landing.png"
            alt="Event Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <Tablist
            tabs={eventTabItems}
            baseUrl={`/events/${eventId}`}
            variant="default"
          />
        </div>
      </div>

      {/* Main content - Scrollable portion */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

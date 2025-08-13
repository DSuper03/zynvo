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
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="w-full px-2 sm:px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Event Banner - Responsive height and padding */}
          <div className="relative h-32 sm:h-48 md:h-56 lg:h-64 w-full rounded-lg sm:rounded-xl overflow-hidden mb-4 sm:mb-6">
            <Image
              src="/landing.png"
              alt="Event Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Event Info - Responsive positioning and sizing */}
            <div className="absolute bottom-0 left-0 p-3 sm:p-4 lg:p-6 w-full">
              <div className="flex items-center">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 mr-2 sm:mr-3 lg:mr-4">
                  <span className="text-black font-bold text-sm sm:text-lg lg:text-xl">
                    E
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-white text-lg sm:text-2xl lg:text-3xl font-bold truncate">
                    Event #{eventId}
                  </h1>
                  <p className="text-gray-300 text-xs sm:text-sm lg:text-base truncate">
                    May 10-12, 2025 • Virtual & San Francisco, CA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs - Mobile responsive */}
          <div className="mt-2 sm:mt-4 lg:mt-6">
            <Tablist
              tabs={eventTabItems}
              baseUrl={`/events/${eventId}`}
              variant="default"
            />
          </div>
        </div>
      </div>

      {/* Main Content - Responsive padding */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

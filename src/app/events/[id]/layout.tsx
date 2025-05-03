import Image from 'next/image';
import { Tablist } from '@/components/Tablist';

interface EventLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="relative h-48 sm:h-64 w-full rounded-xl overflow-hidden mb-6">
          <Image
            src="/landing.png"
            alt="Event Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 mr-4">
                <span className="text-black font-bold text-xl">E</span>
              </div>
              <div>
                <h1 className="text-white text-3xl font-bold">Event #{eventId}</h1>
                <p className="text-gray-300 text-sm">
                  May 10-12, 2025 • Virtual & San Francisco, CA
                </p>
              </div>
            </div>
          </div>
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
       
    </div>
  );
}

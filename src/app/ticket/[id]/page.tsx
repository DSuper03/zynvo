'use client';

import { useEffect, useState, useRef } from 'react';
import EventBadgeCard from '@/components/ticket';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import * as htmlToImage from 'html-to-image';

export default function Page() {
  const params = useParams();
  const id = params.id;
  const [bgColor, setBgColor] = useState('#1e293b');
  const [bgImage, setBgImage] = useState(
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
  );
  const [overlayOpacity, setOverlayOpacity] = useState(0.6);
  const [data, setData] = useState<any>({});
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    async function call() {
      const fetch = await axios.get<{
        data: {
          eventName: string;
          clubName: string;
          collegeName: string;
          startDate: Date;
          profilePic: string;
        };
      }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event-details?id=${id}`
      );
      if (fetch && fetch.data && fetch.data.data) {
        const eventData = fetch.data.data;
        setData({
          ...eventData,
          startDate: new Date(eventData.startDate).toLocaleString(),
        });
      }
    }

    call();
  }, [id]);

  // Download badge as PNG
  const handleDownload = async () => {
    if (badgeRef.current) {
      const dataUrl = await htmlToImage.toPng(badgeRef.current);
      const link = document.createElement('a');
      link.download = `${data.eventName || 'event-badge'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-r from-slate-100 to-slate-300 p-6">
      {/* Badge Preview */}
      <div ref={badgeRef}>
        <EventBadgeCard
          eventName={data.eventName || 'Tech Fest 2025'}
          eventTimings={data.startDate || 'March 12, 2025 • 10:00 AM - 5:00 PM'}
          collegeName={data.collegeName || 'Delhi Technical Campus'}
          clubName={data.clubName || 'AI & Robotics Club'}
          profileImage={data.profilePic || 'https://i.pravatar.cc/300'}
          qrCodeImage={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://zynvo.social/verify-event/${id}`}
          style={{
            backgroundColor: bgColor,
            textColor: 'white',
            backgroundImage: bgImage,
            overlayOpacity: overlayOpacity,
          }}
        />
      </div>

      {/* Download Button */}
      <Button
        className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
        onClick={handleDownload}
      >
        Download Badge
      </Button>

      {/* Controls */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-700">Customize Badge</h2>

        {/* Background Color */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-gray-600 font-medium">Background Color:</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-16 h-10 cursor-pointer border rounded"
          />
        </div>

        {/* Background Image URL */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-medium">
            Background Image URL:
          </label>
          <input
            type="text"
            value={bgImage}
            onChange={(e) => setBgImage(e.target.value)}
            placeholder="Enter image URL"
            className="border rounded-lg px-3 py-2 w-full"
          />
        </div>

        {/* Overlay Opacity */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-600 font-medium">Overlay Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">
            {overlayOpacity.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FiUsers } from 'react-icons/fi';

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  imageUrl: string;
}

export function ClubCard({ id, name, description, memberCount, category, imageUrl }: ClubCardProps) {
  return (
    <Link href={`/clubs/${id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <div className="relative h-40 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs text-white">
              {category}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-1 truncate">{name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3 h-10">
            {description}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiUsers className="mr-1" />
            <span>{memberCount} members</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ClubCard;
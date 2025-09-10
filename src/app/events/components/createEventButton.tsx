// This can go in a component file like src/components/ui/create-event-button.tsx
import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CreateEventButtonProps {
  onClick?: () => void;
  className?: string;
}

const CreateEventButton = ({ onClick, className }: CreateEventButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-black rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <span className="mr-2">
        <Calendar className="size-5" />
      </span>
      <span>Create Event</span>
      <span className="absolute right-0 top-0 bottom-0 w-8 h-full transition-all duration-300 transform translate-x-12 bg-white opacity-10 group-hover:translate-x-0"></span>
    </Button>
  );
};

export default CreateEventButton;

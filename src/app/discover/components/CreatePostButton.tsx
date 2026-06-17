import React from 'react';
import { PenSquare } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface CreatePostButtonProps {
  onClick?: () => void;
  className?: string;
}

const CreatePostButton = ({ onClick, className }: CreatePostButtonProps) => {
  return (
    <ShimmerButton
      onClick={onClick}
      shimmerDuration="2.5s"
      borderRadius="12px"
      className={`inline-flex items-center gap-2 px-5 py-3 font-medium text-yellow-400 hover:text-yellow-300 transition-colors duration-200 ${className}`}
    >
      <PenSquare className="h-5 w-5 text-yellow-400" />
      <span className="tracking-tight">Create Post</span>
    </ShimmerButton>
  );
};

export default CreatePostButton;

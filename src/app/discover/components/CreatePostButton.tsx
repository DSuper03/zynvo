import { PenSquare } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';

export default function CreatePostButton({
  onClick,
  className = '',
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <ShimmerButton
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      shimmerDuration="2.5s"
      borderRadius="12px"
      className={`inline-flex items-center gap-2 px-5 py-3 font-medium text-yellow-400 hover:text-yellow-300 transition-colors duration-200 ${className}`}
    >
      <PenSquare aria-hidden className="h-5 w-5" />
      <span className="tracking-tight">Create Post</span>
    </ShimmerButton>
  );
}

import React from 'react';
import { Plus, FileText } from 'lucide-react';

interface CreatePostButtonProps {
  onClick?: () => void;
  className?: string;
}

const CreatePostButton = ({ onClick, className }: CreatePostButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-black rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <span className="mr-2">
        <FileText className="h-5 w-5" />
      </span>
      <span>Create Post</span>
      <span className="absolute right-0 top-0 bottom-0 w-8 h-full transition-all duration-300 transform translate-x-12 bg-white opacity-10 group-hover:translate-x-0"></span>
    </button>
  );
};

export default CreatePostButton;
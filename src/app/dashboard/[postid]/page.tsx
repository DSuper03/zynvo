"use client";

import React from 'react';
import { useAuth } from '@/context/authContex';

type Props = {
  params: {
    postid: string;
  };
};

export default function PostPage({ params }: Props) {
  const { user } = useAuth();
  const userId = user?.id;

  return (
    <div>
      <h1 className="text-white font-medium">Post Page</h1>
      <p className="text-gray-300">Post ID: {params.postid}</p>
      <p className="text-yellow-400">User ID: {userId ?? 'Not logged in'}</p>
    </div>
  );
}
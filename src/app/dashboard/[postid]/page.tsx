"use client";

import React from 'react';
import { useAuth } from '@/context/authContex';
import { useParams } from 'next/navigation';

export default function PostPage() {
  const { user } = useAuth();
  const params = useParams();
  const postid = params.postid as string;
  const userId = user?.id;

  return (
    <div>
      <h1 className="text-white font-medium">Post Page</h1>
      <p className="text-gray-300">Post ID: {postid}</p>
      <p className="text-yellow-400">User ID: {userId ?? 'Not logged in'}</p>
    </div>
  );
}

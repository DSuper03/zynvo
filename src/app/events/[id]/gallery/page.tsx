'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { X, Upload, Link as LinkIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  type: 'image' | 'link';
  url: string;
  title: string;
  createdAt: string;
}

const GalleryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemType, setItemType] = useState<'image' | 'link'>('link');
  const [itemUrl, setItemUrl] = useState('');
  const [itemTitle, setItemTitle] = useState('');

  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) setToken(tok);
  }, []);

  useEffect(() => {
    if (!id || !token) return;

    const checkFounderAndFetchGallery = async () => {
      try {
        // Check if user is founder
        const founderRes = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/isFounder?id=${id}`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        if (founderRes.status === 200 && founderRes.data.msg === 'identified') {
          setIsFounder(true);
        }

        // Fetch gallery items
        try {
          const galleryRes = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/gallery/${id}`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          if (galleryRes.data && galleryRes.data.response) {
            setGalleryItems(galleryRes.data.response);
          }
        } catch (e) {
          // Gallery endpoint might not exist yet
          console.log('Gallery endpoint not yet available');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFounderAndFetchGallery();
  }, [id, token]);

  const handleAddItem = async () => {
    if (!itemUrl.trim() || !itemTitle.trim()) {
      toast('Please fill in all fields');
      return;
    }

    if (!token) {
      toast('You must be logged in');
      return;
    }

    try {
      const newItem = {
        type: itemType,
        url: itemUrl,
        title: itemTitle,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/gallery/${id}`,
        newItem,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setGalleryItems([...galleryItems, res.data.response]);
        setItemUrl('');
        setItemTitle('');
        setIsAddingItem(false);
        toast('Gallery item added successfully');
      }
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast('Failed to add gallery item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/gallery/${id}/${itemId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      setGalleryItems(galleryItems.filter((item) => item.id !== itemId));
      toast('Gallery item deleted');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast('Failed to delete gallery item');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Event Gallery</h1>
          <p className="text-gray-400">
            Share photos and media from your event
          </p>
        </div>

        {isFounder && (
          <div className="mb-8 bg-[#0B0B0B] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-yellow-400">
                {isAddingItem ? 'Add Gallery Item' : 'Add New Item'}
              </h2>
              {isAddingItem && (
                <button
                  onClick={() => setIsAddingItem(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!isAddingItem ? (
              <Button
                onClick={() => setIsAddingItem(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Picture or Link
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Item Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="image"
                        checked={itemType === 'image'}
                        onChange={(e) => setItemType(e.target.value as 'image')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Image</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="link"
                        checked={itemType === 'link'}
                        onChange={(e) => setItemType(e.target.value as 'link')}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-300">Google Drive Link</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    Title
                  </label>
                  <Input
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    placeholder="e.g., Day 1 Highlights"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">
                    {itemType === 'image' ? 'Image URL' : 'Google Drive Link'}
                  </label>
                  <Input
                    value={itemUrl}
                    onChange={(e) => setItemUrl(e.target.value)}
                    placeholder={
                      itemType === 'image'
                        ? 'https://example.com/image.jpg'
                        : 'https://drive.google.com/...'
                    }
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <Button
                  onClick={handleAddItem}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg"
                >
                  Add to Gallery
                </Button>
              </div>
            )}
          </div>
        )}

        {galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No images or links yet</p>
            {isFounder && (
              <p className="text-sm text-gray-500">
                Add the first item to get started!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-[#0B0B0B] border border-gray-800 rounded-xl overflow-hidden group hover:border-yellow-400/30 transition-colors"
              >
                {item.type === 'image' ? (
                  <div className="relative w-full h-64 bg-gray-800">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-blue-900 to-blue-800 flex flex-col items-center justify-center p-4">
                    <LinkIcon className="w-12 h-12 text-blue-300 mb-2" />
                    <p className="text-sm text-blue-200 text-center truncate">
                      Google Drive Link
                    </p>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      {item.type === 'image' ? 'View' : 'Open'}
                    </a>
                    {isFounder && (
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-medium rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;

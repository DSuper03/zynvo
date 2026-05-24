'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { X, Link as LinkIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  eventId: string;
  createdAt: string;
}

// Infer display type from URL since the backend doesn't store a type field.
const getItemType = (url: string): 'image' | 'link' =>
  /drive\.google\.com|docs\.google\.com/i.test(url) ? 'link' : 'image';

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|svg|avif|bmp|tiff?)(\?.*)?$/i;
const DRIVE_PATTERNS = [
  /^https:\/\/drive\.google\.com\/file\/d\/.+/i,
  /^https:\/\/drive\.google\.com\/drive\/.+/i,
  /^https:\/\/drive\.google\.com\/open\?id=.+/i,
  /^https:\/\/drive\.google\.com\/uc\?/i,
  /^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation|forms)\/.+/i,
];

type UrlValidation =
  | { valid: true; type: 'image' | 'drive' }
  | { valid: false; error: string };

const validateUrl = (raw: string): UrlValidation => {
  const trimmed = raw.trim();
  if (!trimmed) return { valid: false, error: 'URL is required' };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Not a valid URL — must start with https://' };
  }

  if (parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTPS links are allowed' };
  }

  if (DRIVE_PATTERNS.some((p) => p.test(trimmed))) {
    return { valid: true, type: 'drive' };
  }

  if (/drive\.google\.com|docs\.google\.com/i.test(parsed.hostname)) {
    return {
      valid: false,
      error:
        'Invalid Google Drive link. Use "Share → Copy link" and make sure it\'s set to "Anyone with the link"',
    };
  }

  if (IMAGE_EXTENSIONS.test(parsed.pathname)) {
    return { valid: true, type: 'image' };
  }

  // Allow known image CDN hostnames without extension checks
  const imageCdnHosts = [
    'i.imgur.com',
    'res.cloudinary.com',
    'images.unsplash.com',
    'cdn.discordapp.com',
    'media.discordapp.net',
    'i.ibb.co',
    'postimg.cc',
    'i.postimg.cc',
  ];
  if (imageCdnHosts.some((h) => parsed.hostname.endsWith(h))) {
    return { valid: true, type: 'image' };
  }

  return {
    valid: false,
    error:
      'Link must be a direct image URL (ending in .jpg, .png, etc.) or a Google Drive share link',
  };
};

const GalleryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [token, setToken] = useState<string | null>(null);
  const [isFounder, setIsFounder] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemUrl, setItemUrl] = useState('');
  const [itemTitle, setItemTitle] = useState('');

  const urlValidation: UrlValidation | null = itemUrl.trim() ? validateUrl(itemUrl) : null;

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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/${id}/gallery`,
            {
              headers: { authorization: `Bearer ${token}` },
            }
          );
          if (galleryRes.data?.data) {
            setGalleryItems(galleryRes.data.data);
          }
        } catch (e) {
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
    if (!itemTitle.trim()) {
      toast.error('Please enter a caption');
      return;
    }

    if (!itemUrl.trim()) {
      toast.error('Please enter an image URL or Google Drive link');
      return;
    }

    const validation = validateUrl(itemUrl);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (!token) {
      toast.error('You must be logged in to add gallery items');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/${id}/gallery`,
        { imageUrl: itemUrl.trim(), caption: itemTitle.trim() },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 201 || res.status === 200) {
        setGalleryItems([...galleryItems, res.data.data]);
        setItemUrl('');
        setItemTitle('');
        setIsAddingItem(false);
        toast.success('Gallery item added successfully');
      }
    } catch (error: any) {
      console.error('Error adding gallery item:', error);
      if (error.response?.status === 403) {
        toast.error('Only the club head can add gallery images');
      } else if (error.response?.status === 404) {
        toast.error('Event not found');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.msg || 'Invalid request');
      } else if (error.request) {
        toast.error('Network error. Please check your connection and try again');
      } else {
        toast.error('Failed to add gallery item. Please try again');
      }
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!token) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/${id}/gallery?galleryId=${itemId}`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      setGalleryItems(galleryItems.filter((item) => item.id !== itemId));
      toast.success('Gallery item deleted');
    } catch (error: any) {
      console.error('Error deleting gallery item:', error);
      if (error.response?.status === 403) {
        toast.error('Only the club head can delete gallery images');
      } else if (error.response?.status === 404) {
        toast.error('Gallery item not found');
      } else if (error.request) {
        toast.error('Network error. Please check your connection');
      } else {
        toast.error('Failed to delete gallery item. Please try again');
      }
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
                    Caption
                  </label>
                  <Input
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    placeholder="e.g., Day 1 Highlights"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-yellow-400">
                      Image URL or Google Drive Link
                    </label>
                    {urlValidation && (
                      urlValidation.valid ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          urlValidation.type === 'drive'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {urlValidation.type === 'drive' ? '✓ Google Drive' : '✓ Image'}
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                          Invalid
                        </span>
                      )
                    )}
                  </div>
                  <Input
                    value={itemUrl}
                    onChange={(e) => setItemUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg  or  https://drive.google.com/..."
                    className={`bg-gray-800 border text-white transition-colors ${
                      urlValidation
                        ? urlValidation.valid
                          ? 'border-green-600 focus-visible:ring-green-600'
                          : 'border-red-600 focus-visible:ring-red-600'
                        : 'border-gray-700'
                    }`}
                  />
                  {urlValidation && !urlValidation.valid && (
                    <p className="mt-1.5 text-xs text-red-400">{urlValidation.error}</p>
                  )}
                  {urlValidation?.valid && urlValidation.type === 'drive' && (
                    <p className="mt-1.5 text-xs text-blue-400/80">
                      Make sure the Drive link is set to &quot;Anyone with the link&quot; so visitors can open it.
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleAddItem}
                  disabled={!itemTitle.trim() || !urlValidation?.valid}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
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
            {galleryItems.map((item) => {
              const type = getItemType(item.imageUrl);
              return (
                <div
                  key={item.id}
                  className="relative bg-[#0B0B0B] border border-gray-800 rounded-xl overflow-hidden group hover:border-yellow-400/30 transition-colors"
                >
                  {type === 'image' ? (
                    <div className="relative w-full h-64 bg-gray-800">
                      <Image
                        src={item.imageUrl}
                        alt={item.caption}
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
                      {item.caption}
                    </h3>
                    <p className="text-xs text-gray-400 mb-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                      >
                        {type === 'image' ? 'View' : 'Open'}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;

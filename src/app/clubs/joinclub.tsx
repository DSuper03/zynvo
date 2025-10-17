'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/legacy/image';
import { JoinClubModalProps } from '@/types/global-Interface';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const JoinClubModal: React.FC<JoinClubModalProps> = ({
  isOpen,
  onClose,
  clubName,
  clubImage,
  clubId,
}) => {
  const [formData, setFormData] = useState({
    motivation: '',
  });
  const [token, setToken] = useState<string | null>('');
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      if (sessionStorage.getItem('activeSession') != 'true') {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
        return;
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
       toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => router.push('/auth/signin'),
          },
        });
      return;
    }
    const res = await axios.post<{ msg: string }>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/joinClub/${clubId}`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status == 200) {
      alert(res.data.msg);
      onClose();
    } else {
      alert(res.data.msg);
    }
    // console.log('Join request data:', formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative bg-gray-900 border border-yellow-500/30 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Join <span className="text-yellow-400">{clubName}</span>
          </h2>
          <Button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={24} />
          </Button>
        </div>

        <div className="flex justify-center pt-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-500">
            <Image
              src={clubImage}
              alt={clubName}
              className="w-full h-full object-cover"
              width={40}
              height={40}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Motivation */}
          <div className="space-y-2">
            <label
              htmlFor="motivation"
              className="block text-sm font-medium text-yellow-400"
            >
              Why do you want to join this club?
            </label>
            <textarea
              id="motivation"
              name="motivation"
              rows={3}
              placeholder="Share your motivation for joining this club (optional)"
              value={formData.motivation}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-yellow-500 text-white px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors"
            >
              Zync in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinClubModal;

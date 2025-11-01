'use client';

import React, { useEffect, useState } from 'react';
import { X, Info, CheckCircle2 } from 'lucide-react';
import Image from 'next/legacy/image';
import { JoinClubModalProps } from '@/types/global-Interface';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const JoinClubModal: React.FC<JoinClubModalProps> = ({
  isOpen,
  onClose,
  clubName,
  clubImage,
  clubId,
  requirements,
}) => {
  const [formData, setFormData] = useState({
    motivation: '',
  });
  const [token, setToken] = useState<string | null>('');
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
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

        <div className="flex flex-col items-center pt-6 gap-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-lg shadow-yellow-500/20">
            <Image
              src={clubImage || '/logozynvo.jpg'}
              alt={clubName}
              layout="fill"
              className="w-full h-full object-cover"
              priority
            />
          </div>
          
          {/* Membership Criteria Badge */}
          {requirements && requirements.trim() && (
            <Badge
              onClick={() => setShowCriteriaModal(true)}
              className="cursor-pointer bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/50 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Membership Criteria</span>
            </Badge>
          )}
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

      {/* Membership Criteria Modal */}
      {showCriteriaModal && requirements && requirements.trim() && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="relative bg-gray-900 border border-yellow-500/30 rounded-xl w-full max-w-md shadow-2xl">
            <div className="sticky top-0 z-10 bg-gray-900 border-b border-yellow-500/30 p-4 flex justify-between items-center rounded-t-xl">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">{clubName}</h3>
                  <p className="text-xs text-gray-400">Membership Criteria</p>
                </div>
              </div>
              <Button
                onClick={() => setShowCriteriaModal(false)}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {requirements}
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setShowCriteriaModal(false)}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg font-medium transition-colors"
                >
                  Got it
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinClubModal;

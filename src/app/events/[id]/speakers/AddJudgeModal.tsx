'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAddJudge } from '@/hooks/useAddJudge';
import { X, Loader2 } from 'lucide-react';

interface AddJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export default function AddJudgeModal({
  isOpen,
  onClose,
  eventId,
}: AddJudgeModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    achievement: '',
    description: '',
  });

  const addJudgeMutation = useAddJudge();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.achievement || !formData.description) {
      return;
    }

    try {
      // Submit judge data
      await addJudgeMutation.mutateAsync({
        eventId,
        name: formData.name,
        achievement: formData.achievement,
        description: formData.description,
      });

      // Reset form
      setFormData({
        name: '',
        achievement: '',
        description: '',
      });

      onClose();
    } catch (error) {
      console.error('Error adding judge:', error);
    }
  };

  const handleClose = () => {
    if (!addJudgeMutation.isPending) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border-2 border-yellow-500/30 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Add New Judge</h3>
              <Button
                onClick={handleClose}
                disabled={addJudgeMutation.isPending}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-white font-medium mb-2">Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400"
                  placeholder="Enter judge's name"
                  required
                  disabled={addJudgeMutation.isPending}
                />
              </div>

              {/* Achievement */}
              <div>
                <label className="block text-white font-medium mb-2">Achievement / Role</label>
                <Input
                  type="text"
                  name="achievement"
                  value={formData.achievement}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400"
                  placeholder="e.g. SDE-2 at Google, Tech Founder"
                  required
                  disabled={addJudgeMutation.isPending}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-800 border-gray-700 text-white focus:border-yellow-400 resize-none"
                  placeholder="Enter a brief background or bio"
                  required
                  disabled={addJudgeMutation.isPending}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={handleClose}
                  disabled={addJudgeMutation.isPending}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addJudgeMutation.isPending}
                  className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addJudgeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Judge'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

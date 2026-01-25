'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { compressImageToUnder2MB, toBase64, uploadImageToImageKit } from '@/lib/imgkit';
import { toast } from 'sonner';

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProofSubmitted: (proofUrl: string) => Promise<void>;
  qrCodeUrl: string;
  eventName: string;
  paymentAmount: number;
  isSubmitting?: boolean;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  isOpen,
  onClose,
  onProofSubmitted,
  qrCodeUrl,
  eventName,
  paymentAmount,
  isSubmitting = false,
}) => {
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxBytes = 5 * 1024 * 1024; 

      let processed = file;
      if (file.size > maxBytes) {
        processed = await compressImageToUnder2MB(file);
        if (processed.size > maxBytes) {
          toast('Could not compress screenshot under 5 MB. Try a smaller image.');
          return;
        }
      }

      setProofImage(processed);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          setProofPreviewUrl(fileReader.result);
        }
      };
      fileReader.readAsDataURL(processed);
      e.currentTarget.value = '';
    }
  };

  const handleSubmitProof = async () => {
    if (!proofImage) {
      toast('Please upload a payment screenshot');
      return;
    }

    setIsUploading(true);
    try {
      const maxBytes = 5 * 1024 * 1024;
      let toUpload = proofImage;
      if (proofImage.size > maxBytes) {
        toUpload = await compressImageToUnder2MB(proofImage);
        if (toUpload.size > maxBytes) {
          toast('Could not compress screenshot under 5 MB. Try a smaller image.');
          setIsUploading(false);
          return;
        }
      }

      const proofUrl = await uploadImageToImageKit(
        await toBase64(toUpload),
        toUpload.name,
        '/payment-proof'
      );

      toast('Payment proof uploaded successfully!');
      await onProofSubmitted(proofUrl);

      // Reset state
      setProofImage(null);
      setProofPreviewUrl('');
      onClose();
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast('Error uploading payment proof. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setProofImage(null);
    setProofPreviewUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-md w-full border border-gray-800 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 flex items-center justify-between">
          <h2 className="text-black font-bold text-lg">Payment Verification</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting || isUploading}
            className="text-black hover:bg-black hover:bg-opacity-20 rounded-full p-1 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Event Info */}
          <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-400">Event</p>
            <p className="text-white font-semibold">{eventName}</p>
            <p className="text-sm text-yellow-400">Amount to Pay: ₹{paymentAmount}</p>
          </div>

          {/* QR Code Display */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-300">
              Scan the QR code below to make the payment:
            </p>
            <div className="flex justify-center">
              {qrCodeUrl ? (
                <div className="relative w-40 h-40 bg-white p-2 rounded-lg">
                  <Image
                    src={qrCodeUrl}
                    alt="Payment QR Code"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ) : (
                <div className="w-40 h-40 bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">QR Code not available</p>
                    <p className="text-gray-500 text-xs mt-1">Contact event organizer</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700"></div>

          {/* Instructions */}
          <div className="bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-30 p-3 rounded-lg flex gap-2">
            <AlertCircle size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-blue-400 mb-1">Upload Payment Screenshot</p>
              <p>
                Please take a screenshot of your payment confirmation and upload it below to complete your registration.
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Payment Screenshot*
            </label>

            <input
              type="file"
              accept="image/*"
              id="paymentProofUpload"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading || isSubmitting}
            />

            {!proofPreviewUrl ? (
              <label htmlFor="paymentProofUpload" className="cursor-pointer block">
                <div className="w-full bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-6 hover:border-yellow-500 transition-colors flex flex-col items-center justify-center disabled:opacity-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">
                    Click to upload screenshot
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Max 5MB (JPG, PNG)</span>
                </div>
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={proofPreviewUrl}
                    alt="Payment Proof Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <label htmlFor="paymentProofUpload" className="cursor-pointer flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                      disabled={isUploading || isSubmitting}
                    >
                      Change
                    </Button>
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isUploading || isSubmitting}
                    className="flex-1 bg-red-900 bg-opacity-20 hover:bg-red-900 hover:bg-opacity-40 text-red-400 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success Check */}
          <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900 bg-opacity-20 p-3 rounded-lg">
            <CheckCircle size={16} />
            <span>Your payment will be verified by the event organizer</span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
            disabled={isUploading || isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmitProof}
            disabled={!proofImage || isUploading || isSubmitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Complete Registration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProofModal;

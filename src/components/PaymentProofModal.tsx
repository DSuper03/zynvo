'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  CheckCircle,
  QrCode,
  Maximize2,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  const [showQRZoom, setShowQRZoom] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxBytes = 5 * 1024 * 1024;

      let processed = file;
      if (file.size > maxBytes) {
        processed = await compressImageToUnder2MB(file);
        if (processed.size > maxBytes) {
          toast.error('Could not compress screenshot under 5 MB. Try a smaller image.');
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
      toast.error('Please upload a payment screenshot');
      return;
    }

    setIsUploading(true);
    try {
      const maxBytes = 5 * 1024 * 1024;
      let toUpload = proofImage;
      if (proofImage.size > maxBytes) {
        toUpload = await compressImageToUnder2MB(proofImage);
        if (toUpload.size > maxBytes) {
          toast.error('Could not compress screenshot under 5 MB. Try a smaller image.');
          setIsUploading(false);
          return;
        }
      }

      const proofUrl = await uploadImageToImageKit(
        await toBase64(toUpload),
        toUpload.name,
        '/payment-proof'
      );

      toast.success('Payment proof uploaded successfully!');
      await onProofSubmitted(proofUrl);

      // Reset state
      setProofImage(null);
      setProofPreviewUrl('');
      onClose();
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast.error('Error uploading payment proof. Please try again.');
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
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <Card className="relative z-10 w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] bg-[#0a0a0a] border border-gray-800/50 shadow-2xl flex flex-col overflow-hidden">
          {/* Header with Close Button - Sticky */}
          <CardHeader className="relative pb-4 flex-shrink-0 border-b border-gray-800/50 bg-[#0a0a0a]">
            <button
              onClick={onClose}
              disabled={isSubmitting || isUploading}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-800/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            
            <div className="pr-10 sm:pr-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Payment Verification</h2>
              <p className="text-xs sm:text-sm text-gray-400">Complete your registration by uploading payment proof</p>
            </div>
          </CardHeader>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Event Info Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-3 sm:p-4 border border-gray-800/50">
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Event</p>
                <p className="text-base sm:text-lg font-semibold text-white">{eventName}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xl sm:text-2xl font-bold text-yellow-400">₹{paymentAmount}</span>
                  <span className="text-xs sm:text-sm text-gray-400">to be paid</span>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-yellow-400" />
                <p className="text-sm font-medium text-gray-300">Scan QR Code to Pay</p>
              </div>
              
              <div className="flex justify-center">
                {qrCodeUrl ? (
                  <button
                    onClick={() => setShowQRZoom(true)}
                    className="group relative bg-white p-3 sm:p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    disabled={isUploading || isSubmitting}
                  >
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                      <Image
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 rounded-2xl transition-colors">
                      <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Click to enlarge</p>
                  </button>
                ) : (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-2xl flex items-center justify-center">
                    <div className="text-center p-4">
                      <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm text-gray-400">QR Code not available</p>
                      <p className="text-xs text-gray-500 mt-1">Contact event organizer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800/50" />

            {/* Instructions */}
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-3 sm:p-4">
              <div className="flex gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-400">Upload Payment Screenshot</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    After making the payment, take a screenshot of the confirmation and upload it below to complete your registration.
                  </p>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-300">
                Payment Screenshot <span className="text-red-400">*</span>
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
                  <div className="w-full bg-gray-900/50 border-2 border-dashed border-gray-700/50 rounded-xl p-6 sm:p-8 hover:border-yellow-500/50 hover:bg-gray-900/70 transition-all duration-300 flex flex-col items-center justify-center group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-yellow-500/10 transition-colors">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      Click to upload screenshot
                    </span>
                    <span className="text-xs text-gray-500 mt-1">Max 5MB (JPG, PNG)</span>
                  </div>
                </label>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-gray-800/50 bg-gray-900/50">
                    <Image
                      src={proofPreviewUrl}
                      alt="Payment Proof Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label htmlFor="paymentProofUpload" className="cursor-pointer flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/50 text-white text-xs sm:text-sm"
                        disabled={isUploading || isSubmitting}
                      >
                        Change Image
                      </Button>
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                      disabled={isUploading || isSubmitting}
                      className="flex-1 bg-red-950/20 border-red-900/50 hover:bg-red-950/30 text-red-400 text-xs sm:text-sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Success Message */}
            <div className="flex items-start gap-2 sm:gap-3 bg-green-950/20 border border-green-500/20 rounded-xl p-3 sm:p-4">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-400 leading-relaxed">
                Your payment will be verified by the event organizer after submission.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-gray-900/50 border-gray-700/50 hover:bg-gray-800/50 text-white text-sm sm:text-base"
                disabled={isUploading || isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmitProof}
                disabled={!proofImage || isUploading || isSubmitting}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </Button>
            </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* QR Code Zoom Modal */}
      {showQRZoom && qrCodeUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowQRZoom(false)}
        >
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setShowQRZoom(false)}
              className="absolute -top-10 sm:-top-12 right-0 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl mx-2 sm:mx-0">
              <div className="relative w-full aspect-square max-w-xs sm:max-w-md mx-auto">
                <Image
                  src={qrCodeUrl}
                  alt="Payment QR Code - Full Size"
                  fill
                  className="object-contain rounded-xl sm:rounded-2xl"
                />
              </div>
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                Scan this QR code with your payment app
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentProofModal;


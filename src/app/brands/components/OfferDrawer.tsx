'use client';

import { useEffect } from 'react';
import { X, ExternalLink, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface OfferDrawerProps {
  offer: any;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferDrawer({ offer, isOpen, onClose }: OfferDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!offer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-900">
                    <Image
                      src={offer.logo}
                      alt={offer.brandName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{offer.brandName}</h2>
                    <Badge variant="outline" className="mt-1 border-gray-700 text-gray-400">
                      {offer.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Offer Badge */}
              <div className="mb-6">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-sm px-3 py-1">
                  {offer.offerBadge}
                </Badge>
              </div>

              {/* Offer Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Offer</h3>
                <p className="text-gray-300">{offer.offerDescription}</p>
              </div>

              {/* About */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-gray-300">{offer.about}</p>
              </div>

              {/* Eligibility */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  Eligibility
                </h3>
                <p className="text-gray-300">{offer.eligibility}</p>
              </div>

              {/* Terms */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Terms & Conditions</h3>
                <p className="text-gray-300 text-sm">{offer.terms}</p>
              </div>

              {/* Validity */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Validity</h3>
                <p className="text-gray-300">{offer.expiry}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3 sticky bottom-0 bg-gray-950 pt-4 border-t border-gray-800">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold">
                  <Check className="h-4 w-4 mr-2" />
                  Claim Offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(offer.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
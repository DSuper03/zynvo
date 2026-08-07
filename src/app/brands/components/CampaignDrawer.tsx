'use client';

import { useEffect, useState } from 'react';
import { X, ExternalLink, MapPin, Users, Calendar, Building2, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface CampaignDrawerProps {
  campaign: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDrawer({ campaign, isOpen, onClose }: CampaignDrawerProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

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

  if (!campaign) return null;

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
                      src={campaign.logo}
                      alt={campaign.brand}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{campaign.campaignName}</h2>
                    <p className="text-sm text-gray-400">{campaign.brand}</p>
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

              {/* Campaign Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Campaign</h3>
                <p className="text-gray-300 mb-4">{campaign.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4 text-yellow-400" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="h-4 w-4 text-yellow-400" />
                    <span>{campaign.expectedAudience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Cities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Cities</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.cities.map((city: string) => (
                    <Badge key={city} variant="outline" className="border-gray-700 text-gray-300">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Preferred Events */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Preferred Events</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.preferredEvents.map((event: string) => (
                    <Badge key={event} variant="outline" className="border-gray-700 text-gray-300">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Brand Provides */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-yellow-400" />
                  Brand Provides
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(campaign.brandProvides).map(([key, value]) => {
                    if (value === true) {
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          <span className="capitalize">{key}</span>
                        </div>
                      );
                    }
                    if (typeof value === 'string' && value) {
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-green-400" />
                          <span>{value}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Brand Expects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Brand Expects</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(campaign.brandExpects).map(([key, value]) => {
                    if (value === true) {
                      return (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="h-4 w-4 rounded-full border-2 border-yellow-400" />
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* About Brand */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">About Brand</h3>
                <p className="text-gray-300 text-sm">{campaign.about}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3 sticky bottom-0 bg-gray-950 pt-4 border-t border-gray-800">
                <Button 
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                  onClick={() => setShowComingSoon(true)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply for Partnership
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(campaign.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Dialog */}
          <AnimatePresence>
            {showComingSoon && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setShowComingSoon(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-md mx-4"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-gray-400 mb-6">
                      Direct partnership applications will be available soon. For now, please visit the brand website to get in touch.
                    </p>
                    <Button
                      onClick={() => setShowComingSoon(false)}
                      className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold"
                    >
                      Got it
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
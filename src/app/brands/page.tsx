'use client';

import { useState, useEffect } from 'react';
import { Search, Sparkles, Building2, X } from 'lucide-react';
import { brandOffers, campaigns, BRAND_CATEGORIES, CAMPAIGN_CATEGORIES } from '@/data/brands';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { OfferDrawer } from './components/OfferDrawer';
import { CampaignDrawer } from './components/CampaignDrawer';

type TabType = 'offers' | 'campaigns';

export default function BrandsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('offers');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOffer, setSelectedOffer] = useState<typeof brandOffers[0] | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaigns[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter offers
  const filteredOffers = brandOffers.filter((offer) => {
    const matchesSearch = 
      offer.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.offerDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = 
      campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      campaign.contributionType.some(type => 
        CAMPAIGN_CATEGORIES.includes(type as any) || type.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Brands</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Discover exclusive student offers and brand partnerships
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
          <button
            onClick={() => {
              setActiveTab('offers');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'offers'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Reach Students
          </button>
          <button
            onClick={() => {
              setActiveTab('campaigns');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'campaigns'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Partner with Events
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder={activeTab === 'offers' ? 'Search brands...' : 'Search campaigns...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-yellow-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              All
            </button>
            {(activeTab === 'offers' ? BRAND_CATEGORIES : CAMPAIGN_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'offers' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <OfferCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <CampaignCardSkeleton key={i} />
                  ))}
                </div>
              )}
            </motion.div>
          ) : activeTab === 'offers' ? (
            <motion.div
              key="offers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {filteredOffers.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No offers found matching your criteria</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 text-yellow-400 hover:text-yellow-300"
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onClick={() => setSelectedOffer(offer)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No campaigns found matching your criteria</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 text-yellow-400 hover:text-yellow-300"
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onClick={() => setSelectedCampaign(campaign)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drawers */}
        <OfferDrawer
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
        <CampaignDrawer
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      </div>
    </div>
  );
}

function OfferCard({ offer, onClick }: { offer: typeof brandOffers[0]; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
          <Image
            src={offer.logo}
            alt={offer.brandName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{offer.brandName}</h3>
          <Badge variant="outline" className="text-xs mt-1 border-gray-700 text-gray-400">
            {offer.category}
          </Badge>
        </div>
      </div>
      
      <div className="mb-3">
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs mb-2">
          {offer.offerBadge}
        </Badge>
        <p className="text-sm text-gray-300 line-clamp-2">{offer.offerDescription}</p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Valid: {offer.expiry}</span>
        <span className="text-yellow-400 font-medium">Claim Offer →</span>
      </div>
    </motion.button>
  );
}

function CampaignCard({ campaign, onClick }: { campaign: typeof campaigns[0]; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-yellow-500/50 hover:bg-gray-800/50 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
          <Image
            src={campaign.logo}
            alt={campaign.brand}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-white">{campaign.campaignName}</h3>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs whitespace-nowrap">
              Apply
            </Badge>
          </div>
          <p className="text-sm text-gray-400 mb-2">{campaign.brand}</p>
          <p className="text-sm text-gray-300 line-clamp-2 mb-3">{campaign.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {campaign.contributionType.slice(0, 3).map((type) => (
              <Badge key={type} variant="outline" className="text-xs border-gray-700 text-gray-400">
                {type}
              </Badge>
            ))}
            {campaign.contributionType.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                +{campaign.contributionType.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{campaign.location}</span>
            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function OfferCardSkeleton() {
  return (
    <div className="w-full p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-lg bg-gray-800" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-gray-800" />
          <Skeleton className="h-4 w-1/2 bg-gray-800" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton className="h-5 w-1/3 bg-gray-800" />
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-2/3 bg-gray-800" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/3 bg-gray-800" />
        <Skeleton className="h-4 w-1/4 bg-gray-800" />
      </div>
    </div>
  );
}

function CampaignCardSkeleton() {
  return (
    <div className="w-full p-4 rounded-xl border border-gray-800 bg-gray-900/50">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-lg bg-gray-800" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-1/2 bg-gray-800" />
            <Skeleton className="h-5 w-16 bg-gray-800" />
          </div>
          <Skeleton className="h-4 w-1/3 bg-gray-800" />
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-2/3 bg-gray-800" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 bg-gray-800" />
            <Skeleton className="h-5 w-20 bg-gray-800" />
            <Skeleton className="h-5 w-20 bg-gray-800" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3 bg-gray-800" />
            <Skeleton className="h-4 w-1/4 bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
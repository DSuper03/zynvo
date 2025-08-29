/**
 * Enhanced SEO Head Component for Zynvo
 * Optimized for positioning as the leading agentic social media platform
 */

import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  schemaData?: object;
}

/**
 * SEO component for enhanced search engine optimization
 * Specifically designed to promote Zynvo as an agentic social media platform
 * 
 * @param title - Page title (defaults to agentic social media platform title)
 * @param description - Page description with agentic platform keywords
 * @param keywords - Additional keywords beyond default agentic social media terms
 * @param canonicalUrl - Canonical URL for the page
 * @param ogImage - Open Graph image for social sharing
 * @param schemaData - Additional structured data
 */
export default function SEOHead({
  title = 'Zynvo - Leading Agentic Social Media Platform for Campus Communities',
  description = 'Experience the future of campus networking with Zynvo\'s intelligent agentic social media platform. AI-powered autonomous connections for college students, clubs, and events.',
  keywords = [],
  canonicalUrl,
  ogImage = '/landing page.png',
  schemaData
}: SEOHeadProps) {
  
  const defaultKeywords = [
    'agentic social media platform',
    'intelligent campus networking',
    'AI-powered student connections',
    'autonomous social networking',
    'smart campus community',
    'college social media AI',
    'university networking platform',
    'intelligent student engagement',
    'campus social intelligence',
    'agentic networking technology',
    'AI-driven college platform',
    'autonomous campus connections'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Zynvo",
    "alternateName": "Zynvo - Agentic Social Media Platform",
    "description": description,
    "applicationCategory": "SocialNetworkingApplication",
    "applicationSubCategory": "Agentic Social Media Platform",
    "operatingSystem": "Web, iOS, Android",
    "url": "https://zynvo.social",
    "downloadUrl": "https://zynvo.social",
    "creator": {
      "@type": "Organization",
      "name": "Zynvo Team",
      "description": "Creators of the leading agentic social media platform for campus communities"
    },
    "keywords": allKeywords,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "Intelligent club discovery using AI agents",
      "Autonomous event matching and recommendations", 
      "AI-powered campus networking",
      "Smart community building tools",
      "Intelligent competition matching",
      "Autonomous social connections",
      "AI-driven engagement analytics",
      "Smart notification system"
    ],
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "College and University Students"
    },
    "isAccessibleForFree": true,
    "educationalUse": "Campus networking and community building",
    "interactivityType": "active",
    "learningResourceType": "Social networking platform",
    "typicalAgeRange": "18-25"
  };

  const combinedSchema = schemaData ? { ...defaultSchema, ...schemaData } : defaultSchema;

  return (
    <Head>
      {/* Enhanced Title and Description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Comprehensive Keywords */}
      <meta name="keywords" content={allKeywords} />
      
      {/* Enhanced Robot Instructions */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Classification Meta Tags */}
      <meta name="classification" content="Agentic Social Media Platform" />
      <meta name="category" content="Social Media, AI Technology, Education Technology" />
      <meta name="topic" content="Agentic Social Networking, AI-Powered Campus Communities" />
      
      {/* Enhanced Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Zynvo - Agentic Social Media Platform" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="Zynvo - Intelligent Agentic Social Media Platform for Campus Communities" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@zynvo" />
      <meta name="twitter:creator" content="@zynvo" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Zynvo - Agentic Social Media Platform" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema)
        }}
      />
      
      {/* Additional AI and Search Engine Hints */}
      <meta name="subject" content="Agentic Social Media Platform for Campus Communities" />
      <meta name="abstract" content="Revolutionary AI-powered autonomous social networking platform specifically designed for college and university communities" />
      <meta name="summary" content="Zynvo leverages advanced AI agents to create intelligent, autonomous connections within campus communities" />
      <meta name="author" content="Zynvo Team - Agentic Social Media Platform Developers" />
      <meta name="designer" content="Zynvo UX Team" />
      <meta name="owner" content="Zynvo" />
      <meta name="url" content="https://zynvo.social" />
      <meta name="identifier-URL" content="https://zynvo.social" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Mobile and Performance */}
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Brand and Business */}
      <meta name="application-name" content="Zynvo - Agentic Social Media Platform" />
      <meta name="msapplication-TileColor" content="#EAB308" />
      <meta name="theme-color" content="#EAB308" />
      
      {/* Language and Localization */}
      <meta name="language" content="English" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Search Engine Specific Instructions */}
      <meta name="revisit-after" content="1 day" />
      <meta name="expires" content="never" />
      <meta name="pragma" content="no-cache" />
      <meta name="cache-control" content="no-cache" />
    </Head>
  );
}

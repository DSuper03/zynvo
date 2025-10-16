const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://i.pinimg.com https://images.unsplash.com https://source.unsplash.com https://i.pravatar.cc https://ik.imagekit.io https://api.dicebear.com https://example.com;
      connect-src 'self' data: https://backend.zynvo.social https://upload.imagekit.io https://zynvo-backend-ho7y.onrender.com https://zynvo-backend-1.onrender.com https://zynvo-backend-2.onrender.com https://zynvo-backend-3.onrender.com https://zynvo-backend-4.onrender.com https://zynvo-backend-5.onrender.com https://zynvo-backend-6.onrender.com https://zynvo-backend-7.onrender.com https://zynvo-backend-8.onrender.com https://zynvo-backend-9.onrender.com https://zynvo-backend-10.onrender.com https://zynvo-backend-11.onrender.com https://zynvo-backend-12.onrender.com https://zynvo-backend-13.onrender.com https://zynvo-backend-14.onrender.com https://zynvo-backend-15.onrender.com https://zynvo-backend-16.onrender.com https://zynvo-backend-17.onrender.com https://zynvo-backend-18.onrender.com https://zynvo-backend-19.onrender.com https://zynvo-backend-20.onrender.com https://zynvo-backend-21.onrender.com https://zynvo-backend-22.onrender.com https://zynvo-backend-23.onrender.com https://zynvo-backend-24.onrender.com https://zynvo-backend-25.onrender.com https://zynvo-backend-26.onrender.com https://zynvo-backend-27.onrender.com https://zynvo-backend-28.onrender.com https://zynvo-backend-29.onrender.com https://zynvo-backend-30.onrender.com https://zynvo-backend-31.onrender.com https://zynvo-backend-32.onrender.com https://zynvo-backend-33.onrender.com https://zynvo-backend-34.onrender.com https://zynvo-backend-35.onrender.com https://zynvo-backend-36.onrender.com https://zynvo-backend-37.onrender.com https://zynvo-backend-38.onrender.com https://zynvo-backend-39.onrender.com https://zynvo-backend-40.onrender.com https://zynvo-backend-41.onrender.com https://zynvo-backend-42.onrender.com https://zynvo-backend-43.onrender.com https://zynvo-backend-44.onrender.com https://zynvo-backend-45.onrender.com https://zynvo-backend-46.onrender.com https://zynvo-backend-47.onrender.com https://zynvo-backend-48.onrender.com https://zynvo-backend-49.onrender.com https://zynvo-backend-50.onrender.com https://zynvo-backend-51.onrender.com https://zynvo-backend-52.onrender.com https://zynvo-backend-53.onrender.com https://zynvo-backend-54.onrender.com https://zynvo-backend-55.onrender.com https://zynvo-backend-56.onrender.com https://zynvo-backend-57.onrender.com https://zynvo-backend-58.onrender.com https://zynvo-backend-59.onrender.com https://zynvo-backend-60.onrender.com https://zynvo-backend-61.onrender.com https://zynvo-backend-62.onrender.com https://zynvo-backend-63.onrender.com https://zynvo-backend-64.onrender.com https://zynvo-backend-65.onrender.com https://zynvo-backend-66.onrender.com https://zynvo-backend-67.onrender.com https://zynvo-backend-68.onrender.com https://zynvo-backend-69.onrender.com https://zynvo-backend-70.onrender.com https://zynvo-backend-71.onrender.com https://zynvo-backend-72.onrender.com https://zynvo-backend-73.onrender.com https://zynvo-backend-74.onrender.com https://zynvo-backend-75.onrender.com https://zynvo-backend-76.onrender.com https://zynvo-backend-77.onrender.com https://zynvo-backend-78.onrender.com https://zynvo-backend-79.onrender.com https://zynvo-backend-80.onrender.com https://zynvo-backend-81.onrender.com https://zynvo-backend-82.onrender.com https://zynvo-backend-83.onrender.com https://zynvo-backend-84.onrender.com https://zynvo-backend-85.onrender.com https://zynvo-backend-86.onrender.com https://zynvo-backend-87.onrender.com https://zynvo-backend-88.onrender.com https://zynvo-backend-89.onrender.com https://zynvo-backend-90.onrender.com https://zynvo-backend-91.onrender.com https://zynvo-backend-92.onrender.com https://zynvo-backend-93.onrender.com https://zynvo-backend-94.onrender.com https://zynvo-backend-95.onrender.com https://zynvo-backend-96.onrender.com https://zynvo-backend-97.onrender.com https://zynvo-backend-98.onrender.com https://zynvo-backend-99.onrender.com https://zynvo-backend-100.onrender.com https://zynvo-backend-101.onrender.com https://zynvo-backend-102.onrender.com https://zynvo-backend-103.onrender.com https://zynvo-backend-104.onrender.com https://zynvo-backend-105.onrender.com https://zynvo-backend-106.onrender.com https://zynvo-backend-107.onrender.com https://zynvo-backend-108.onrender.com https://zynvo-backend-109.onrender.com https://zynvo-backend-110.onrender.com https://zynvo-backend-111.onrender.com https://zynvo-backend-112.onrender.com https://zynvo-backend-113.onrender.com https://zynvo-backend-114.onrender.com https://zynvo-backend-115.onrender.com https://zynvo-backend-116.onrender.com https://zynvo-backend-117.onrender.com https://zynvo-backend-118.onrender.com https://zynvo-backend-119.onrender.com
      font-src 'self' data:;
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://zynvo-backend-1.onrender.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Platform-Type',
            value: 'Agentic Social Media Platform',
          },
          {
            key: 'X-Platform-Name',
            value: 'Zynvo',
          },
          {
            key: 'X-Platform-Category',
            value: 'AI-Powered Campus Networking',
          },
          {
            key: 'X-Content-Classification',
            value: 'Intelligent Social Media Platform',
          },
          ...securityHeaders,
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/campus-social-media',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ai-social-platform',
        destination: '/',
        permanent: true,
      },
      {
        source: '/intelligent-networking',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

// Apply PWA configuration
const pwaConfig = withPWA({
  dest: "public",         // destination directory for the PWA files
  disable: false,        // enable PWA in all environments
  register: true,         // register the PWA service worker
  skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);

// Apply bundle analyzer and export
export default withBundleAnalyzer(pwaConfig);

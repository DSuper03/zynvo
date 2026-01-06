const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://i.pinimg.com https://images.unsplash.com https://source.unsplash.com https://i.pravatar.cc https://ik.imagekit.io https://api.dicebear.com https://example.com https://api.qrserver.com;
      connect-src 'self' data: http://localhost:* https://backend.zynvo.social https://upload.imagekit.io https://zynvo-backend-ho7y.onrender.com https://zynvo-backend-1.onrender.com https://zynvo-backend.onrender.com https://api.dicebear.com https://api.qrserver.com;
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
      },{
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  reactStrictMode: true,
  // swcMinify is enabled by default in Next.js 15
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    // optimizeCss requires critters package - disabled for now
    optimizeCss: false,
  },
  
  // Performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // Tree-shake icon libraries for smaller bundles
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@tabler/icons-react': {
      transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
    },
    'react-icons/?(((\\w*)?/?)*)': {
      transform: 'react-icons/{{ matches.[1] }}/{{ member }}',
    },
  },
  
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Webpack optimizations for better bundle splitting
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (React, Next.js)
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI libraries chunk
            ui: {
              name: 'ui',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
              priority: 30,
            },
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  
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

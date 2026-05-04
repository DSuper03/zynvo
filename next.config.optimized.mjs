import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://eager-bonefish-30.clerk.accounts.dev https://clerk.accounts.dev https://clerk.com https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://i.pinimg.com https://images.unsplash.com https://source.unsplash.com https://i.pravatar.cc https://ik.imagekit.io https://api.dicebear.com https://example.com https://api.qrserver.com https://img.clerk.com;
      connect-src 'self' data: http://localhost:* https://backend.zynvo.social https://upload.imagekit.io https://zynvo-backend-ho7y.onrender.com https://zynvo-backend-1.onrender.com https://zynvo-backend.onrender.com https://api.dicebear.com https://api.qrserver.com https://eager-bonefish-30.clerk.accounts.dev https://clerk.accounts.dev https://clerk.com;
      font-src 'self' data:;
      frame-src 'self' https://eager-bonefish-30.clerk.accounts.dev https://clerk.accounts.dev https://clerk.com https://challenges.cloudflare.com;
      worker-src 'self' blob:;
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Performance optimizations
  swcMinify: true,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
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
            enforce: true,
          },
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
        },
      };
    }

    return config;
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
      // Static assets caching
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
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

export default withBundleAnalyzer(nextConfig);
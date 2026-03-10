import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
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

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Next 16 uses Turbopack by default
  turbopack: {},
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
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
    externalDir: true,
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  // FIXED: Removed react-icons from here to stop the module resolution error
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
    '@tabler/icons-react': {
      transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
    },
  },
  
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            ui: {
              name: 'ui',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
              priority: 30,
            },
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
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

const pwaConfig = withPWA({
  dest: "public",
  disable: false,
  register: true,
  skipWaiting: true,
})(nextConfig);

export default withBundleAnalyzer(pwaConfig);
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https://i.pinimg.com https://images.unsplash.com https://source.unsplash.com https://i.pravatar.cc https://ik.imagekit.io https://via.placeholder.com https://api.dicebear.com https://example.com;
      connect-src 'self' https://backend.zynvo.social;
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
        hostname: 'via.placeholder.com',
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
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
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

export default nextConfig;

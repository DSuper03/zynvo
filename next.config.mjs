/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['source.unsplash.com'],
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

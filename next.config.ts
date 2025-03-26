import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'randomuser.me', 'plus.unsplash.com'],
    formats: ['image/avif', 'image/webp']
  }
};

export default nextConfig;

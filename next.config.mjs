/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['source.unsplash.com'],
    },
    reactStrictMode: false,
    eslint : {
        ignoreDuringBuilds : true
    }
};

export default nextConfig;

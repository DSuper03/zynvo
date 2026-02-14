import bundleAnalyzer from "@next/bundle-analyzer";
import withPWA from "next-pwa";

/* ---------------- SECURITY HEADERS ---------------- */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline'
        https://eager-bonefish-30.clerk.accounts.dev
        https://clerk.accounts.dev
        https://clerk.com
        https://challenges.cloudflare.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:
        https://i.pinimg.com
        https://images.unsplash.com
        https://source.unsplash.com
        https://i.pravatar.cc
        https://ik.imagekit.io
        https://api.dicebear.com
        https://api.qrserver.com
        https://img.clerk.com;
      connect-src 'self' data:
        http://localhost:*
        https://backend.zynvo.social
        https://upload.imagekit.io
        https://zynvo-backend.onrender.com
        https://zynvo-backend-1.onrender.com
        https://api.dicebear.com
        https://api.qrserver.com
        https://clerk.accounts.dev;
      font-src 'self' data:;
      frame-src 'self'
        https://clerk.accounts.dev
        https://challenges.cloudflare.com;
      worker-src 'self' blob:;
    `.replace(/\s{2,}/g, " ").trim(),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

/* ---------------- BUNDLE ANALYZER ---------------- */
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/* ---------------- NEXT CONFIG ---------------- */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },

  experimental: {
    externalDir: true,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
    modularizeImports: {
      "lucide-react": {
        transform: "lucide-react/icons/{{member}}",
      },
      "@tabler/icons-react": {
        transform: "@tabler/icons-react/{{member}}",
      },
      "react-icons": {
        transform: "react-icons/{{member}}",
      },
    },
  },

  /** ✅ Webpack-only optimizations (NO Turbopack) */
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "framework",
            priority: 40,
            enforce: true,
          },
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|framer-motion|@radix-ui)[\\/]/,
            name: "ui",
            priority: 30,
          },
          vendor: {
            test: /node_modules/,
            name: "vendor",
            priority: 20,
          },
        },
      };
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/proxy/:path*",
        destination: "https://zynvo-backend-1.onrender.com/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Platform-Name", value: "Zynvo" },
          { key: "X-Platform-Type", value: "Agentic Social Platform" },
          ...securityHeaders,
        ],
      },
    ];
  },
};

/* ---------------- PWA ---------------- */
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);

export default withBundleAnalyzer(pwaConfig);

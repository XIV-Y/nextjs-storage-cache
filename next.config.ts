import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://jsonplaceholder.typicode.com/:path*',
      },
    ];
  },
};

export default nextConfig;

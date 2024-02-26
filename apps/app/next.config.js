/** @type {import('next').NextConfig} */
export default {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // ignoreBuildErrors: true,
  },
};

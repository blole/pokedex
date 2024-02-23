/** @type {import('next').NextConfig} */
export default {
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

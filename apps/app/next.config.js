/** @type {import('next').NextConfig} */
export default {
  assetPrefix: '/pokedex/',
  basePath: '/pokedex',
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

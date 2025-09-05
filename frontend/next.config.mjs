/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fungamess.games',
      },
      {
        protocol: 'https',
        hostname: 'sweepmobi.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'media.tenor.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.alea.com',
      },
      {
        protocol: 'https',
        hostname: 'mstatic-staging.mrslotty.com',
      },
      {
        protocol: 'https',
        hostname: 'mstatic-staging.1gamehub.com',
      },
      {
        protocol: 'https',
        hostname: 'mstatic-ire1.2omega.online',
      },
      {
        protocol: 'https',
        hostname: 'mstatic-ire1.1gamehub.com',
      },
    ],
  },
  output: 'standalone',
  compress: true,
};

export default nextConfig;

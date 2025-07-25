/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  images: {
    domains: [
      'fungamess.games',
      'sweepmobi.s3.us-east-1.amazonaws.com',
      'github.com',
      'media.tenor.com',
      'thumbs.alea.com',
      'mstatic-staging.mrslotty.com',
      'mstatic-staging.1gamehub.com'
    ],
  },
  output: 'standalone',
  compress: true,
};

export default nextConfig;

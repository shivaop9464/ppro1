/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: true
  },
  // Configure Next.js to use the .next directory for build output
  distDir: '.next',
};

export default nextConfig;
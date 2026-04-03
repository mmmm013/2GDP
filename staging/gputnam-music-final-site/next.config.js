/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  // Prevent workspace-root confusion when the monorepo has multiple lockfiles
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;

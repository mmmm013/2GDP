import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: repoRoot,
    excludes: [
      '**/gputnam-music-final-site/**',
      '**/2GDP/**',
      '**/Global-Warehouse/**',
      '**/.next/**',
      '**/node_modules/**',
    ],
  },
};
export default nextConfig;

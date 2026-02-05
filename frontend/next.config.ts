import type { NextConfig } from "next";
import dotenv from 'dotenv';
import path from 'path';

// Load .env from repository root (parent of frontend directory)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const nextConfig: NextConfig = {
  // Transpile LI.FI packages for Next.js compatibility
  transpilePackages: ['@lifi/widget', '@lifi/sdk'],
};

export default nextConfig;

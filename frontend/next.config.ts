// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true, // было experimental.typedRoutes
  output: "standalone", // для Docker
  eslint: { ignoreDuringBuilds: true }, // временно отключим, пока настраиваем ESLint
};

export default nextConfig;

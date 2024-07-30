/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
};

module.exports = nextConfig;

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    })
    return config
  },
  transpilePackages: ["@codegouvfr/react-dsfr"],
  turbopack: {},
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
}

export default nextConfig

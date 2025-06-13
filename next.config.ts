import helmet from "helmet"
import type { NextConfig } from "next"

const csp: Record<string, string[]> = {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
}

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
    serverActions: { bodySizeLimit: "2mb" },
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Content-Security-Policy",
          value: Object.keys(csp)
            .map((key) => `${key} ${csp[key].join(" ")}`)
            .join(";"),
        },
      ],
    },
  ],
}

export default nextConfig

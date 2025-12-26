import helmet from "helmet"
import type { NextConfig } from "next"

const csp = {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  "default-src": ["'none'"],
  "img-src": ["'self'", "data:"],
  "connect-src": ["'self'", process.env.NEXT_PUBLIC_MATOMO_SITE_URL, "https://quefairedemesdechets.ademe.fr"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    `${process.env.NEXT_PUBLIC_MATOMO_SITE_URL}/matomo.js`,
    "https://quefairedemesdechets.ademe.fr/infotri/configurateur.js",
  ],
  "frame-src": ["https://quefairedemesdechets.ademe.fr"],
}

if (process.env.NODE_ENV === "development") {
  csp["script-src"].push("'unsafe-eval'")
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
          value: Object.entries(csp)
            .map(([key, value]) => `${key} ${value.join(" ")}`)
            .join(";"),
        },
      ],
    },
  ],
}

export default nextConfig

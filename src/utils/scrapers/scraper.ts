import axios from "axios"
import { ScraperConfig, scrappersConfig } from "./config"
import { JSDOM } from "jsdom"

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

const scrape = async (url: string, config: ScraperConfig) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Cache-Control": "max-age=0",
        ...config.headers,
      },
      timeout: 15000,
      validateStatus: () => true,
    })

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const dom = new JSDOM(response.data)
    const document = dom.window.document

    return config.getProduct(document, url)
  } catch (error) {
    throw new Error(`Failed to scrape ${config.name}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const scrapeProduct = async (url: string) => {
  const urlObj = new URL(url)
  const hostname = urlObj.hostname.toLowerCase()

  const config = scrappersConfig.find((cfg) => cfg.urlPattern.test(hostname))
  if (!config) {
    throw new Error(
      `No scraper configuration found for domain: ${hostname}. Supported domains: ${scrappersConfig.map((cfg) => cfg.name).join(", ")}`,
    )
  }

  return scrape(url, config)
}

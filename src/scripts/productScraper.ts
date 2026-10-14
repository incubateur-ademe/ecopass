import { scrappersConfig } from "../utils/scrapers/config"
import { scrapeProduct } from "../utils/scrapers/scraper"

async function main() {
  const url = process.argv[2]

  if (!url) {
    console.error("Usage: tsx scraper.ts <URL>")
    console.error("Example: tsx scraper.ts https://www.primark.com/fr-fr/p/mini-robe-trapeze-991189130626")
    console.error(`\nSupported sites: ${scrappersConfig.map((cfg) => cfg.name).join(", ")}`)
    process.exit(1)
  }

  try {
    console.log(`🔍 Scraping from ${url}...`)

    const productInfo = await scrapeProduct(url)

    console.log("\n✅ Product Information:")
    console.log("=======================")
    console.log(JSON.stringify(productInfo, null, 2))
  } catch (error) {
    console.error(`❌ Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

main()

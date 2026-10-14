import { SimplifiedDeclarationData } from "../../serverFunctions/upload"
import { getPrimarkProduct } from "./primark"

export type ScraperConfig = {
  name: string
  urlPattern: RegExp
  getProduct: (document: Document, url: string) => Partial<SimplifiedDeclarationData>
  headers?: Record<string, string>
}

export const scrappersConfig = [
  {
    name: "Primark",
    urlPattern: /primark\.com/i,
    getProduct: getPrimarkProduct,
    headers: {
      Referer: "https://www.primark.com/",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  },
] as ScraperConfig[]

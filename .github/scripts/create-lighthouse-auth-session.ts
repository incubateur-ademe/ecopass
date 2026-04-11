import { appendFileSync } from "fs"
import { chromium } from "@playwright/test"
import { login } from "../../e2e/utils/login"

const email = process.env.LIGHTHOUSE_LOGIN_EMAIL
const password = process.env.LIGHTHOUSE_LOGIN_PASSWORD

if (!process.env.GITHUB_OUTPUT) {
  throw new Error("GITHUB_OUTPUT is required")
}

if (!email || !password) {
  throw new Error("LIGHTHOUSE_LOGIN_EMAIL and LIGHTHOUSE_LOGIN_PASSWORD are required")
}

async function main() {
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()
    await login(page, email, password)

    const cookies = await page.context().cookies()
    const cookieHeader = cookies.map(({ name, value }) => `${name}=${value}`).join("; ")
    const extraHeaders = JSON.stringify({ Cookie: cookieHeader })

    appendFileSync(process.env.GITHUB_OUTPUT!!, `extraHeaders<<EOF\n${extraHeaders}\nEOF\n`)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

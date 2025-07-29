import fs from "fs"
import crypto from "crypto"

export const decrypt = () => {
  if (!process.env.ECOBALYSE_ENCRYPTION_KEY) {
    throw new Error("No ECOBALYSE_ENCRYPTION_KEY")
  }
  const encryptedContents = JSON.parse(
    fs.readFileSync("./src/utils/ecobalyse/processes_impacts.json.enc").toString("utf-8"),
  )

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ECOBALYSE_ENCRYPTION_KEY),
    Buffer.from(encryptedContents.iv, "hex"),
  )
  fs.writeFileSync(
    "./src/utils/ecobalyse/processes_impacts.json",
    Buffer.concat([decipher.update(Buffer.from(encryptedContents.encrypted, "hex")), decipher.final()]).toString(),
  )
}

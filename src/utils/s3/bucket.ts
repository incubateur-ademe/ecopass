import { S3Client, PutObjectCommand, PutObjectCommandInput, GetObjectCommand } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import fs from "fs"
import path from "path"

const s3 = new S3Client({
  region: "fr-par",
  endpoint: "https://s3.fr-par.scw.cloud",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

export const uploadFileToS3 = async (name: string, file: PutObjectCommandInput["Body"], tag: "export" | "upload") => {
  if (process.env.LOCAL_STORAGE === "true") {
    const dir = path.resolve(process.cwd(), "s3", `${tag}s`)
    const filePath = path.join(dir, name)
    if (Buffer.isBuffer(file)) {
      fs.writeFileSync(filePath, file)
    } else if (typeof file === "string") {
      fs.writeFileSync(filePath, Buffer.from(file))
    } else if (file instanceof Readable) {
      const writeStream = fs.createWriteStream(filePath)
      await new Promise<void>((resolve, reject) => {
        file.pipe(writeStream)
        writeStream.on("finish", resolve)
        writeStream.on("error", reject)
      })
    } else {
      throw new Error("Unsupported file type for local storage")
    }
    return
  }
  return s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${tag}s/${name}`,
      Body: file,
      Tagging: `type=${tag}`,
      ContentType: "application/zip",
    }),
  )
}

export async function downloadFileFromS3(file: string, tag: "export" | "upload") {
  if (process.env.LOCAL_STORAGE === "true") {
    const filePath = path.resolve(process.cwd(), "s3", `${tag}s`, file)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Local file not found: ${filePath}`)
    }
    return fs.readFileSync(filePath)
  }
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${tag}s/${file}`,
  })
  const response = await s3.send(command)
  const stream = response.Body as Readable
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

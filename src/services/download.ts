const download = (data: BlobPart[], filename: string, type: string) => {
  const blob = new Blob(data, { type })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const base64ToUint8Array = (base64: string) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export const downloadFile = (
  data:
    | string
    | {
        mimeType: string
        base64: string
      },
  filename: string,
) => {
  if (typeof data === "string") {
    download([data], filename, "text/csv;charset=utf-8;")
  } else {
    download([base64ToUint8Array(data.base64)], filename, data.mimeType)
  }
}

const download = (data: BlobPart[], filename: string, type: string) => {
  const blob = new Blob(data, { type })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadFile = (data: string | Buffer, filename: string) => {
  if (typeof data === "string") {
    download([data], filename, "text/csv;charset=utf-8;")
  } else {
    download([new Uint8Array(data)], filename, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  }
}

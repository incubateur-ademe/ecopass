export const simplifyValue = (value: string | null) =>
  value
    ? value
        .trim()
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[ \/'-]/g, "")
        .replace(/[éè]/g, "e")
        .replace(/ç/g, "c")
    : ""

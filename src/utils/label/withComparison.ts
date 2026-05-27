import { svgContent, svgStyle, svgTitle } from "./simple"

const getComparisonText = (deltaPercent: number, large: boolean) => {
  const value = Math.abs(Math.round(deltaPercent)).toLocaleString("fr-FR")

  if (large) {
    if (deltaPercent === 0) {
      return "équivalent"
    }

    if (deltaPercent > 0) {
      return `${value}% supérieur`
    }

    return `${value}% inférieur`
  } else {
    if (deltaPercent === 0) {
      return "="
    }

    if (deltaPercent > 0) {
      return `+ ${value}%`
    }

    return `- ${value}%`
  }
}

const getSize = (value: number, large: boolean) => {
  if (large) {
    if (value < -100) {
      return -20
    }

    if (value < -10) {
      return 2
    }

    if (value < 0) {
      return -9
    }

    if (value === 0) {
      return -20
    }

    if (value > 100) {
      return 20
    }

    if (value > 10) {
      return 10
    }
    return 0
  } else {
    const abs = Math.abs(value)
    if (abs > 100) {
      return -45
    }

    if (abs > 10) {
      return -60
    }

    if (abs > 0) {
      return -65
    }

    return -100
  }
}

const getColors = (value: number) => {
  if (value <= -50) {
    return { cursor: "#197B3F", background: "#C9F8DC", text: "#197B3F" }
  }

  if (value <= -25) {
    return { cursor: "#6A6E21", background: "#E4F38E", text: "#6A6E21" }
  }

  if (value < 25) {
    return { cursor: "#ffcc4a", background: "#FFF3C1", text: "#8A6815" }
  }

  if (value < 100) {
    return { cursor: "#FF864A", background: "#FFE5DA", text: "#D8520F" }
  }

  return { cursor: "#CE0500", background: "#FBE0E1", text: "#CE0500" }
}

const valuesByCategory: Record<string, { min: number; max: number; median: number }> = {
  chemise: { min: 180.16, max: 1142.3, median: 441.25 },
  jean: { min: 212.98, max: 904.64, median: 509.62 },
  jupe: { min: 166.43, max: 1814.87, median: 438.67 },
  manteau: { min: 63.64, max: 2158.19, median: 361.11 },
  pantalon: { min: 88.67, max: 1537.76, median: 471.53 },
  pull: { min: 151.46, max: 988.71, median: 394.78 },
  tshirt: { min: 142.03, max: 1183.48, median: 461.84 },
  chaussettes: { min: 172.59, max: 805.12, median: 341.66 },
  calecon: { min: 243.09, max: 1392.11, median: 540.64 },
  slip: { min: 239.37, max: 1200.06, median: 540.74 },
  "maillot-de-bain": { min: 222.63, max: 1009.85, median: 397.06 },
}
export const getEtiquetteSVG = (score: number, standardizedScore: number, category: string, large: boolean) => {
  const deltaPercent = Math.round(
    ((standardizedScore - valuesByCategory[category].median) / valuesByCategory[category].median) * 100,
  )

  const absValue = Math.abs(deltaPercent)
  const comparisonText = getComparisonText(deltaPercent, large)
  const size = getSize(deltaPercent, large)
  const colors = getColors(deltaPercent)

  const yCenter = 60
  const maxSize = yCenter - 4 + 1 - 6

  const gaugeHeight = Math.abs(deltaPercent) > 100 ? maxSize : (absValue / 100) * maxSize

  const backgroundY = deltaPercent > 0 ? yCenter - gaugeHeight : yCenter
  const cursorY =
    deltaPercent === 0 ? backgroundY - 3 - 1 : deltaPercent > 0 ? backgroundY - 6 : backgroundY + gaugeHeight

  const title = `${svgTitle(score, standardizedScore)} ${comparisonText}`
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${large ? 376 : 221} 77" role="img" aria-label="${title}" fill="none">
<title>${title}</title>
  <defs>
    <style>
      ${svgStyle}
    </style>
  </defs>

    ${svgContent(score, standardizedScore)}

  <g transform="translate(-1 0.75) scale(0.619)">
    <path fill="#f6f6f6" d="M249.7,8.14c0-2.7,2.19-4.88,4.88-4.88h21.16v113.96h-21.16c-2.7,0-4.88-2.19-4.88-4.88V8.14Z"/>
    ${large && `<rect fill="none" stroke="#dbdbdb" stroke-width="1.3" x="250.35" y="4" width="356.86" height="112.66" rx="4.23" ry="4.23"/>`}
    <rect x="249.75" y="${yCenter - 1}" width="26" height="2" fill="#dbdbdb" />
    <rect x="249.75" y="${backgroundY}" width="26" height="${gaugeHeight}" fill="${colors.background}" />
    <rect x="249.75" y="${cursorY}" width="26" height="6" fill="${colors.cursor}" />
    ${
      large
        ? `<text fill="#000" font-size="17.72px" font-family="Marianne-Bold, Marianne" font-weight="700" transform="translate(298.68 36.78)">Ce produit a un impact</text>
    <text fill="#000" font-size="17.72px" font-family="Marianne-Bold, Marianne" font-weight="700" transform="translate(${425 + size} 66)">au produit moyen</text>
    <text fill="#000" font-size="17.72px" font-family="Marianne-Bold, Marianne" font-weight="700" transform="translate(298.97 93.94)">de cette catégorie</text>
    <rect fill="${colors.background}" x="299.34" y="47.05" width="${122 + size}" height="25.41" rx="4.3" ry="4.3"/>
    <text fill="${colors.text}" font-size="17.72px" font-family="Marianne-Bold, Marianne" font-weight="700" transform="translate(305.27 66)">${comparisonText}</text>`
        : `<rect fill="${colors.background}" x="280" y="47.05" width="${122 + size}" height="25.41" rx="4.3" ry="4.3"/>
    <text fill="${colors.text}" font-size="17.72px" font-family="Marianne-Bold, Marianne" font-weight="700" transform="translate(286 66)">${comparisonText}</text>`
    }
  </g>
</svg>`
}

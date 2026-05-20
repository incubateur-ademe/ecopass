"use client"

import Button from "@codegouvfr/react-dsfr/Button"
import { getSVG } from "../../utils/label/svg"
import { Score } from "@prisma/client"

const DownloadScore = ({
  score: { score, standardized },
  internalReference,
}: {
  score: Pick<Score, "score" | "standardized">
  internalReference: string
}) => {
  const download = () => {
    const blob = new Blob([getSVG(score, standardized)], {
      type: "image/svg+xml;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${internalReference}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return <Button onClick={download}>Télécharger le SVG</Button>
}

export default DownloadScore

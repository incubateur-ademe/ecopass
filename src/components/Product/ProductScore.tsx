"use client"
import { Score } from "../../../prisma/src/prisma"
import { getSVG } from "../../utils/label/svg"
import Label from "../Label/Label"
import Button from "@codegouvfr/react-dsfr/Button"

const ProductScore = ({
  score: { score, standardized, durability },
  internalReference,
}: {
  score: Pick<Score, "score" | "standardized" | "durability">
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

  return (
    <>
      <p>
        Coût environnemental : <b>{Math.round(score)} points</b>
      </p>
      <p>
        Coût environnemental pour 100g : <b>{Math.round(standardized)} points</b>
      </p>
      {durability > 0 && (
        <p>
          Coefficient de durabilité : <b>{durability}</b>
        </p>
      )}
      <div className='fr-mt-4w'>
        <div className='fr-mb-2w'>
          <Label product={{ score, standardized }} />
        </div>
        <Button onClick={download}>Télécharger le .svg</Button>
      </div>
    </>
  )
}

export default ProductScore

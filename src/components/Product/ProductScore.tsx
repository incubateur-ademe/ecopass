"use client"
import { ProductWithScore } from "../../db/product"
import { getSVG } from "../../utils/label/svg"
import Label from "../Label/Label"
import Button from "@codegouvfr/react-dsfr/Button"

const ProductScore = ({
  score,
  internalReference,
}: {
  score: NonNullable<ProductWithScore["score"]>
  internalReference: string
}) => {
  const download = () => {
    const blob = new Blob([getSVG(score?.score, score?.standardized)], {
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
        Coût environnemental : <b>{Math.round(score!.score)} points</b>
      </p>
      <p>
        Coût environnemental pour 100g : <b>{Math.round(score!.standardized)} points</b>
      </p>
      {score.durability > 0 && (
        <p>
          Indice de durabilité : <b>{score.durability}</b>
        </p>
      )}
      <div className='fr-mt-4w'>
        <div className='fr-mb-2w'>
          <Label product={score} />
        </div>
        <Button onClick={download}>Télécharger le .svg</Button>
      </div>
    </>
  )
}

export default ProductScore

"use client"

import { ProductWithScore } from "../../db/product"
import Label from "../Label/LabelSVG"
import Button from "@codegouvfr/react-dsfr/Button"
import { useRef } from "react"

const ProductScore = ({ product }: { product: ProductWithScore }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const download = () => {
    if (!svgRef.current) return
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style")
    style.textContent = `@font-face {
      font-family: 'Marianne';
      src: url('data:font/woff2;base64,...') format('woff2');
    }`
    clone.insertBefore(style, clone.firstChild)
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(clone)
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${product.gtin}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <p>
        Coût environnemental : <b>{Math.round(product.score!.score)} points</b>
      </p>
      <p>
        Coût environnemental pour 100g : <b>{Math.round(product.score!.standardized)} points</b>
      </p>
      <div className='fr-mt-4w'>
        <div className='fr-mb-2w'>
          <Label product={product.score!} ref={svgRef} />
        </div>
        <Button onClick={download}>Télécharger le .svg</Button>
      </div>
    </>
  )
}

export default ProductScore

"use client"

import { useState } from "react"
import { Select } from "@codegouvfr/react-dsfr/Select"
import ConverterImpactsTable from "../components/Converter/ConverterImpactsTable"
import ConverterGtinForm from "../components/Converter/ConverterGtinForm"
import Block from "../components/Block/Block"
import styles from "./Converter.module.css"
import { ProductWithScore } from "../db/product"

const Converter = ({ product, gtin }: { product: ProductWithScore | null; gtin?: string }) => {
  const [mode, setMode] = useState(product ? "gtin" : "impacts")
  const [impactData, setImpactData] = useState<Partial<Record<string, number>> | null>(
    product
      ? {
          acd: product.meanScores.acd,
          cch: product.meanScores.cch,
          etf: product.meanScores.etf,
          fru: product.meanScores.fru,
          fwe: product.meanScores.fwe,
          ior: product.meanScores.ior,
          ldu: product.meanScores.ldu,
          mru: product.meanScores.mru,
          ozd: product.meanScores.ozd,
          pco: product.meanScores.pco,
          pma: product.meanScores.pma,
          swe: product.meanScores.swe,
          tre: product.meanScores.tre,
          wtu: product.meanScores.wtu,
          microfibers: product.meanScores.microfibers,
          outOfEuropeEOL: product.meanScores.outOfEuropeEOL,
        }
      : null,
  )

  const handleImpactsSubmit = (impacts: Partial<Record<string, number>>) => {
    setImpactData(impacts)
  }

  return (
    <Block>
      <h1>Convertisseur d'impacts</h1>
      <p>
        Calculez l'impact pondéré d'un produit en entrant son GTIN, ou visualisez le tableau avec l'impact pondéré en
        entrée des valeurs d'impacts bruts.
      </p>

      <div className={styles.modeSelector}>
        <Select
          label="Mode d'entrée"
          nativeSelectProps={{
            value: mode,
            onChange: (e) => setMode(e.currentTarget.value),
          }}>
          <option value='gtin'>Rechercher par GTIN</option>
          <option value='impacts'>Entrer les impacts manuellement</option>
        </Select>
      </div>

      {mode === "gtin" ? (
        <ConverterGtinForm initialGtin={gtin} />
      ) : (
        <div className={styles.section}>
          <h2>Entrer les impacts</h2>
          <ConverterImpactsTable onSubmit={handleImpactsSubmit} />
        </div>
      )}

      {impactData && mode === "gtin" && (
        <>
          <h2>Résultats</h2>
          <ConverterImpactsTable results={impactData} readOnly />
        </>
      )}
    </Block>
  )
}

export default Converter

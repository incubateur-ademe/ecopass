import { ProductWithScore } from "../../db/product"

export const computeBatchScore = (product: Pick<ProductWithScore, "informations" | "score" | "standardized">) => {
  const scores = product.informations.reduce(
    (acc, value) => {
      if (value.score) {
        return {
          scoreWithoutDurability: acc.scoreWithoutDurability + value.score.score * value.score.durability,
          acd: acc.acd + value.score.acd,
          cch: acc.cch + value.score.cch,
          etf: acc.etf + value.score.etf,
          fru: acc.fru + value.score.fru,
          fwe: acc.fwe + value.score.fwe,
          ior: acc.ior + value.score.ior,
          ldu: acc.ldu + value.score.ldu,
          microfibers: acc.microfibers + value.score.microfibers,
          mru: acc.mru + value.score.mru,
          outOfEuropeEOL: acc.outOfEuropeEOL + value.score.outOfEuropeEOL,
          ozd: acc.ozd + value.score.ozd,
          pco: acc.pco + value.score.pco,
          pma: acc.pma + value.score.pma,
          swe: acc.swe + value.score.swe,
          tre: acc.tre + value.score.tre,
          wtu: acc.wtu + value.score.wtu,
        }
      }
      return acc
    },
    {
      scoreWithoutDurability: 0,
      acd: 0,
      cch: 0,
      etf: 0,
      fru: 0,
      fwe: 0,
      ior: 0,
      ldu: 0,
      microfibers: 0,
      mru: 0,
      outOfEuropeEOL: 0,
      ozd: 0,
      pco: 0,
      pma: 0,
      swe: 0,
      tre: 0,
      wtu: 0,
    },
  )
  return {
    ...scores,
    durability: product.score ? scores.scoreWithoutDurability / product.score : 0,
    score: product.score ?? 0,
    standardized: product.standardized ?? 0,
    scoreWithoutDurability: undefined,
  }
}

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
          materials: acc.materials + (value.score.materials || 0),
          spinning: acc.spinning + (value.score.spinning || 0),
          fabric: acc.fabric + (value.score.fabric || 0),
          dyeing: acc.dyeing + (value.score.dyeing || 0),
          making: acc.making + (value.score.making || 0),
          usage: acc.usage + (value.score.usage || 0),
          endOfLife: acc.endOfLife + (value.score.endOfLife || 0),
          transport: acc.transport + (value.score.transport || 0),
          trims: acc.trims + (value.score.trims || 0),
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
      materials: 0,
      spinning: 0,
      fabric: 0,
      dyeing: 0,
      making: 0,
      usage: 0,
      endOfLife: 0,
      transport: 0,
      trims: 0,
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

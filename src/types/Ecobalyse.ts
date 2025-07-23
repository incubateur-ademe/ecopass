export type EcobalyseImpacts = {
  acd: number
  cch: number
  etf: number
  "etf-c": number
  fru: number
  fwe: number
  htc: number
  "htc-c": number
  htn: number
  "htn-c": number
  ior: number
  ldu: number
  mru: number
  ozd: number
  pco: number
  pma: number
  swe: number
  tre: number
  wtu: number
  ecs: number
  pef: number
}

export type EcobalyseResponse = {
  durability: number
  impacts: EcobalyseImpacts
  complementsImpacts: {
    cropDiversity: number
    hedges: number
    livestockDensity: number
    microfibers: number
    outOfEuropeEOL: number
    permanentPasture: number
    plotSize: number
  }
}

export type EcobalyseCode = { code: string; name: string }
export type EcobalyseId = { id: string; name: string }

import { MaterialType } from "../../types/Product"

export const materials: Record<string, MaterialType> = {
  // Elasthane
  elasthanelycra: MaterialType.ElasthaneLycra,
  elasthane: MaterialType.ElasthaneLycra,

  // Acrylique
  acrylique: MaterialType.Acrylique,
  eiacrylique: MaterialType.Acrylique,
  acrylic: MaterialType.Acrylique,

  // Jute
  jute: MaterialType.Jute,
  eijutekenaf: MaterialType.Jute,
  kenaf: MaterialType.Jute,

  // Polypropylène
  polypropylene: MaterialType.Polypropylène,
  eipp: MaterialType.Polypropylène,
  polypropylène: MaterialType.Polypropylène,

  // Polyester
  polyester: MaterialType.Polyester,
  eipet: MaterialType.Polyester,

  // Polyester recyclé
  polyesterrecycle: MaterialType.PolyesterRecyclé,
  eipetr: MaterialType.PolyesterRecyclé,
  recycledpolyester: MaterialType.PolyesterRecyclé,

  // Nylon
  nylon: MaterialType.Nylon,
  eipa: MaterialType.Nylon,

  // Lin
  lin: MaterialType.Lin,
  eilin: MaterialType.Lin,
  flax: MaterialType.Lin,

  // Laine
  lainepardefaut: MaterialType.LaineParDéfaut,
  eilainepardefaut: MaterialType.LaineParDéfaut,
  defaultwool: MaterialType.LaineParDéfaut,

  // Laine nouvelle filière
  lainenouvellefiliere: MaterialType.LaineNouvelleFilière,
  eilainenouvellefiliere: MaterialType.LaineNouvelleFilière,
  newwool: MaterialType.LaineNouvelleFilière,

  // Coton
  coton: MaterialType.Coton,
  eicoton: MaterialType.Coton,
  cotton: MaterialType.Coton,

  // Coton biologique
  cotonbiologique: MaterialType.CotonBiologique,
  eicotonorganic: MaterialType.CotonBiologique,
  organiccotton: MaterialType.CotonBiologique,

  // Chanvre
  chanvre: MaterialType.Chanvre,
  eichanvre: MaterialType.Chanvre,
  hemp: MaterialType.Chanvre,

  // Viscose
  viscose: MaterialType.Viscose,
  eiviscose: MaterialType.Viscose,

  // Coton recyclé (déchets postconsommation)
  cotonrecycledechetspostconsommation: MaterialType.CotonRecycléDéchetsPostConsommation,
  cotonrdpc: MaterialType.CotonRecycléDéchetsPostConsommation,
  postconsumerrecycledcotton: MaterialType.CotonRecycléDéchetsPostConsommation,

  // Coton recyclé (déchets de production)
  cotonrecycledechetsdeproduction: MaterialType.CotonRecycléDéchetsDeProduction,
  cotonrdp: MaterialType.CotonRecycléDéchetsDeProduction,
  preconsumerrecycledcotton: MaterialType.CotonRecycléDéchetsDeProduction,
}

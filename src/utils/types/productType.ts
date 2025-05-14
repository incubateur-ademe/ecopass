import { ProductType } from "../../types/Product"

export const productTypes: Record<string, ProductType> = {
  // Chemise
  chemise: ProductType.Chemise,
  shirt: ProductType.Chemise,

  // Jean
  jean: ProductType.Jean,
  jeans: ProductType.Jean,

  // Jupe / Robe
  juperobe: ProductType.JupeRobe,
  jupe: ProductType.JupeRobe,
  dressskirt: ProductType.JupeRobe,
  skirt: ProductType.JupeRobe,

  // Manteau / Veste
  manteauveste: ProductType.ManteauVeste,
  manteau: ProductType.ManteauVeste,
  coatjacket: ProductType.ManteauVeste,
  coat: ProductType.ManteauVeste,

  // Pantalon / Short
  pantalonshort: ProductType.PantalonShort,
  pantalon: ProductType.PantalonShort,
  pants: ProductType.PantalonShort,
  trousers: ProductType.PantalonShort,

  // Pull
  pull: ProductType.Pull,
  sweater: ProductType.Pull,

  // T-shirt / Polo
  tshirtpolo: ProductType.TShirtPolo,
  tshirt: ProductType.TShirtPolo,

  // Chaussettes
  chaussettes: ProductType.Chaussettes,
  socks: ProductType.Chaussettes,

  // Caleçon (tissé)
  calecontisse: ProductType.CaleçonTissé,
  calecon: ProductType.CaleçonTissé,
  wovenboxer: ProductType.CaleçonTissé,
  boxer: ProductType.CaleçonTissé,

  // Boxer / Slip (tricoté)
  boxersliptricote: ProductType.BoxerSlipTricoté,
  slip: ProductType.BoxerSlipTricoté,
  knittedboxerslip: ProductType.BoxerSlipTricoté,

  // Maillot de bain
  maillotdebain: ProductType.MaillotDeBain,
  swimsuit: ProductType.MaillotDeBain,
}

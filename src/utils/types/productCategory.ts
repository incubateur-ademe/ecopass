import { ProductCategory } from "../../types/Product"

export const productCategories: Record<string, ProductCategory> = {
  // Chemise
  chemise: ProductCategory.Chemise,
  shirt: ProductCategory.Chemise,

  // Jean
  jean: ProductCategory.Jean,
  jeans: ProductCategory.Jean,

  // Jupe / Robe
  juperobe: ProductCategory.JupeRobe,
  jupe: ProductCategory.JupeRobe,
  dressskirt: ProductCategory.JupeRobe,
  skirt: ProductCategory.JupeRobe,

  // Manteau / Veste
  manteauveste: ProductCategory.ManteauVeste,
  manteau: ProductCategory.ManteauVeste,
  coatjacket: ProductCategory.ManteauVeste,
  coat: ProductCategory.ManteauVeste,

  // Pantalon / Short
  pantalonshort: ProductCategory.PantalonShort,
  pantalon: ProductCategory.PantalonShort,
  pants: ProductCategory.PantalonShort,
  trousers: ProductCategory.PantalonShort,

  // Pull
  pull: ProductCategory.Pull,
  sweater: ProductCategory.Pull,

  // T-shirt / Polo
  tshirtpolo: ProductCategory.TShirtPolo,
  tshirt: ProductCategory.TShirtPolo,

  // Chaussettes
  chaussettes: ProductCategory.Chaussettes,
  socks: ProductCategory.Chaussettes,

  // Caleçon (tissé)
  calecontisse: ProductCategory.CaleçonTissé,
  calecon: ProductCategory.CaleçonTissé,
  wovenboxer: ProductCategory.CaleçonTissé,
  boxer: ProductCategory.CaleçonTissé,

  // Boxer / Slip (tricoté)
  boxersliptricote: ProductCategory.BoxerSlipTricoté,
  slip: ProductCategory.BoxerSlipTricoté,
  knittedboxer: ProductCategory.BoxerSlipTricoté,

  // Maillot de bain
  maillotdebain: ProductCategory.MaillotDeBain,
  swimsuit: ProductCategory.MaillotDeBain,
}

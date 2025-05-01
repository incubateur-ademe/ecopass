import { AccessoryType, Business, Country, MaterialType, ProductType } from "../../types/Product"

export const businessesMapping: Record<Business, string> = {
  [Business.Small]: "small-business",
  [Business.WithServices]: "large-business-with-services",
  [Business.WithoutServices]: "large-business-without-services",
}

export const materialMapping: Record<MaterialType, string> = {
  [MaterialType.ElasthaneLycra]: "elasthane",
  [MaterialType.Acrylique]: "ei-acrylique",
  [MaterialType.Jute]: "ei-jute-kenaf",
  [MaterialType.Polypropylène]: "ei-pp",
  [MaterialType.Polyester]: "ei-pet",
  [MaterialType.PolyesterRecyclé]: "ei-pet-r",
  [MaterialType.Nylon]: "ei-pa",
  [MaterialType.Lin]: "ei-lin",
  [MaterialType.LaineParDéfaut]: "ei-laine-par-defaut",
  [MaterialType.LaineNouvelleFilière]: "ei-laine-nouvelle-filiere",
  [MaterialType.Coton]: "ei-coton",
  [MaterialType.CotonBiologique]: "ei-coton-organic",
  [MaterialType.Chanvre]: "ei-chanvre",
  [MaterialType.Viscose]: "ei-viscose",
  [MaterialType.CotonRecycléDéchetsPostConsommation]: "coton-rdpc",
  [MaterialType.CotonRecycléDéchetsDeProduction]: "coton-rdp",
}

export const productMapping: Record<ProductType, string> = {
  [ProductType.Chemise]: "chemise",
  [ProductType.Jean]: "jean",
  [ProductType.JupeRobe]: "jupe",
  [ProductType.ManteauVeste]: "manteau",
  [ProductType.PantalonShort]: "pantalon",
  [ProductType.Pull]: "pull",
  [ProductType.TShirtPolo]: "tshirt",
  [ProductType.Chaussettes]: "chaussettes",
  [ProductType.CaleçonTissé]: "calecon",
  [ProductType.BoxerSlipTricoté]: "slip",
  [ProductType.MaillotDeBain]: "maillot-de-bain",
}

export const accessoryMapping: Record<AccessoryType, string> = {
  [AccessoryType.ZipLong]: "86b877ff-0d59-482f-bb34-3ff306b07496",
  [AccessoryType.ZipCourt]: "0e8ea799-9b06-490c-a925-37564746c454",
  [AccessoryType.BoutonEnPlastique]: "d56bb0d5-7999-4b8b-b076-94d79099b56a",
  [AccessoryType.BoutonEnMétal]: "0c903fc7-279b-4375-8cfa-ca8133b8e973",
}

export const countryMapping: Record<Country, string> = {
  [Country.RégionEuropeDeLOuest]: "REO",
  [Country.RégionEuropeDeLEst]: "REE",
  [Country.RégionAsie]: "RAS",
  [Country.RégionAfrique]: "RAF",
  [Country.RégionMoyenOrient]: "RME",
  [Country.RégionAmériqueLatine]: "RLA",
  [Country.RégionAmériqueDuNord]: "RNA",
  [Country.RégionOcéanie]: "ROC",
  [Country.Myanmar]: "MM",
  [Country.Bangladesh]: "BD",
  [Country.Chine]: "CN",
  [Country.France]: "FR",
  [Country.Inde]: "IN",
  [Country.Cambodge]: "KH",
  [Country.Maroc]: "MA",
  [Country.Pakistan]: "PK",
  [Country.Tunisie]: "TN",
  [Country.Turquie]: "TR",
  [Country.Vietnam]: "VN",
}

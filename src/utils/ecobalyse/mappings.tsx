import {
  Accessory,
  Business,
  Country,
  Material,
  ProductType,
} from "../../types/Product";

export const businessesMapping: Record<Business, string> = {
  [Business.Small]: "small-business",
  [Business.WithServices]: "large-business-with-services",
  [Business.WithoutServices]: "large-business-without-services",
};

export const materialMapping: Record<Material, string> = {
  [Material.ElasthaneLycra]: "elasthane",
  [Material.Acrylique]: "ei-acrylique",
  [Material.Jute]: "ei-jute-kenaf",
  [Material.Polypropylène]: "ei-pp",
  [Material.Polyester]: "ei-pet",
  [Material.PolyesterRecyclé]: "ei-pet-r",
  [Material.Nylon]: "ei-pa",
  [Material.Lin]: "ei-lin",
  [Material.LaineParDéfaut]: "ei-laine-par-defaut",
  [Material.LaineNouvelleFilière]: "ei-laine-nouvelle-filiere",
  [Material.Coton]: "ei-coton",
  [Material.CotonBiologique]: "ei-coton-organic",
  [Material.Chanvre]: "ei-chanvre",
  [Material.Viscose]: "ei-viscose",
  [Material.CotonRecycléDéchetsPostConsommation]: "coton-rdpc",
  [Material.CotonRecycléDéchetsDeProduction]: "coton-rdp",
};

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
};

export const accessoryMapping: Record<Accessory, string> = {
  [Accessory.ZipLong]: "86b877ff-0d59-482f-bb34-3ff306b07496",
  [Accessory.ZipCourt]: "0e8ea799-9b06-490c-a925-37564746c454",
  [Accessory.BoutonEnPlastique]: "d56bb0d5-7999-4b8b-b076-94d79099b56a",
  [Accessory.BoutonEnMétal]: "0c903fc7-279b-4375-8cfa-ca8133b8e973",
};

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
};

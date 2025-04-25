export enum Business {
  Small = "TPE/PME",
  WithServices = "Grande entreprise avec service de réparation",
  WithoutServices = "Grande entreprise sans service de réparation",
}

export enum Material {
  ElasthaneLycra = "Elasthane (Lycra)",
  Acrylique = "Acrylique",
  Jute = "Jute",
  Polypropylène = "Polypropylène",
  Polyester = "Polyester",
  PolyesterRecyclé = "Polyester recyclé",
  Nylon = "Nylon",
  Lin = "Lin",
  LaineParDéfaut = "Laine par défaut",
  LaineNouvelleFilière = "Laine nouvelle filière",
  Coton = "Coton",
  CotonBiologique = "Coton biologique",
  Chanvre = "Chanvre",
  Viscose = "Viscose",
  CotonRecycléDéchetsPostConsommation = "Coton recyclé (déchets post-consommation)",
  CotonRecycléDéchetsDeProduction = "Coton recyclé (déchets de production)",
}

export enum ProductType {
  Chemise = "Chemise",
  Jean = "Jean",
  JupeRobe = "Jupe / Robe",
  ManteauVeste = "Manteau / Veste",
  PantalonShort = "Pantalon / Short",
  Pull = "Pull",
  TShirtPolo = "T-shirt / Polo",
  Chaussettes = "Chaussettes",
  CaleçonTissé = "Caleçon (tissé)",
  BoxerSlipTricoté = "Boxer / Slip (tricoté)",
  MaillotDeBain = "Maillot de bain",
}

export enum Accessory {
  ZipLong = "Zip long",
  ZipCourt = "Zip court",
  BoutonEnPlastique = "Bouton en plastique",
  BoutonEnMétal = "Bouton en métal",
}

export enum Country {
  RégionEuropeDeLOuest = "Région - Europe de l'Ouest",
  RégionEuropeDeLEst = "Région - Europe de l'Est",
  RégionAsie = "Région - Asie",
  RégionAfrique = "Région - Afrique",
  RégionMoyenOrient = "Région - Moyen-Orient",
  RégionAmériqueLatine = "Région - Amérique Latine",
  RégionAmériqueDuNord = "Région - Amérique du nord",
  RégionOcéanie = "Région - Océanie",
  Myanmar = "Myanmar",
  Bangladesh = "Bangladesh",
  Chine = "Chine",
  France = "France",
  Inde = "Inde",
  Cambodge = "Cambodge",
  Maroc = "Maroc",
  Pakistan = "Pakistan",
  Tunisie = "Tunisie",
  Turquie = "Turquie",
  Vietnam = "Vietnam",
}

export type Product = {
  id: string;
  type: ProductType;
  mass: number;
  price: number;
  materials: {
    country?: Country;
    id: Material;
    share: number;
  }[];
  airTransportRatio: number;
  business: Business;
  countryDyeing: Country;
  countryFabric: Country;
  countryMaking: Country;
  countrySpinning: Country;
  fading: boolean;
  numberOfReferences: number;
  traceability: boolean;
  upcycled: boolean;
  accessories: {
    id: Accessory;
    quantity: number;
  }[];
};

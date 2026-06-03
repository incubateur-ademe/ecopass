export const ponderations = {
  acd: { label: "Acidification", base: 55.5695, ponderation: 0.049100000000000005 },
  cch: { label: "Changement climatique", base: 7553.08, ponderation: 0.2106 },
  etf: { label: "Écotoxicité de l'eau douce, corrigée", base: 98120, ponderation: 0.2106 },
  fru: { label: "Utilisation de ressources fossiles", base: 65004.3, ponderation: 0.0659 },
  fwe: { label: "Eutrophisation eaux douces", base: 1.60685, ponderation: 0.0222 },
  ior: { label: "Radiations ionisantes", base: 4220.16, ponderation: 0.0397 },
  ldu: { label: "Utilisation des sols", base: 819498, ponderation: 0.0629 },
  mru: {
    label: "Utilisation de ressources minérales et métalliques",
    base: 0.0636226,
    ponderation: 0.05979999999999999,
  },
  ozd: { label: "Appauvrissement de la couche d'ozone", base: 0.053648, ponderation: 0.05 },
  pco: { label: "Formation d'ozone photochimique", base: 40.8592, ponderation: 0.0379 },
  pma: { label: "Particules", base: 0.000595367, ponderation: 0.071 },
  swe: { label: "Eutrophisation marine", base: 19.5452, ponderation: 0.0235 },
  tre: { label: "Eutrophisation terrestre", base: 176.755, ponderation: 0.0294 },
  wtu: { label: "Utilisation de ressources en eau", base: 11468.7, ponderation: 0.0674 },
  microfibers: { label: "Complément microfibres", base: 1_000_000, ponderation: 1 },
  outOfEuropeEOL: { label: "Complément export hors-Europe", base: 1_000_000, ponderation: 1 },
}

export const lifeCycleStages = {
  trims: "Accessoires",
  materials: "Matières premières",
  spinning: "Filature",
  fabric: "Tissage & Tricotage",
  dyeing: "Ennoblissement",
  making: "Confection",
  transport: "Transport",
  usage: "Utilisation",
  endOfLife: "Fin de vie",
} as const

export const impactCategories = {
  climat: {
    icon: "climat",
    label: "Climat",
    impacts: [
      {
        key: "cch" as const,
        definition: "Indicateur le plus connu, correspond à la modification du climat, affectant l'écosystème global.",
      },
    ],
  },
  ressources: {
    icon: "ressources",
    label: "Ressources",
    impacts: [
      {
        key: "ldu" as const,
        definition:
          "Mesure de l'évolution de la qualité des sols (production biotique, résistance à l'érosion, filtration mécanique).",
      },
      {
        key: "fru" as const,
        definition:
          "Indicateur de l'épuisement des ressources naturelles en combustibles fossiles (gaz, charbon, pétrole).",
      },
      { key: "mru" as const, definition: "Indicateur de l'épuisement des ressources naturelles non fossiles." },
      {
        key: "wtu" as const,
        definition:
          "Indicateur de la consommation d'eau et son épuisement dans certaines régions. À ce stade, elle n'est prise en compte que pour l'étape “Matière & Filature”.",
      },
    ],
  },
  biodiversite: {
    icon: "biodiversity",
    label: "Biodiversité",
    impacts: [
      {
        key: "etf" as const,
        definition:
          "Indicateur d'écotoxicité  pour écosystèmes aquatiques d'eau douce. Cet indicateur se mesure en  Comparative Toxic Unit for ecosystems (CTUe)",
      },
      {
        key: "ior" as const,
        definition:
          "Indicateur correspondant aux dommages pour la santé humaine et les écosystèmes liés aux émissions de radionucléides.",
      },
      {
        key: "acd" as const,
        definition:
          "Indicateur de l'acidification potentielle des sols et des eaux due à la libération de gaz tels que les oxydes d'azote et les oxydes de soufre.",
      },
      {
        key: "tre" as const,
        definition:
          "Comme dans l'eau, l'eutrophisation terrestre correspond à un enrichissement excessif du milieu, en azote en particulier, conduisant a un déséquilibre et un  appauvrissement de l'écosystème. Ceci concerne principalement les sols  agricoles.",
      },
      {
        key: "fwe" as const,
        definition:
          "Indicateur correspondant à un enrichissement excessif des milieux naturels en nutriments, ce qui conduit à une prolifération et une asphyxie (zone morte). C'est  ce phénomène qui est à l'origine des algues vertes. On peut le retrouver en rivière et en lac également.",
      },
      {
        key: "pco" as const,
        definition:
          "Indicateur correspondant à la dégradation de la qualité de l'air, principalement via la formation de brouillard de basse altitude nommé smog. Il a des conséquences néfastes sur la santé.",
      },
      {
        key: "swe" as const,
        definition:
          "Indicateur correspondant à un enrichissement excessif des milieux naturels en nutriments, ce qui conduit à une prolifération et une asphyxie (zone morte). C'est ce phénomène qui est à l'origine des algues vertes.",
      },
      {
        key: "ozd" as const,
        definition:
          "La couche d'ozone est située en haute altitude dans l'atmosphère,  elle protège des rayons ultra-violets solaires. Son appauvrissement  augmente l'exposition de l'ensemble des êtres vivants à ces radiations négatives (cancérigènes en particulier).",
      },
    ],
  },
  qualiteAir: {
    icon: "quality",
    label: "Qualité de l'air",
    impacts: [
      {
        key: "pma" as const,
        definition:
          "Indicateur correspondant aux effets négatifs sur la santé humaine causés par les émissions de particules (PM) et de leurs précurseurs (NOx, SOx, NH3).",
      },
    ],
  },
  autres: {
    icon: "other",
    label: "Autres",
    impacts: [
      { key: "microfibers" as const, definition: "" },
      { key: "outOfEuropeEOL" as const, definition: "" },
    ],
  },
}

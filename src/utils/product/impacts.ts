export const ponderations = {
  acd: { label: "Acidification", base: 55.5695, ponderation: 0.049100000000000005 },
  cch: { label: "Changement climatique", base: 7553.08, ponderation: 0.2106 },
  etf: { label: "Écotoxicité de l'eau douce, corrigée", base: 98120, ponderation: 0.2106 },
  fru: { label: "Utilisation de ressources fossiles", base: 65004.3, ponderation: 0.0659 },
  fwe: { label: "Eutrophisation eaux douces", base: 1.60685, ponderation: 0.0222 },
  htc: { label: "Toxicité humaine - cancer, corrigée", base: 0.0000172529, ponderation: 0 },
  htn: { label: "Toxicité humaine - non-cancer, corrigée", base: 0.000128736, ponderation: 0 },
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

export const impactCategories = {
  climat: {
    icon: "climat",
    label: "Climat",
    impacts: [{ key: "cch" as const }],
  },
  qualiteAir: {
    icon: "quality",
    label: "Qualité de l'air",
    impacts: [{ key: "pma" as const }],
  },
  biodiversite: {
    icon: "biodiversity",
    label: "Biodiversité",
    impacts: [
      { key: "etf" as const },
      { key: "ior" as const },
      { key: "acd" as const },
      { key: "tre" as const },
      { key: "fwe" as const },
      { key: "pco" as const },
      { key: "swe" as const },
      { key: "ozd" as const },
    ],
  },
  ressources: {
    icon: "ressources",
    label: "Ressources",
    impacts: [{ key: "ldu" as const }, { key: "fru" as const }, { key: "mru" as const }, { key: "wtu" as const }],
  },
  autres: {
    icon: "other",
    label: "Autres",
    impacts: [
      { key: "microfibers" as const },
      { key: "outOfEuropeEOL" as const },
      { key: "htc" as const },
      { key: "htn" as const },
    ],
  },
}

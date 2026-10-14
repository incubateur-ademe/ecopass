import { MaterialType } from "../../types/Product"
import { materialMapping } from "../../utils/ecobalyse/mappings"
import { DropdownItem } from "./Dropdown"

const materialSubtitles: Record<MaterialType, string | undefined> = {
  [MaterialType.ElasthaneLycra]: undefined,
  [MaterialType.Acrylique]: undefined,
  [MaterialType.Jute]: undefined,
  [MaterialType.Polypropylène]: undefined,
  [MaterialType.Polyester]: undefined,
  [MaterialType.PolyesterRecyclé]: "Autres matières synthétiques recyclées",
  [MaterialType.Nylon]: "Polyamide",
  [MaterialType.Lin]: undefined,
  [MaterialType.LaineParDéfaut]: "Cachemire, Mohair, Alpaga, Soie",
  [MaterialType.LaineNouvelleFilière]: "Laine de Yack",
  [MaterialType.Coton]: undefined,
  [MaterialType.CotonBiologique]: undefined,
  [MaterialType.Chanvre]: undefined,
  [MaterialType.Viscose]: "Lyocell",
  [MaterialType.CotonRecycléDéchetsPostConsommation]: "Autres matières naturelles recyclées",
  [MaterialType.CotonRecycléDéchetsDeProduction]: undefined,
}

export const materials: DropdownItem[] = Object.entries(MaterialType)
  .map(([, label]) => ({
    value: materialMapping[label],
    title: label,
    subtitle: materialSubtitles[label],
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

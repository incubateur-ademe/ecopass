import { AccessoryType } from "../../types/Product"

export const accessories: Record<string, AccessoryType> = {
  // Fermetures éclair longues
  ziplong: AccessoryType.ZipLong,
  longzip: AccessoryType.ZipLong,
  "86b877ff0d59482fbb343ff306b07496": AccessoryType.ZipLong,

  // Fermetures éclair courtes
  zipcourt: AccessoryType.ZipCourt,
  shortzip: AccessoryType.ZipCourt,
  "0e8ea7999b06490ca92537564746c454": AccessoryType.ZipCourt,

  // Boutons en plastique
  boutonenplastique: AccessoryType.BoutonEnPlastique,
  plasticbutton: AccessoryType.BoutonEnPlastique,
  d56bb0d579994b8bb07694d79099b56a: AccessoryType.BoutonEnPlastique,

  // Boutons en métal
  boutonenmetal: AccessoryType.BoutonEnMétal,
  metalbutton: AccessoryType.BoutonEnMétal,
  "0c903fc7279b43758cfaca8133b8e973": AccessoryType.BoutonEnMétal,
}

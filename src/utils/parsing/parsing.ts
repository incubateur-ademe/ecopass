export const trimsColumnValues = [
  "quantitedeboutonenmetal",
  "quantitedeboutonenplastique",
  "quantitedeziplong",
  "quantitedezipcourt",
] as const

export type ColumnType = [
  "quantitedeboutonenmetal",
  "quantitedeboutonenplastique",
  "quantitedeziplong",
  "quantitedezipcourt",

  "gtinseans",
  "referenceinterne",
  "marqueid",
  "score",
  "categorie",
  "masse",
  "remanufacture",
  "nombredereferences",
  "prix",
  "tailledelentreprise",
  "matiere1",
  "matiere1pourcentage",
  "matiere1origine",
  "matiere2",
  "matiere2pourcentage",
  "matiere2origine",
  "matiere3",
  "matiere3pourcentage",
  "matiere3origine",
  "matiere4",
  "matiere4pourcentage",
  "matiere4origine",
  "matiere5",
  "matiere5pourcentage",
  "matiere5origine",
  "matiere6",
  "matiere6pourcentage",
  "matiere6origine",
  "matiere7",
  "matiere7pourcentage",
  "matiere7origine",
  "matiere8",
  "matiere8pourcentage",
  "matiere8origine",
  "matiere9",
  "matiere9pourcentage",
  "matiere9origine",
  "matiere10",
  "matiere10pourcentage",
  "matiere10origine",
  "matiere11",
  "matiere11pourcentage",
  "matiere11origine",
  "matiere12",
  "matiere12pourcentage",
  "matiere12origine",
  "matiere13",
  "matiere13pourcentage",
  "matiere13origine",
  "matiere14",
  "matiere14pourcentage",
  "matiere14origine",
  "matiere15",
  "matiere15pourcentage",
  "matiere15origine",
  "matiere16",
  "matiere16pourcentage",
  "matiere16origine",
  "originedefilature",
  "originedetissagetricotage",
  "originedelennoblissementimpression",
  "typedimpression",
  "pourcentagedimpression",
  "originedeconfection",
  "delavage",
  "partdutransportaerien",
  "accessoire1",
  "accessoire1quantite",
  "accessoire2",
  "accessoire2quantite",
  "accessoire3",
  "accessoire3quantite",
  "accessoire4",
  "accessoire4quantite",
]

const columns: Partial<Record<ColumnType[number], string>> = {
  gtinseans: "GTINs/Eans",
  referenceinterne: "Référence interne",
  categorie: "Catégorie",
  masse: "Masse (en kg)",
  remanufacture: "Remanufacturé",
  nombredereferences: "Nombre de références",
  prix: "Prix (en euros, TTC)",
  tailledelentreprise: "Taille de l'entreprise",
  matiere1: "Matière 1",
  matiere1pourcentage: "Matière 1 pourcentage",
  matiere1origine: "Matière 1 origine",
  originedefilature: "Origine de filature",
  originedetissagetricotage: "Origine de tissage/tricotage",
  originedelennoblissementimpression: "Origine de l'ennoblissement/impression",
  typedimpression: "Type d'impression",
  pourcentagedimpression: "Pourcentage d'impression",
  originedeconfection: "Origine de confection",
  delavage: "Délavage",
  partdutransportaerien: "Part du transport aérien",
}

const trimsColumn: Partial<Record<ColumnType[number], string>> = {
  quantitedeboutonenmetal: "Quantité de bouton en métal",
  quantitedeboutonenplastique: "Quantité de bouton en plastique",
  quantitedeziplong: "Quantité de zip long",
  quantitedezipcourt: "Quantité de zip court",
}

const columnsValues = Object.keys(columns)

export const simplifyValue = (value: string | null) =>
  value
    ? value
        .trim()
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/[ \/'-]/g, "")
        .replace(/[éè]/g, "e")
        .replace(/ç/g, "c")
    : ""

export const checkHeaders = (headers: string[]) => {
  const formattedHeaders = headers.map((header) => simplifyValue(header))
  let missingHeaders = columnsValues.filter((header) => !formattedHeaders.includes(header))
  if (!formattedHeaders.includes("accessoire1")) {
    missingHeaders = missingHeaders.concat(trimsColumnValues.filter((header) => !formattedHeaders.includes(header)))
  }

  if (missingHeaders.length > 0) {
    throw new Error(
      `Colonne(s) manquante(s): ${missingHeaders.map((header) => columns[header as keyof typeof columns] || trimsColumn[header as keyof typeof trimsColumn]).join(", ")}`,
    )
  }

  return formattedHeaders
}

export const getValue = <T>(mapping: Record<string, T>, key: string): T => {
  const simplifiedKey = simplifyValue(key)
  const value = mapping[simplifiedKey]
  if (value !== undefined) {
    return value
  }
  return key as T
}

export const getBooleanValue = (value: string) => {
  if (value === "") {
    return undefined
  }

  const simplifiedValue = simplifyValue(value)
  if (simplifiedValue === "oui" || simplifiedValue === "yes" || simplifiedValue === "true") {
    return true
  } else if (simplifiedValue === "non" || simplifiedValue === "no" || simplifiedValue === "false") {
    return false
  }
  return value
}

export const getNumberValue = (value: string, factor?: number, defaultValue?: number) => {
  if (value === "") {
    return undefined
  }

  const result = parseFloat(simplifyValue(value).replace(",", "."))
  return isNaN(result) ? defaultValue || value : result * (factor || 1)
}

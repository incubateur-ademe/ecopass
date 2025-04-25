import {
  Accessory,
  Business,
  Country,
  Material,
  Product,
  ProductType,
} from "../../types/Product";
import { parse } from "csv-parse/sync";

const columns = [
  "Identifiant",
  "Date de mise sur le marché",
  "Type",
  "Masse",
  "Remanufacturé",
  "Nombre de références",
  "Prix",
  "Taille de l'entreprise",
  "Traçabilité géographiqe",
  "Matières",
  "Origine des matières",
  "Origine de filature",
  "Origine de tissage/tricotage",
  "Origine de l'ennoblissement/impression",
  "Type d'impression",
  "Origine confection",
  "Délavage",
  "Part du transport aérien",
  "Accessoires",
] as const;

type CSVRow = Record<(typeof columns)[number], string>;

const checkHeaders = (headers: string[]) => {
  const missingHeaders = columns.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Colonne(s) manquante(s): ${missingHeaders.join(", ")}`);
  }
};

export const parseCSV = async (content: string) => {
  const rows = parse(content, {
    columns: (headers: string[]) => {
      checkHeaders(headers);
      return headers;
    },
    delimiter: ",",
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CSVRow[];

  return rows.map((row) => {
    const materials: Product["materials"] = row["Matières"]
      .split(",")
      .map((material) => {
        const [id, share] = material.trim().split(" ");
        return {
          id: id as Material,
          share: parseFloat(share.replace("%", "")) / 100,
        };
      });

    row["Origine des matières"].split(",").forEach((material) => {
      const [id, origin] = material.trim().split(" ");
      materials.find(
        (existingMaterial) => existingMaterial.id === id
      )!.country = origin as Country;
    });

    return {
      id: row["Identifiant"],
      type: row["Type"] as ProductType,
      airTransportRatio: parseFloat(row["Part du transport aérien"]) / 100,
      business: row["Taille de l'entreprise"] as Business,
      fading: row["Délavage"] === "Oui",
      mass: parseFloat(row["Masse"]),
      numberOfReferences: parseInt(row["Nombre de références"]),
      price: parseFloat(row["Prix"]),
      traceability: row["Traçabilité géographiqe"] === "Oui",
      countryDyeing: row["Origine de l'ennoblissement/impression"] as Country,
      countryFabric: row["Origine de tissage/tricotage"] as Country,
      countryMaking: row["Origine confection"] as Country,
      countrySpinning: row["Origine de filature"] as Country,
      upcycled: row["Remanufacturé"] === "Oui",
      accessories: row["Accessoires"].split(",").map((accessory) => {
        const values = accessory.trim().split(" ");
        return {
          id: values.slice(0, values.length - 1).join(" ") as Accessory,
          quantity: parseFloat(values[values.length - 1]),
        };
      }),
      materials,
    };
  });
};

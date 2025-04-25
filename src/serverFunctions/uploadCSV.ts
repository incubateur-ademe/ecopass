"use server";

import { parseCSV } from "../utils/csv/parse";
import { getEcobalyseResults } from "../utils/ecobalyse/api";

export async function uploadCSV(file: File) {
  const content = await file.text();
  const products = await parseCSV(content);
  const scores = await getEcobalyseResults(products);

  return scores;
}

import fs from "fs";
import { getEcobalyseResults } from "../utils/ecobalyse/api";
import { parseCSV } from "../utils/csv/parse";

const getScores = async (file: string) => {
  const content = fs.readFileSync(file, { encoding: "utf-8" });
  console.log(content);
  const products = await parseCSV(content);
  const scores = await getEcobalyseResults(products);

  console.log(JSON.stringify(scores));
};

getScores(process.argv[2]);

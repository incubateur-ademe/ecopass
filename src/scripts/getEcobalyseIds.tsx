import { getEcobalyseCodes, getEcobalyseIds } from "../utils/ecobalyse/api";

const getIds = async () => {
  const [countries, materials, products, trims] = await Promise.all([
    getEcobalyseCodes("countries"),
    getEcobalyseIds("materials"),
    getEcobalyseIds("products"),
    getEcobalyseIds("trims"),
  ]);

  console.log("Countries", countries);
  console.log("Materials", materials);
  console.log("Products", products);
  console.log("Trims", trims);
};

getIds();

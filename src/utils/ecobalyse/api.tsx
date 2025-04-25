import axios from "axios";
import { Product } from "../../types/Product";
import {
  EcobalyseCode,
  EcobalyseId,
  EcobalyseProduct,
  EcobalyseResponse,
} from "../../types/Ecobalyse";
import {
  accessoryMapping,
  businessesMapping,
  countryMapping,
  materialMapping,
  productMapping,
} from "./mappings";

const baseUrl = "https://staging-ecobalyse.incubateur.net/api";

const convertProductToEcobalyse = (product: Product): EcobalyseProduct => ({
  airTransportRatio: product.airTransportRatio,
  business: businessesMapping[product.business],
  countryDyeing: countryMapping[product.countryDyeing],
  countryFabric: countryMapping[product.countryFabric],
  countryMaking: countryMapping[product.countryFabric],
  countrySpinning: countryMapping[product.countrySpinning],
  fading: product.fading,
  mass: product.mass,
  materials: product.materials.map((material) => ({
    ...material,
    country: material.country ? countryMapping[material.country] : undefined,
    id: materialMapping[material.id],
  })),
  numberOfReferences: product.numberOfReferences,
  price: product.price,
  traceability: product.traceability,
  trims: product.accessories.map((accessory) => ({
    id: accessoryMapping[accessory.id],
    quantity: accessory.quantity,
  })),
  upcycled: product.upcycled,
  product: productMapping[product.type],
});

export const getEcobalyseCodes = async (type: "countries") => {
  const result = await axios.get<EcobalyseCode[]>(`${baseUrl}/textile/${type}`);

  return result.data;
};

export const getEcobalyseIds = async (
  type: "materials" | "products" | "trims"
) => {
  const result = await axios.get<EcobalyseId[]>(`${baseUrl}/textile/${type}`);

  return result.data;
};

export const getEcobalyseResults = async (products: Product[]) => {
  const results: {
    id: string;
    score: number;
    detail: { label: string; score: number }[];
  }[] = [];
  for (var i = 0; i < products.length; i++) {
    const product = products[i];

    const response = await axios.post<EcobalyseResponse>(
      `${baseUrl}/textile/simulator/detailed`,
      convertProductToEcobalyse(product)
    );

    results.push({
      id: product.id,
      score: response.data.impacts.ecs,
      detail: [
        ...response.data.lifeCycle.map((cycle) => ({
          label: cycle.label,
          score: cycle.impacts.ecs,
        })),
        {
          label: "Transport",
          score: response.data.transport.impacts.ecs,
        },
      ],
    });
  }

  return results;
};

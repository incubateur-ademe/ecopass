import { prismaClient } from "../db/prismaClient"
import { decryptProductFields } from "../db/encryption"
import fs from "fs"
import { stringify } from "csv-stringify/sync"

async function main(email: string) {
  const user = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      uploads: {
        include: {
          products: {
            include: {
              materials: true,
              accessories: true,
              score: true,
              upload: {
                include: {
                  user: { include: { brand: { select: { name: true, names: { select: { name: true } } } } } },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!user) {
    console.error("Utilisateur non trouvé")
    process.exit(1)
  }

  const products = user.uploads.flatMap((upload) => upload.products)

  const decryptedProducts = products.map((product) => decryptProductFields(product))

  const csv = stringify(
    decryptedProducts.map((product) => [
      product.error,
      product.gtins,
      product.internalReference,
      product.date,
      product.brand,
      product.declaredScore,
      product.category,
      product.mass,
      product.upcycled,
      product.numberOfReferences,
      product.price,
      product.business,
      product.traceability,
      ...Array.from({ length: 16 }).flatMap((_, i) =>
        product.materials[i]
          ? [product.materials[i].slug, product.materials[i].share, product.materials[i].country]
          : ["", "", ""],
      ),
      product.countrySpinning,
      product.countryFabric,
      product.countryDyeing,
      product.impression,
      product.impressionPercentage,
      product.countryMaking,
      product.fading,
      product.airTransportRatio,
      ...Array.from({ length: 4 }).flatMap((_, i) =>
        product.accessories[i] ? [product.accessories[i].slug, product.accessories[i].quantity] : ["", ""],
      ),
    ]),
    {
      header: true,
      columns: [
        "Erreur",
        "GTINs/EANs",
        "Référence interne",
        "Date de mise sur le marché",
        "Marque",
        "Score",
        "Catégorie",
        "Masse",
        "Remanufacturé",
        "Nombre de références",
        "Prix",
        "Taille de l'entreprise",
        "Traçabilité géographique",
        "Matière 1",
        "Matière 1 pourcentage",
        "Matière 1 origine",
        "Matière 2",
        "Matière 2 pourcentage",
        "Matière 2 origine",
        "Matière 3",
        "Matière 3 pourcentage",
        "Matière 3 origine",
        "Matière 4",
        "Matière 4 pourcentage",
        "Matière 4 origine",
        "Matière 5",
        "Matière 5 pourcentage",
        "Matière 5 origine",
        "Matière 6",
        "Matière 6 pourcentage",
        "Matière 6 origine",
        "Matière 7",
        "Matière 7 pourcentage",
        "Matière 7 origine",
        "Matière 8",
        "Matière 8 pourcentage",
        "Matière 8 origine",
        "Matière 9",
        "Matière 9 pourcentage",
        "Matière 9 origine",
        "Matière 10",
        "Matière 10 pourcentage",
        "Matière 10 origine",
        "Matière 11",
        "Matière 11 pourcentage",
        "Matière 11 origine",
        "Matière 12",
        "Matière 12 pourcentage",
        "Matière 12 origine",
        "Matière 13",
        "Matière 13 pourcentage",
        "Matière 13 origine",
        "Matière 14",
        "Matière 14 pourcentage",
        "Matière 14 origine",
        "Matière 15",
        "Matière 15 pourcentage",
        "Matière 15 origine",
        "Matière 16",
        "Matière 16 pourcentage",
        "Matière 16 origine",
        "Origine de filature",
        "Origine de tissage/tricotage",
        "Origine de l'ennoblissement/impression",
        "Type d'impression",
        "Pourcentage d'impression",
        "Origine confection",
        "Délavage",
        "Part du transport aérien",
        "Accessoire 1",
        "Accessoire 1 quantité",
        "Accessoire 2",
        "Accessoire 2 quantité",
        "Accessoire 3",
        "Accessoire 3 quantité",
        "Accessoire 4",
        "Accessoire 4 quantité",
      ],
    },
  )

  fs.writeFileSync("products.csv", csv, "utf8")
}

const email = process.argv[2]
if (!email) {
  console.error("Usage: ts-node src/scripts/getProducts.ts <email>")
  process.exit(1)
}

main(email).then(() => prismaClient.$disconnect())

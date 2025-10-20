/*
  Warnings:

  - You are about to drop the column `air_transport_ratio` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `business` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `country_dyeing` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `country_fabric` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `country_making` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `country_spinning` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `fading` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `impression` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `impression_percentage` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `mass` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_references` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `upcycled` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."accessories" DROP CONSTRAINT "accessories_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."materials" DROP CONSTRAINT "materials_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."scores" DROP CONSTRAINT "scores_product_id_fkey";

-- CreateTable
CREATE TABLE "product_informations" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "country_dyeing" TEXT NOT NULL,
    "country_fabric" TEXT NOT NULL,
    "country_making" TEXT NOT NULL,
    "country_spinning" TEXT NOT NULL,
    "impression" TEXT NOT NULL,
    "mass" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "air_transport_ratio" TEXT NOT NULL,
    "number_of_references" TEXT NOT NULL,
    "impression_percentage" TEXT NOT NULL,
    "fading" TEXT NOT NULL,
    "upcycled" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "product_informations_pkey" PRIMARY KEY ("id")
);

-- Copier tous les produits existants vers product_informations
INSERT INTO "product_informations" (
    "id",
    "category",
    "business", 
    "country_dyeing",
    "country_fabric",
    "country_making",
    "country_spinning",
    "impression",
    "mass",
    "price",
    "air_transport_ratio",
    "number_of_references", 
    "impression_percentage",
    "fading",
    "upcycled",
    "productId"
)
SELECT 
    gen_random_uuid()::text,
    COALESCE("category", ''),
    COALESCE("business", ''),
    COALESCE("country_dyeing", ''),
    COALESCE("country_fabric", ''),
    COALESCE("country_making", ''),
    COALESCE("country_spinning", ''),
    COALESCE("impression", ''),
    COALESCE("mass", ''),
    COALESCE("price", ''),
    COALESCE("air_transport_ratio", ''),
    COALESCE("number_of_references", ''),
    COALESCE("impression_percentage", ''),
    COALESCE("fading", ''),
    COALESCE("upcycled", ''),
    "id"
FROM "products"; 

-- Mettre à jour les foreign keys materials vers product_informations
UPDATE "materials" SET "product_id" = (
    SELECT pi."id" 
    FROM "product_informations" pi 
    WHERE pi."productId" = "materials"."product_id"
    LIMIT 1
);

-- Mettre à jour les foreign keys accessories vers product_informations  
UPDATE "accessories" SET "product_id" = (
    SELECT pi."id"
    FROM "product_informations" pi 
    WHERE pi."productId" = "accessories"."product_id"
    LIMIT 1
);

-- Mettre à jour les foreign keys scores vers product_informations
UPDATE "scores" SET "product_id" = (
    SELECT pi."id"
    FROM "product_informations" pi 
    WHERE pi."productId" = "scores"."product_id"
    LIMIT 1
);

-- AlterTable
ALTER TABLE "accessories" ALTER COLUMN "product_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "materials" ALTER COLUMN "product_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "air_transport_ratio",
DROP COLUMN "business",
DROP COLUMN "category",
DROP COLUMN "country_dyeing",
DROP COLUMN "country_fabric",
DROP COLUMN "country_making",
DROP COLUMN "country_spinning",
DROP COLUMN "fading",
DROP COLUMN "impression",
DROP COLUMN "impression_percentage",
DROP COLUMN "mass",
DROP COLUMN "number_of_references",
DROP COLUMN "price",
DROP COLUMN "upcycled",
DROP COLUMN "updated_at",
ADD COLUMN     "score" DOUBLE PRECISION,
ADD COLUMN     "standardized" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "scores" ALTER COLUMN "product_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_informations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_informations" ADD CONSTRAINT "product_informations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_informations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_informations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

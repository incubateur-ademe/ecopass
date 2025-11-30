/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."idx_product_brand";

-- AlterTable: Add new columns first
ALTER TABLE "products" 
ADD COLUMN     "brand_id" TEXT,
ADD COLUMN     "brand_name" TEXT;

-- Copy existing brand data to brand_name before dropping the column
UPDATE "products" SET "brand_name" = "brand" WHERE "brand" IS NOT NULL;

-- Drop the old brand column
ALTER TABLE "products" DROP COLUMN "brand";

-- CreateIndex
CREATE INDEX "idx_product_brand" ON "products"("brand_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update brand_id based on brand_name
UPDATE "products"
SET "brand_id" = b.id
FROM "brands" b
WHERE b.name = "brand_name";

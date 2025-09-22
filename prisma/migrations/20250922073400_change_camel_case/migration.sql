/*
  Warnings:

  - You are about to drop the column `productId` on the `accessories` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfReferences` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `accessories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `materials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_references` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- Step 1: Add new columns as nullable first
ALTER TABLE "public"."accessories" ADD COLUMN "product_id" TEXT;
ALTER TABLE "public"."materials" ADD COLUMN "product_id" TEXT;
ALTER TABLE "public"."products" ADD COLUMN "number_of_references" TEXT;

-- Step 2: Copy data from old columns to new columns
UPDATE "public"."accessories" SET "product_id" = "productId";
UPDATE "public"."materials" SET "product_id" = "productId";
UPDATE "public"."products" SET "number_of_references" = "numberOfReferences";

-- Step 3: Make new columns NOT NULL after copying data
ALTER TABLE "public"."accessories" ALTER COLUMN "product_id" SET NOT NULL;
ALTER TABLE "public"."materials" ALTER COLUMN "product_id" SET NOT NULL;
ALTER TABLE "public"."products" ALTER COLUMN "number_of_references" SET NOT NULL;

-- Step 4: Drop foreign key constraints on old columns
ALTER TABLE "public"."accessories" DROP CONSTRAINT "accessories_productId_fkey";
ALTER TABLE "public"."materials" DROP CONSTRAINT "materials_productId_fkey";

-- Step 5: Drop indexes on old columns
DROP INDEX "public"."idx_accessory_product_id";
DROP INDEX "public"."idx_material_product_id";

-- Step 6: Drop old columns
ALTER TABLE "public"."accessories" DROP COLUMN "productId";
ALTER TABLE "public"."materials" DROP COLUMN "productId";
ALTER TABLE "public"."products" DROP COLUMN "numberOfReferences";

-- Step 7: Create indexes on new columns
CREATE INDEX "idx_accessory_product_id" ON "public"."accessories"("product_id");
CREATE INDEX "idx_material_product_id" ON "public"."materials"("product_id");

-- Step 8: Add foreign key constraints on new columns
ALTER TABLE "public"."materials" ADD CONSTRAINT "materials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."accessories" ADD CONSTRAINT "accessories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `gtin` on the `products` table. All the data in the column will be lost.
  - Added the required column `internal_reference` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN "gtins" TEXT[],
ADD COLUMN "internal_reference" TEXT ;

UPDATE "products" SET "gtins" = ARRAY["gtin"], "internal_reference" = "gtin";

ALTER TABLE "products" DROP COLUMN "gtin";
ALTER TABLE "products" ALTER COLUMN "internal_reference" SET NOT NULL;


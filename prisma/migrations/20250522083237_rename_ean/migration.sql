/*
  Warnings:

  - You are about to drop the column `ean` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gtin,upload_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gtin` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_ean_upload_id_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "ean",
ADD COLUMN     "gtin" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_gtin_upload_id_key" ON "products"("gtin", "upload_id");

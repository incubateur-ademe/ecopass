/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `brands` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `siret` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "siret" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "brands_siret_key" ON "brands"("siret");

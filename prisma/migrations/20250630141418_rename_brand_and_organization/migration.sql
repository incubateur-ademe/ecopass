/*
  Warnings:

  - You are about to drop the column `brand_id` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `brandId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `brand_names` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organization_id` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "brand_names" DROP CONSTRAINT "brand_names_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_authorized_by_id_fkey";

-- DropForeignKey
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_brandId_fkey";

-- AlterTable
ALTER TABLE "uploads" DROP COLUMN "brand_id",
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "brandId",
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- DropTable
DROP TABLE "brand_names";

-- DropTable
DROP TABLE "brands";

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siret" TEXT NOT NULL,
    "authorized_by_id" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_siret_key" ON "organizations"("siret");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_authorized_by_id_fkey" FOREIGN KEY ("authorized_by_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

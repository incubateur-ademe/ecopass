/*
  Warnings:

  - You are about to drop the `brand` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "public"."brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- Migrate all data from brand to brands
INSERT INTO "public"."brands" ("id", "name", "organization_id")
SELECT "id", "name", "organization_id" FROM "public"."brand";

-- DropForeignKey
ALTER TABLE "public"."brand" DROP CONSTRAINT "brand_organization_id_fkey";

-- DropTable
DROP TABLE "public"."brand";

-- AddForeignKey
ALTER TABLE "public"."brands" ADD CONSTRAINT "brands_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

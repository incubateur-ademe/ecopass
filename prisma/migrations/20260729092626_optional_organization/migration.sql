-- DropForeignKey
ALTER TABLE "brands" DROP CONSTRAINT "brands_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_organization_id_fkey";

-- AlterTable
ALTER TABLE "brands" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "uploads" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

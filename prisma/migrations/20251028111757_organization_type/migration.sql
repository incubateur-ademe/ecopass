-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('Brand', 'Distributor', 'BrandAndDistributor', 'Consultancy');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "type" "OrganizationType";

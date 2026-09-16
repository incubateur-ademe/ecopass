-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('Man', 'Woman', 'Mixed', 'Kid', 'Baby');

-- AlterTable
ALTER TABLE "product_informations" ADD COLUMN     "audience" "Audience";

/*
  Warnings:

  - Made the column `brand` on table `exports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "exports" ADD COLUMN     "category" TEXT,
ADD COLUMN     "dateFrom" TIMESTAMP(3),
ADD COLUMN     "dateTo" TIMESTAMP(3),
ADD COLUMN     "declarant" TEXT,
ADD COLUMN     "search" TEXT;

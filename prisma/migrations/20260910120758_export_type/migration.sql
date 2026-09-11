/*
  Warnings:

  - Added the required column `type` to the `exports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExportType" AS ENUM ('CSV', 'SVG');

-- AlterTable
ALTER TABLE "exports" ADD COLUMN     "type" "ExportType";

-- Update all existing exports to CSV
UPDATE "exports" SET "type" = 'CSV' WHERE "type" IS NULL;

-- AlterTable - Make type NOT NULL
ALTER TABLE "exports" ALTER COLUMN "type" SET NOT NULL;

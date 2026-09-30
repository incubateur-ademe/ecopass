/*
  Warnings:

  - Existing products are initialized to `High` before enforcing `NOT NULL`.

*/
-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('Low', 'Medium', 'High');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "confidence_level" "ConfidenceLevel";

-- Backfill existing products
UPDATE "products"
SET "confidence_level" = 'High'
WHERE "confidence_level" IS NULL;

-- Enforce required column
ALTER TABLE "products" ALTER COLUMN "confidence_level" SET NOT NULL;

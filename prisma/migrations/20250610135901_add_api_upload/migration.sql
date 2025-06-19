/*
  Warnings:

  - Added the required column `type` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('API', 'FILE');


-- AlterTable
ALTER TABLE "uploads" ADD COLUMN "type" "UploadType";

-- Mets à jour toutes les anciennes lignes avec la valeur par défaut 'FILE'
UPDATE "uploads" SET "type" = 'FILE';

-- Rends la colonne NOT NULL
ALTER TABLE "uploads" ALTER COLUMN "type" SET NOT NULL;

ALTER TABLE "uploads" ALTER COLUMN "name" DROP NOT NULL;

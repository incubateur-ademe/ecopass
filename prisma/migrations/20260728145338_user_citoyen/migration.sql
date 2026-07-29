/*
  Warnings:

  - Added the required column `type` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CITOYEN', 'PROFESSIONNEL');

-- AlterEnum
ALTER TYPE "UploadType" ADD VALUE 'SIMPLIFIED';

-- AlterTable
 ALTER TABLE "users"
   ADD COLUMN "birthdate" TEXT,
   ADD COLUMN "type" "UserType" ;
 UPDATE "users" SET "type" = 'PROFESSIONNEL' WHERE "type" IS NULL;
 ALTER TABLE "users" ALTER COLUMN "type" SET NOT NULL;
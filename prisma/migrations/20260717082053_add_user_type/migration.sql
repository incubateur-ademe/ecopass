-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CITOYEN', 'PROFESSIONNEL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "type" "UserType";

-- Backfill existing users before enforcing NOT NULL
UPDATE "users" SET "type" = 'PROFESSIONNEL' WHERE "type" IS NULL;

-- Enforce required column
ALTER TABLE "users" ALTER COLUMN "type" SET NOT NULL;

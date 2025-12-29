/*
  Warnings:

  - Added the required column `displayName` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "displayName" TEXT ;

-- Copy data from old column to new column
UPDATE "organizations" SET "displayName" = "name";

-- Make the new column NOT NULL after copying data
ALTER TABLE "organizations" ALTER COLUMN "displayName" SET NOT NULL;


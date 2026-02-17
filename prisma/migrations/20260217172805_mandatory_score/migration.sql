/*
  Warnings:

  - Made the column `dyeing` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_of_life` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fabric` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `making` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `materials` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spinning` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transport` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trims` on table `scores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usage` on table `scores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "scores" ALTER COLUMN "dyeing" SET NOT NULL,
ALTER COLUMN "end_of_life" SET NOT NULL,
ALTER COLUMN "fabric" SET NOT NULL,
ALTER COLUMN "making" SET NOT NULL,
ALTER COLUMN "materials" SET NOT NULL,
ALTER COLUMN "spinning" SET NOT NULL,
ALTER COLUMN "transport" SET NOT NULL,
ALTER COLUMN "trims" SET NOT NULL,
ALTER COLUMN "usage" SET NOT NULL;

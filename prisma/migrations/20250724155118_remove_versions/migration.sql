/*
  Warnings:

  - You are about to drop the column `password` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `versionId` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the `versions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `version` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_versionId_fkey";

ALTER TABLE "uploads" DROP COLUMN "versionId",
ADD COLUMN     "version" TEXT;

UPDATE "uploads" SET "version" = '5.0.1' WHERE "version" IS NULL;

ALTER TABLE "uploads" ALTER COLUMN "version" SET NOT NULL;

-- DropTable
DROP TABLE "versions";

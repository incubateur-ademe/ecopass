/*
  Warnings:

  - A unique constraint covering the columns `[unique_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "unique_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_unique_id_key" ON "organizations"("unique_id");

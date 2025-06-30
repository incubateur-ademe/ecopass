/*
  Warnings:

  - Added the required column `brand_id` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "brand_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

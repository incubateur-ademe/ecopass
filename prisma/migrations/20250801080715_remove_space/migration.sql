/*
  Warnings:

  - You are about to drop the column `  created_by_id` on the `uploads` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_  created_by_id_fkey";

-- AlterTable: Add new column as nullable first
ALTER TABLE "uploads" ADD COLUMN "created_by_id" TEXT;

-- Copy data from old column to new column
UPDATE "uploads" SET "created_by_id" = "  created_by_id";

-- Make the new column NOT NULL after copying data
ALTER TABLE "uploads" ALTER COLUMN "created_by_id" SET NOT NULL;

-- Drop the old column with space
ALTER TABLE "uploads" DROP COLUMN "  created_by_id";

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

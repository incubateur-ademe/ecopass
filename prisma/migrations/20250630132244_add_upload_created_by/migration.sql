/*
  Warnings:

  - You are about to drop the column `user_id` on the `uploads` table. All the data in the column will be lost.
  - Added the required column `  created_by_id` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "uploads" DROP CONSTRAINT "uploads_user_id_fkey";

-- AlterTable
ALTER TABLE "uploads" DROP COLUMN "user_id",
ADD COLUMN     "  created_by_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_  created_by_id_fkey" FOREIGN KEY ("  created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

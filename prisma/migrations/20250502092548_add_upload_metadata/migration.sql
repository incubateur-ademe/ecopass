/*
  Warnings:

  - Added the required column `name` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL;

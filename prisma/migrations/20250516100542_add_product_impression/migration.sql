/*
  Warnings:

  - Added the required column `impression` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impression_percentage` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "impression" TEXT NOT NULL,
ADD COLUMN     "impression_percentage" TEXT NOT NULL;

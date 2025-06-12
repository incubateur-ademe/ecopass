/*
  Warnings:

  - Added the required column `type` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('API', 'FILE');

-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "type" "UploadType" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

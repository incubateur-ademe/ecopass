/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "agentconnect_info" JSONB,
ADD COLUMN     "nom" TEXT,
ADD COLUMN     "prenom" TEXT;

/*
  Warnings:

  - A unique constraint covering the columns `[api_key]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "api_key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");

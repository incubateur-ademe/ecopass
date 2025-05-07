/*
  Warnings:

  - Added the required column `versionId` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "versionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "versions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "versions_version_key" ON "versions"("version");

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

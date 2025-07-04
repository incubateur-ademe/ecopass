/*
  Warnings:

  - You are about to drop the column `authorized_by_id` on the `organizations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_authorized_by_id_fkey";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "authorized_by_id";

-- CreateTable
CREATE TABLE "_AuthorizedOrganizations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AuthorizedOrganizations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AuthorizedOrganizations_B_index" ON "_AuthorizedOrganizations"("B");

-- AddForeignKey
ALTER TABLE "_AuthorizedOrganizations" ADD CONSTRAINT "_AuthorizedOrganizations_A_fkey" FOREIGN KEY ("A") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorizedOrganizations" ADD CONSTRAINT "_AuthorizedOrganizations_B_fkey" FOREIGN KEY ("B") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

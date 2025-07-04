/*
  Warnings:

  - You are about to drop the `_AuthorizedOrganizations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AuthorizedOrganizations" DROP CONSTRAINT "_AuthorizedOrganizations_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorizedOrganizations" DROP CONSTRAINT "_AuthorizedOrganizations_B_fkey";

-- DropTable
DROP TABLE "_AuthorizedOrganizations";

-- CreateTable
CREATE TABLE "AuthorizedOrganization" (
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "AuthorizedOrganization_pkey" PRIMARY KEY ("from_id","to_id")
);

-- AddForeignKey
ALTER TABLE "AuthorizedOrganization" ADD CONSTRAINT "AuthorizedOrganization_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedOrganization" ADD CONSTRAINT "AuthorizedOrganization_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorizedOrganization" ADD CONSTRAINT "AuthorizedOrganization_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `AuthorizedOrganization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AuthorizedOrganization" DROP CONSTRAINT "AuthorizedOrganization_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "AuthorizedOrganization" DROP CONSTRAINT "AuthorizedOrganization_from_id_fkey";

-- DropForeignKey
ALTER TABLE "AuthorizedOrganization" DROP CONSTRAINT "AuthorizedOrganization_to_id_fkey";

-- DropTable
DROP TABLE "AuthorizedOrganization";

-- CreateTable
CREATE TABLE "authorized_organizations" (
    "id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "authorized_organizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "authorized_organizations" ADD CONSTRAINT "authorized_organizations_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_organizations" ADD CONSTRAINT "authorized_organizations_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorized_organizations" ADD CONSTRAINT "authorized_organizations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

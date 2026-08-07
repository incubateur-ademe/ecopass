-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('ADMIN', 'READER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organization_role" "OrganizationRole";

UPDATE "users" set "organization_role" = 'ADMIN' WHERE "organization_role" IS NULL;

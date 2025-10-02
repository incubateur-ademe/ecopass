-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "role" "public"."UserRole";

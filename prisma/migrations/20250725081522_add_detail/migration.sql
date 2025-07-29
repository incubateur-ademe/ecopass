/*
  Warnings:

  - You are about to drop the column `password` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `accounts` table. All the data in the column will be lost.
  - Added the required column `acd` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cch` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `durability` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `etf` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fru` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fwe` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htc` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htn` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ior` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ldu` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `microfibers` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mru` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outOfEuropeEOL` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ozd` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pco` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pma` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swe` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tre` to the `scores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wtu` to the `scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "password",
DROP COLUMN "reset_password_token";

ALTER TABLE "scores" ADD COLUMN     "acd" DOUBLE PRECISION,
ADD COLUMN     "cch" DOUBLE PRECISION,
ADD COLUMN     "durability" DOUBLE PRECISION,
ADD COLUMN     "etf" DOUBLE PRECISION,
ADD COLUMN     "fru" DOUBLE PRECISION,
ADD COLUMN     "fwe" DOUBLE PRECISION,
ADD COLUMN     "htc" DOUBLE PRECISION,
ADD COLUMN     "htn" DOUBLE PRECISION,
ADD COLUMN     "ior" DOUBLE PRECISION,
ADD COLUMN     "ldu" DOUBLE PRECISION,
ADD COLUMN     "microfibers" DOUBLE PRECISION,
ADD COLUMN     "mru" DOUBLE PRECISION,
ADD COLUMN     "outOfEuropeEOL" DOUBLE PRECISION,
ADD COLUMN     "ozd" DOUBLE PRECISION,
ADD COLUMN     "pco" DOUBLE PRECISION,
ADD COLUMN     "pma" DOUBLE PRECISION,
ADD COLUMN     "swe" DOUBLE PRECISION,
ADD COLUMN     "tre" DOUBLE PRECISION,
ADD COLUMN     "wtu" DOUBLE PRECISION;

UPDATE "scores" SET 
  "acd" = 0,
  "cch" = 0,
  "durability" = 0,
  "etf" = 0,
  "fru" = 0,
  "fwe" = 0,
  "htc" = 0,
  "htn" = 0,
  "ior" = 0,
  "ldu" = 0,
  "microfibers" = 0,
  "mru" = 0,
  "outOfEuropeEOL" = 0,
  "ozd" = 0,
  "pco" = 0,
  "pma" = 0,
  "swe" = 0,
  "tre" = 0,
  "wtu" = 0
WHERE "acd" IS NULL;

ALTER TABLE "scores" 
  ALTER COLUMN "acd" SET NOT NULL,
  ALTER COLUMN "cch" SET NOT NULL,
  ALTER COLUMN "durability" SET NOT NULL,
  ALTER COLUMN "etf" SET NOT NULL,
  ALTER COLUMN "fru" SET NOT NULL,
  ALTER COLUMN "fwe" SET NOT NULL,
  ALTER COLUMN "htc" SET NOT NULL,
  ALTER COLUMN "htn" SET NOT NULL,
  ALTER COLUMN "ior" SET NOT NULL,
  ALTER COLUMN "ldu" SET NOT NULL,
  ALTER COLUMN "microfibers" SET NOT NULL,
  ALTER COLUMN "mru" SET NOT NULL,
  ALTER COLUMN "outOfEuropeEOL" SET NOT NULL,
  ALTER COLUMN "ozd" SET NOT NULL,
  ALTER COLUMN "pco" SET NOT NULL,
  ALTER COLUMN "pma" SET NOT NULL,
  ALTER COLUMN "swe" SET NOT NULL,
  ALTER COLUMN "tre" SET NOT NULL,
  ALTER COLUMN "wtu" SET NOT NULL;

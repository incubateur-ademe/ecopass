UPDATE "products" p
SET "brand" = b."name"
FROM "uploads" u
JOIN "users" usr ON u."user_id" = usr."id"
JOIN "brands" b ON usr."brandId" = b."id"
WHERE p."upload_id" = u."id"
  AND (p."brand" IS NULL OR p."brand" = '');
  
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "brand" SET NOT NULL;

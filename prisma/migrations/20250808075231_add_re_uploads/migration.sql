-- CreateTable
CREATE TABLE "public"."upload_products" (
    "id" TEXT NOT NULL,
    "upload_order" INTEGER NOT NULL,
    "upload_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "upload_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "upload_products_upload_id_product_id_key" ON "public"."upload_products"("upload_id", "product_id");

-- AddForeignKey
ALTER TABLE "public"."upload_products" ADD CONSTRAINT "upload_products_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."upload_products" ADD CONSTRAINT "upload_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."products" ADD COLUMN "hash" TEXT;

UPDATE "public"."products" 
SET "hash" = gen_random_uuid()::text 
WHERE "hash" IS NULL OR "hash" = '';

ALTER TABLE "public"."products" ALTER COLUMN "hash" SET NOT NULL;
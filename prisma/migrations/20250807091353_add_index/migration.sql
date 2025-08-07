-- CreateIndex
CREATE INDEX "idx_accessory_product_id" ON "public"."accessories"("productId");

-- CreateIndex
CREATE INDEX "idx_export_user_brand_created_at" ON "public"."exports"("user_id", "brand", "created_at");

-- CreateIndex
CREATE INDEX "idx_material_product_id" ON "public"."materials"("productId");

-- CreateIndex
CREATE INDEX "idx_product_gtins" ON "public"."products" USING GIN ("gtins");

-- CreateIndex
CREATE INDEX "idx_product_internal_ref_status" ON "public"."products"("internal_reference", "status");

-- CreateIndex
CREATE INDEX "idx_product_brand" ON "public"."products"("brand");

-- CreateIndex
CREATE INDEX "idx_upload_created_by_type" ON "public"."uploads"("created_by_id", "type");

-- CreateIndex
CREATE INDEX "idx_upload_status_type_created_at" ON "public"."uploads"("status", "type", "created_at");

-- CreateIndex
CREATE INDEX "idx_upload_organization_id" ON "public"."uploads"("organization_id");

-- CreateTable
CREATE TABLE "followed_brands" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "followed_brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "followed_brands_organization_id_brand_id_key" ON "followed_brands"("organization_id", "brand_id");

-- AddForeignKey
ALTER TABLE "followed_brands" ADD CONSTRAINT "followed_brands_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followed_brands" ADD CONSTRAINT "followed_brands_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

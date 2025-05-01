-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Processing', 'Done', 'Error');

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "ean" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "country_dyeing" TEXT NOT NULL,
    "country_fabric" TEXT NOT NULL,
    "country_making" TEXT NOT NULL,
    "country_spinning" TEXT NOT NULL,
    "mass" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "air_transport_ratio" TEXT NOT NULL,
    "numberOfReferences" TEXT NOT NULL,
    "fading" TEXT NOT NULL,
    "traceability" TEXT NOT NULL,
    "upcycled" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upload_id" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "share" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scores_product_id_key" ON "scores"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_ean_upload_id_key" ON "products"("ean", "upload_id");

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

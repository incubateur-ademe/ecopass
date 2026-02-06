-- CreateTable
CREATE TABLE "anonymized_products" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "standardized" DOUBLE PRECISION,
    "durability" DOUBLE PRECISION,

    CONSTRAINT "anonymized_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymized_product_informations" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "empty_trims" BOOLEAN,
    "business" TEXT,
    "country_dyeing" TEXT,
    "country_fabric" TEXT,
    "country_making" TEXT,
    "country_spinning" TEXT,
    "impression" TEXT,
    "mass" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "air_transport_ratio" DOUBLE PRECISION,
    "number_of_references" DOUBLE PRECISION,
    "impression_percentage" DOUBLE PRECISION,
    "fading" BOOLEAN,
    "upcycled" BOOLEAN,
    "product_id" TEXT,

    CONSTRAINT "anonymized_product_informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymized_materials" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "share" DOUBLE PRECISION NOT NULL,
    "product_id" TEXT,

    CONSTRAINT "anonymized_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymized_accessories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "product_id" TEXT,

    CONSTRAINT "anonymized_accessories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_anonymized_material_product_id" ON "anonymized_materials"("product_id");

-- CreateIndex
CREATE INDEX "idx_anonymized_accessory_product_id" ON "anonymized_accessories"("product_id");

-- AddForeignKey
ALTER TABLE "anonymized_product_informations" ADD CONSTRAINT "anonymized_product_informations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "anonymized_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anonymized_materials" ADD CONSTRAINT "anonymized_materials_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "anonymized_product_informations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anonymized_accessories" ADD CONSTRAINT "anonymized_accessories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "anonymized_product_informations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

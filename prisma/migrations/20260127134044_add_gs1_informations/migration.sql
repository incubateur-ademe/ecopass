-- CreateTable
CREATE TABLE "gs1" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gtin" TEXT NOT NULL,
    "json_data" JSONB NOT NULL,
    "siren" TEXT,
    "category" TEXT,
    "brand_name" TEXT,

    CONSTRAINT "gs1_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gs1_gtin_key" ON "gs1"("gtin");

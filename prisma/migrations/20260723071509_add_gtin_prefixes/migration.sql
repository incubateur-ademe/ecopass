-- CreateTable
CREATE TABLE "gtin_prefixes" (
    "id" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "organization_id" TEXT,

    CONSTRAINT "gtin_prefixes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gtin_prefixes_prefix_key" ON "gtin_prefixes"("prefix");

-- AddForeignKey
ALTER TABLE "gtin_prefixes" ADD CONSTRAINT "gtin_prefixes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

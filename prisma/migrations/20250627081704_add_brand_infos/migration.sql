-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "authorized_by_id" TEXT;

-- CreateTable
CREATE TABLE "brand_names" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand_id" TEXT NOT NULL,

    CONSTRAINT "brand_names_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_authorized_by_id_fkey" FOREIGN KEY ("authorized_by_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_names" ADD CONSTRAINT "brand_names_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

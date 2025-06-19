-- CreateTable
CREATE TABLE "exports" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "exports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "exports" ADD CONSTRAINT "exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

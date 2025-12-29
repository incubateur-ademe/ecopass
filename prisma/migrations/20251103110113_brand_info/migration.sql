-- AlterEnum
ALTER TYPE "OrganizationType" ADD VALUE 'Other';

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "default" BOOLEAN NOT NULL DEFAULT false;

 -- Créer des marques par défaut pour chaque organisation 
INSERT INTO brands (
    id,
    name,
    organization_id,
    active,
	"default"
)
SELECT 
    gen_random_uuid()::text,
    org.name,
    org.id,
    true,
	true
FROM organizations org;

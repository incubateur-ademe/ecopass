"use client"

import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { UserOrganization } from "../../../db/user"
import Table from "../../Table/Table"
import { Button } from "@codegouvfr/react-dsfr/Button"
import BrandAutocomplete from "../../Declaration/BrandAutocomplete"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import { followBrand, unfollowBrand } from "../../../serverFunctions/organization"

const FollowedBrands = ({
  organization,
  brands,
}: {
  organization: UserOrganization
  brands: { id: string; name: string }[]
}) => {
  const [newBrand, setNewBrand] = useState<{ brandName: string; brandId: string }>({ brandName: "", brandId: "" })
  const router = useRouter()

  const addBrand = useCallback(async () => {
    if (newBrand.brandName.trim()) {
      await followBrand(newBrand)
      setNewBrand({ brandName: "", brandId: "" })
      router.refresh()
    }
  }, [newBrand, router])

  const deleteBrand = useCallback(
    async (brandId: string) => {
      await unfollowBrand(brandId)
      router.refresh()
    },
    [router],
  )
  return (
    <>
      <div className='fr-mb-4w'>
        <BrandAutocomplete
          brands={brands}
          brandName={newBrand.brandName}
          brandId={newBrand.brandId}
          onChange={({ brandName, brandId }) => {
            setNewBrand({ brandName, brandId })
          }}
          hintText='Ajoutez une marque que vous souhaitez consulter'
        />
        <Button onClick={addBrand} data-testid='add-followed-brand-button'>
          Ajouter
        </Button>
      </div>
      {organization.followedBrands.length > 0 ? (
        <div data-testid='followed-brands-table'>
          <Table
            headers={["Marque", "ID de la marque", "Statut", "Action"]}
            data={organization.followedBrands
              .sort((a, b) => a.brand.name.localeCompare(b.brand.name))
              .map(({ brand }) => [
                brand.name,
                brand.id,
                <>
                  {brand.active ? (
                    <Badge key={brand.id} severity='success'>
                      Marque active
                    </Badge>
                  ) : (
                    <Badge key={brand.id} severity='error'>
                      Marque retirée
                    </Badge>
                  )}
                </>,
                <Button
                  key={brand.id}
                  priority='secondary'
                  onClick={() => {
                    deleteBrand(brand.id)
                  }}
                  iconId='fr-icon-delete-line'>
                  Supprimer
                </Button>,
              ])}
          />
        </div>
      ) : (
        <Alert
          className='fr-mt-8w fr-mb-10w'
          severity='info'
          small
          description='Aucune marque suivie pour le moment.'
        />
      )}
    </>
  )
}

export default FollowedBrands

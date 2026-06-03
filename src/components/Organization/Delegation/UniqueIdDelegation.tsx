"use client"
import Input from "@codegouvfr/react-dsfr/Input"
import { useCallback, useEffect, useState } from "react"
import { Organization } from "@prisma/client"
import { authorizeOrganizationById, getOrganizationByUniqueId } from "../../../serverFunctions/organization"
import { useRouter } from "next/navigation"
import Card from "@codegouvfr/react-dsfr/Card"
import LoadingButton from "../../Button/LoadingButton"

const uniqueIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

const UniqueIdDelegation = ({
  organization,
  onOrganizationChange,
}: {
  organization?: Pick<Organization, "name" | "id"> | null
  onOrganizationChange?: (organization: Pick<Organization, "name" | "id"> | null | undefined) => void
}) => {
  const router = useRouter()
  const [uniqueId, setUniqueId] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uniqueIdOrganization, setUniqueIdOrganization] = useState<
    Pick<Organization, "name" | "id"> | null | undefined
  >(organization)

  useEffect(() => {
    setUniqueIdOrganization(organization)
  }, [organization])

  const authorizeUniqueIdOrganization = useCallback(() => {
    if (uniqueIdOrganization) {
      setLoading(true)
      authorizeOrganizationById(uniqueIdOrganization.id).then(() => {
        setLoading(false)
        setUniqueId("")
        setUniqueIdOrganization(undefined)
        onOrganizationChange?.(undefined)
        router.refresh()
      })
    }
  }, [onOrganizationChange, router, uniqueIdOrganization])

  const onUniqueIdChange = useCallback(
    (uniqueId: string) => {
      setUniqueId(uniqueId)
      setSearching(false)
      setUniqueIdOrganization(undefined)
      onOrganizationChange?.(undefined)
      const trimmedUniqueId = uniqueId.trim().toLowerCase()
      if (uniqueIdRegex.test(trimmedUniqueId)) {
        setSearching(true)
        getOrganizationByUniqueId(trimmedUniqueId)
          .then((data) => {
            setUniqueIdOrganization(data ?? null)
            onOrganizationChange?.(data ?? null)
          })
          .finally(() => {
            setSearching(false)
          })
      }
    },
    [onOrganizationChange],
  )

  return (
    <>
      <Input
        label='Via son identifiant unique'
        hintText="Si votre bureau d'études n'a pas de numéro SIRET, il vous fournira son identifiant unique (exemple : 33f8d8eb-8392-431c-92cb-1ec761227b22)."
        nativeInputProps={{
          name: "uniqueId",
          value: uniqueId,
          onChange: (e) => onUniqueIdChange(e.target.value),
        }}
      />
      {(searching || uniqueIdOrganization !== undefined) && (
        <>
          {searching ? (
            <p>Chargement des informations...</p>
          ) : (
            <div className='fr-mb-0'>
              {uniqueIdOrganization ? (
                <Card
                  className='fr-mt-4w'
                  data-testid='uniqueid-organization-card'
                  title={uniqueIdOrganization.name}
                  footer={
                    onOrganizationChange ? undefined : (
                      <LoadingButton loading={loading} onClick={authorizeUniqueIdOrganization}>
                        Déléguer mes droits à cette organisation
                      </LoadingButton>
                    )
                  }
                />
              ) : (
                <p className='fr-mt-4w'>Aucune organisation trouvée pour cet identifiant.</p>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default UniqueIdDelegation

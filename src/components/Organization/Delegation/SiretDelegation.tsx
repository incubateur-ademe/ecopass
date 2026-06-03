"use client"
import Input from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { SiretAPI } from "../../../types/Siret"
import { authorizeOrganization } from "../../../serverFunctions/organization"
import { useRouter } from "next/navigation"
import { getSiretInfo } from "../../../serverFunctions/siret"
import Card from "@codegouvfr/react-dsfr/Card"
import LoadingButton from "../../Button/LoadingButton"

const siretRegex = /^\d{14}$/

const SiretDelegation = ({
  organization,
  onOrganizationChange,
}: {
  organization?: SiretAPI["etablissement"]
  onOrganizationChange?: (organization: SiretAPI["etablissement"] | undefined) => void
}) => {
  const router = useRouter()
  const [siret, setSiret] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [siretOrganization, setSiretOrganization] = useState<SiretAPI["etablissement"] | undefined>(organization)

  useEffect(() => {
    setSiretOrganization(organization)
  }, [organization])

  const authorizeSiretOrganization = useCallback(() => {
    if (siretOrganization) {
      setLoading(true)
      authorizeOrganization(siretOrganization.siret).then(() => {
        setLoading(false)
        setSiret("")
        setSiretOrganization(undefined)
        onOrganizationChange?.(undefined)
        router.refresh()
      })
    }
  }, [onOrganizationChange, router, siretOrganization])

  const onSiretChange = useCallback(
    (siret: string) => {
      setSiret(siret)
      setSearching(false)
      setSiretOrganization(undefined)
      onOrganizationChange?.(undefined)
      const trimmedSiret = siret.replace(/\s+/g, "")
      if (siretRegex.test(trimmedSiret)) {
        setSearching(true)
        getSiretInfo(trimmedSiret)
          .then((data) => {
            if (data) {
              setSiretOrganization(data.etablissement)
              onOrganizationChange?.(data.etablissement)
            }
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
        label='Via son numéro SIRET'
        hintText='Le SIRET doit être composé de 14 chiffres.'
        nativeInputProps={{
          name: "siret",
          value: siret,
          onChange: (e) => onSiretChange(e.target.value),
        }}
        state='info'
        stateRelatedMessage={
          <span>
            Pour connaitre le SIRET d'une entreprise vous pouvez vous rendre sur{" "}
            <Link href='https://annuaire-entreprises.data.gouv.fr/' target='_blank' rel='noopener noreferrer'>
              l'Annuaire des Entreprises
            </Link>
            .
          </span>
        }
      />
      {(searching || siretOrganization !== undefined) && (
        <>
          {searching && <p>Chargement des informations...</p>}
          {siretOrganization && (
            <div className='fr-mb-0'>
              <Card
                data-testid='siret-organization-card'
                title={siretOrganization.uniteLegale.denominationUniteLegale}
                desc={`${siretOrganization.adresseEtablissement.numeroVoieEtablissement}${siretOrganization.adresseEtablissement.indiceRepetitionEtablissement || ""} ${siretOrganization.adresseEtablissement.typeVoieEtablissement} ${siretOrganization.adresseEtablissement.libelleVoieEtablissement}, ${siretOrganization.adresseEtablissement.codePostalEtablissement} ${siretOrganization.adresseEtablissement.libelleCommuneEtablissement}`}
                footer={
                  onOrganizationChange ? undefined : (
                    <LoadingButton loading={loading} onClick={authorizeSiretOrganization}>
                      Déléguer mes droits à cette organisation
                    </LoadingButton>
                  )
                }
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default SiretDelegation

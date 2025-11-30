"use client"
import Input from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { getSiretInfo } from "../../../serverFunctions/siret"
import { SiretAPI } from "../../../types/Siret"
import Card from "@codegouvfr/react-dsfr/Card"
import LoadingButton from "../../Button/LoadingButton"
import { authorizeOrganization } from "../../../serverFunctions/organization"
import { useRouter } from "next/navigation"

const siretRegex = /^\d{14}$/
const NewDelegation = () => {
  const router = useRouter()
  const [siret, setSiret] = useState("")
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [organization, setOrganization] = useState<SiretAPI["etablissement"]>()

  useEffect(() => {
    setSearching(false)
    setOrganization(undefined)
    const trimmedSiret = siret.replace(/\s+/g, "")
    if (siretRegex.test(trimmedSiret)) {
      setSearching(true)
      getSiretInfo(trimmedSiret)
        .then((data) => {
          if (data) {
            setOrganization(data.etablissement)
          }
        })
        .finally(() => {
          setSearching(false)
        })
    }
  }, [siret])

  const delegateOrganization = useCallback(() => {
    if (organization) {
      setLoading(true)
      authorizeOrganization(organization.siret).then(() => {
        setLoading(false)
        setSiret("")
        setOrganization(undefined)
        router.refresh()
      })
    }
  }, [organization])

  return (
    <>
      <h3 className='fr-mt-2w'>Déléguer mes droits</h3>
      <Input
        label="Veuillez entrer le SIRET de l'entreprise à laquelle vous souhaitez déléguer vos droits."
        hintText='Le SIRET doit être composé de 14 chiffres.'
        nativeInputProps={{ required: true, name: "name", value: siret, onChange: (e) => setSiret(e.target.value) }}
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
      {searching && <p>Chargement des informations...</p>}
      {organization && (
        <div className='fr-mb-4w'>
          <Card
            data-testid='organization-card'
            title={organization.uniteLegale.denominationUniteLegale}
            desc={`${organization.adresseEtablissement.numeroVoieEtablissement}${organization.adresseEtablissement.indiceRepetitionEtablissement || ""} ${organization.adresseEtablissement.typeVoieEtablissement} ${organization.adresseEtablissement.libelleVoieEtablissement}, ${organization.adresseEtablissement.codePostalEtablissement} ${organization.adresseEtablissement.libelleCommuneEtablissement}`}
            footer={
              <LoadingButton loading={loading} onClick={delegateOrganization}>
                Déléguer mes droits à cette organisation
              </LoadingButton>
            }
          />
        </div>
      )}
    </>
  )
}

export default NewDelegation

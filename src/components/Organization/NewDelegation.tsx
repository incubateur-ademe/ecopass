"use client"
import Input from "@codegouvfr/react-dsfr/Input"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { getSiretInfo } from "../../serverFunctions/siret"
import { SiretAPI } from "../../types/Siret"
import Card from "@codegouvfr/react-dsfr/Card"
import LoadingButton from "../Button/LoadingButton"
import { authorizeOrganization } from "../../serverFunctions/organization"
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
    if (siretRegex.test(siret)) {
      setSearching(true)
      getSiretInfo(siret)
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
      <p>Veuillez entrer le SIRET de l'entreprise à laquelle vous souhaitez déléguer vos droits.</p>
      <p className='fr-mb-2w'>
        Pour connaitre le SIRET d'une entreprise vous pouvez vous rendre sur{" "}
        <Link
          href='https://annuaire-entreprises.data.gouv.fr/'
          className='fr-link'
          target='_blank'
          rel='noopener noreferrer'>
          l'Annuaire des Entreprises
        </Link>
        .
      </p>
      <Input
        label='SIRET'
        hintText='Le SIRET doit être composé de 14 chiffres.'
        nativeInputProps={{ required: true, name: "name", value: siret, onChange: (e) => setSiret(e.target.value) }}
      />
      {searching && <p>Chargement des informations...</p>}
      {organization && (
        <Card
          title={organization.uniteLegale.denominationUniteLegale}
          desc={`${organization.adresseEtablissement.numeroVoieEtablissement}${organization.adresseEtablissement.indiceRepetitionEtablissement || ""} ${organization.adresseEtablissement.typeVoieEtablissement} ${organization.adresseEtablissement.libelleVoieEtablissement}, ${organization.adresseEtablissement.codePostalEtablissement} ${organization.adresseEtablissement.libelleCommuneEtablissement}`}
          footer={
            <LoadingButton loading={loading} onClick={delegateOrganization}>
              Déléguer mes droits à cette organisation
            </LoadingButton>
          }
        />
      )}
    </>
  )
}

export default NewDelegation

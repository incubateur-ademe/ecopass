"use client"
import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import { isTestEnvironment } from "../../utils/test"
import { UserOrganization } from "../../db/user"
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons"
import { OrganizationType } from "@prisma/enums"
import { useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { updateOrganizationType } from "../../serverFunctions/organization"
import Alert from "@codegouvfr/react-dsfr/Alert"

const types = [
  {
    label: "une marque textile",
    value: OrganizationType.Brand,
  },
  {
    label: "un distributeur",
    value: OrganizationType.Distributor,
  },
  {
    label: "une marque textile et un distributeur",
    value: OrganizationType.BrandAndDistributor,
  },
  {
    label: "un bureau d'études",
    value: OrganizationType.Consultancy,
  },
  {
    label: "aucun des profils ci-dessus",
    value: OrganizationType.Other,
  },
]

const OrganizationTypeBanner = ({ organization }: { organization: UserOrganization }) => {
  const [type, setType] = useState<OrganizationType | null>(organization.type)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type) {
      setLoading(true)
      updateOrganizationType(type)
        .then((result) => {
          if (result) {
            setError(result)
          } else {
            window.location.href = "/"
          }
        })
        .finally(() => setLoading(false))
    }
  }
  return (
    <div className={classNames(styles.banner, { [styles.bannerTest]: isTestEnvironment() })}>
      <div>
        <h1 className={styles.title}>Finalisez votre inscription</h1>
        {error && (
          <Alert className='fr-mb-4w' severity='error' title='Une erreur est survenue, veuillez réessayer plus tard.' />
        )}
        <form onSubmit={onSubmit}>
          <RadioButtons
            legend='Pouvez-vous nous précisez votre profil ? Vous êtes :'
            options={types.map(({ label, value }) => ({
              label,
              nativeInputProps: {
                checked: type === value,
                onChange: () => setType(value),
              },
            }))}
          />
          <LoadingButton loading={loading} disabled={!type} type='submit'>
            Valider
          </LoadingButton>
        </form>
      </div>
      <Image className={styles.image} src='/images/tshirt.jpg' alt='' width={384} height={386} />
    </div>
  )
}

export default OrganizationTypeBanner

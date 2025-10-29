"use client"
import Image from "next/image"
import styles from "./HomeBanner.module.css"
import classNames from "classnames"
import { isTestEnvironment } from "../../utils/test"
import { UserOrganization } from "../../db/user"
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons"
import { OrganizationType } from "../../../prisma/src/prisma"
import { useState } from "react"
import LoadingButton from "../Button/LoadingButton"
import { updateOrganizationType } from "../../serverFunctions/organization"
import { redirect } from "next/navigation"
import Alert from "@codegouvfr/react-dsfr/Alert"

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
            redirect("/")
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
            legend='Votre organisation est :'
            options={[
              {
                label: "Une marque textile",
                nativeInputProps: {
                  checked: type === OrganizationType.Brand,
                  onChange: () => setType(OrganizationType.Brand),
                },
              },
              {
                label: "Un distributeur",
                nativeInputProps: {
                  checked: type === OrganizationType.Distributor,
                  onChange: () => setType(OrganizationType.Distributor),
                },
              },
              {
                label: "Une marque textile et un distributeur",
                nativeInputProps: {
                  checked: type === OrganizationType.BrandAndDistributor,
                  onChange: () => setType(OrganizationType.BrandAndDistributor),
                },
              },
              {
                label: "Un bureau d'études",
                nativeInputProps: {
                  checked: type === OrganizationType.Consultancy,
                  onChange: () => setType(OrganizationType.Consultancy),
                },
              },
            ]}
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

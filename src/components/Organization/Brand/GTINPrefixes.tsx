"use client"

import Image from "next/image"
import { UserOrganization } from "../../../db/user"
import styles from "./GTINPrefixes.module.css"
import { Input } from "@codegouvfr/react-dsfr/Input"
import { Button } from "@codegouvfr/react-dsfr/Button"
import { useRouter } from "next/navigation"
import Table from "../../Table/Table"
import { addNewGTINPrefix, deleteGTINPrefix } from "../../../serverFunctions/organization"
import { FormEvent, ReactNode, useState } from "react"
import Link from "next/link"
import { Alert } from "@codegouvfr/react-dsfr/Alert"

const prefixRegex = /^[0-9]{6}$/

const GTINPrefixes = ({ prefixes, isAdmin }: { prefixes: UserOrganization["gtinPrefixes"]; isAdmin: boolean }) => {
  const router = useRouter()
  const [error, setError] = useState<ReactNode>()

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const prefix = formData.get("prefix") as string
    if (!prefixRegex.test(prefix)) {
      setError("Le préfixe doit contenir exactement 6 chiffres")
      return
    }
    setError("")
    try {
      const result = await addNewGTINPrefix(prefix)
      if (result) {
        setError(
          result === "existing" ? (
            <span>
              Ce préfixe existe déjà. Si vous pensez que c'est une erreur, veuillez{" "}
              <Link
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}
                prefetch={false}
                target='_blank'
                rel='noopener noreferrer'>
                nous contacter.
              </Link>
            </span>
          ) : (
            "Une erreur est survenue"
          ),
        )
      } else {
        form.reset()
        router.refresh()
      }
    } catch {
      setError("Une erreur est survenue")
    }
  }

  const deletePrefix = async (id: string) => {
    deleteGTINPrefix(id).then(() => {
      router.refresh()
    })
  }
  return (
    <>
      {isAdmin && (
        <div className={styles.container}>
          <div className={styles.form}>
            <form onSubmit={submit}>
              <Input
                label='Ajouter un préfixe'
                nativeInputProps={{ required: true, name: "prefix" }}
                state={error ? "error" : undefined}
                stateRelatedMessage={error}
              />
              <Button type='submit'>Ajouter</Button>
            </form>
          </div>
          <Image src='/images/gtin_prefixes.png' alt='' width={259} height={182} />
        </div>
      )}
      {prefixes.length > 0 ? (
        <div data-testid='gtin-prefixes-table'>
          <Table
            headers={["Préfixe", "Actions"]}
            className='fr-mt-4w'
            fixed
            caption='Mes préfixes'
            data={prefixes.map((prefix) => [
              prefix.prefix,
              <Button
                priority='secondary'
                iconId='fr-icon-delete-bin-fill'
                key={prefix.id}
                onClick={() => deletePrefix(prefix.id)}>
                Supprimer
              </Button>,
            ])}
          />
        </div>
      ) : (
        <Alert small severity='info' description="Vous n'avez pas encore déclarer vos préfixes." className='fr-mt-2w' />
      )}
    </>
  )
}

export default GTINPrefixes

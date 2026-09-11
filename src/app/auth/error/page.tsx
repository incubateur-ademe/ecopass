import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"
import Block from "../../../components/Block/Block"
import { PageProps } from "../../../types/Next"

const errors: Record<string, string> = {
  Callback: "La tentative de connexion a échoué",
  "": "Une erreur est survenue",
}

const ErrorPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const error = params.error ? (params.error as string) : undefined

  return (
    <Block>
      <Alert
        severity='error'
        title={errors[error ?? ""] ?? error}
        description={
          <>
            Veuillez réessayer ou{" "}
            <Link
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              nous contacter
            </Link>{" "}
            si le problème persiste.
          </>
        }
      />
    </Block>
  )
}

export default ErrorPage

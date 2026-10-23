import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"

export default function SiretMismatchAlert({ organization }: { organization: string }) {
  return (
    <div className='fr-container fr-my-2w'>
      <Alert
        title='Organisation incorrecte'
        severity='warning'
        description={
          <>
            L'organisation choisie lors de votre connexion ne correspond pas à l'organisation choisie lors de la
            création de votre compte sur le portail. Veuillez vous connecter avec {organization}. <br />
            Si votre organisation a changé, veuillez{" "}
            <Link
              className='fr-link'
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              nous contacter
            </Link>
            .
          </>
        }
      />
    </div>
  )
}

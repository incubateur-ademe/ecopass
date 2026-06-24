import Image from "next/image"
import styles from "./ContributionBanner.module.css"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import Link from "next/link"
import { Button } from "@codegouvfr/react-dsfr/Button"

const ContributionBanner = () => {
  return (
    <div className={styles.container}>
      <Image src='/images/environment.svg' alt='' width={120} height={117} />
      <div>
        <Badge className={styles.badge}>Nouveauté</Badge>
        <h2>Contribuez au catalogue de références</h2>
        <p>
          Vous pouvez ajouter des produits pour enrichir la base de donnée.{" "}
          <Link
            href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871'
            target='_blank'
            rel='noopener noreferrer'>
            Consultez le décret
          </Link>
        </p>
      </div>
      <Button priority='secondary' className={styles.button}>
        Ajouter une référence
      </Button>
    </div>
  )
}

export default ContributionBanner

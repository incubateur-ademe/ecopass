import Image from "next/image"
import styles from "./ContributionBanner.module.css"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import Link from "next/link"
import { Button } from "@codegouvfr/react-dsfr/Button"

const ContributionBanner = ({ pro }: { pro?: boolean }) => {
  return (
    <div className={styles.container}>
      <Image src='/images/environment.svg' alt='' width={120} height={117} className={styles.image} />
      <div className={styles.content}>
        <div>
          <Badge className={styles.badge}>Nouveauté</Badge>
          <h2>{pro ? "Ouverture de la déclaration par des tiers" : "Contribuez au catalogue de références"}</h2>
          <p>
            {pro ? (
              <>
                Depuis octobre 2026, citoyen, selon{" "}
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Art. D. 541-244 du décret n° 2025-957 du 6 septembre 2025 relatif aux modalités de calcul et de
                  communication du coût environnemental des produits textiles
                </Link>{" "}
                les associations et autres professionnels peuvent eux aussi déclarer le coût environnemental de
                référence textile.
              </>
            ) : (
              <>
                Vous pouvez ajouter des produits pour enrichir la base de donnée.{" "}
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Consultez le décret
                </Link>
              </>
            )}
          </p>
        </div>
        {!pro && (
          <Button priority='secondary' className={styles.button}>
            Ajouter une référence
          </Button>
        )}
      </div>
    </div>
  )
}

export default ContributionBanner

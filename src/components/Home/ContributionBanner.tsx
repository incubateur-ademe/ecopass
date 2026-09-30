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
          <h2>{pro ? "Ouverture de la déclaration par des tiers" : "Contribuer au catalogue de références"}</h2>
          <p>
            {pro ? (
              <>
                Depuis octobre 2026, selon{" "}
                <Link
                  href='https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000052212871'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Art. D. 541-244 du décret n° 2025-957 du 6 septembre 2025 relatif aux modalités de calcul et de
                  communication du coût environnemental des produits textiles
                </Link>
                , les citoyens, les associations et autres professionnels peuvent eux aussi déclarer le coût
                environnemental de référence textile.
              </>
            ) : (
              <>
                Ajoutez des produits pour permettre aux citoyens des achats plus éclairés et sollicitez les marques pour
                les impliquer.{" "}
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
          <Button priority='secondary' className={styles.button} linkProps={{ href: "/declaration-simplifiee" }}>
            Declarer un produit
          </Button>
        )}
      </div>
    </div>
  )
}

export default ContributionBanner

import { Tile } from "@codegouvfr/react-dsfr/Tile"
import { CallOut } from "@codegouvfr/react-dsfr/CallOut"
import styles from "./Upload.module.css"
import Link from "next/link"
import UploadPanel from "./UploadPanel"

const Upload = () => {
  return (
    <div className={styles.layout}>
      <div>
        <h2>Nouvelle déclaration</h2>
        <p>
          Si vous souhaitez faire un test avant de vous lancer, rejoignez{" "}
          <Link
            href='https://test-affichage-environnemental.ecobalyse.beta.gouv.fr/'
            className='fr-link'
            target='_blank'
            rel='noopener noreferrer'>
            le serveur de test
          </Link>{" "}
          ou consultez les aides ci-contre.
        </p>
        <CallOut className='fr-mt-2w'>
          <span>
            Dans l'hypothèse où vous ne déclarez pas le champ "score", le calcul sera effectué automatiquement
            conformément à vos déclarations. Le score calculé demeure sous votre responsabilité.
          </span>
          <Link href='/notice-reglementaire.pdf' className='fr-link' prefetch={false}>
            Consultez la méthode de calcul
          </Link>
          .
        </CallOut>
        <UploadPanel />
      </div>
      <aside className={styles.aside}>
        <Tile
          className={styles.tile}
          orientation='horizontal'
          title='Télécharger un modèle Excel'
          titleAs='h3'
          imageUrl='/images/document.svg'
          small
          desc={
            <>
              Le fichier type pour déclarer vos produits
              <span className={styles.tileMeta}>.xlsx - 13 Ko</span>
            </>
          }
          linkProps={{ href: "/exemple/exemple.xlsx", download: true }}
        />
        <Tile
          className={styles.tile}
          orientation='horizontal'
          title='Télécharger un modèle CSV'
          titleAs='h3'
          imageUrl='/images/document.svg'
          small
          desc={
            <>
              Le fichier type pour déclarer vos produits
              <span className={styles.tileMeta}>.csv - 2 Ko</span>
            </>
          }
          linkProps={{ href: "/exemple/exemple.csv", download: true }}
        />
        <Tile
          className={styles.tile}
          orientation='horizontal'
          title='Comment concevoir un fichier de déclaration pour le portail ?'
          titleAs='h3'
          small
          desc="Consultez l'aide en ligne"
          linkProps={{ href: "/notice-reglementaire.pdf", target: "_blank", rel: "noopener noreferrer" }}
        />
      </aside>
    </div>
  )
}

export default Upload

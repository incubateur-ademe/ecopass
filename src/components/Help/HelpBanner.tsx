import { Tile } from "@codegouvfr/react-dsfr/Tile"
import styles from "./HelpBanner.module.css"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { OrganizationType } from "@prisma/enums"
import Block from "../Block/Block"

const tiles = {
  citoyen: [
    {
      title: "Comprendre les paramètres techniques d’un produit",
      desc: "Tutoriel",
      badge: "AIDE",
      link: "https://docs.numerique.gouv.fr/docs/bf5c785e-c7bc-4178-9a3d-fbe8a261de94/",
      image: "document-download",
    },
    {
      title: "Pourquoi contribuer au portail de l’affichage du coût environnemental ?",
      desc: "Aide et support",
      badge: "AIDE",
      link: "https://docs.numerique.gouv.fr/docs/e7b53465-fa62-4e0e-bd2c-16e6b321a5e3/",
      image: "conclusion",
    },
    {
      title: "Besoin d’aide ?",
      desc: "Nous contacter par mail",
      badge: "SUPPORT",
      link: "mailto:affichage-environnemental@ecobalyse.beta.gouv.fr",
      image: "mail-send",
    },
  ],
  professionnel: [
    {
      title: "Csv et étiquette, où retrouver vos infos produits ?",
      desc: "Toutes vos obligations d'affichage",
      badge: "DONNÉES PRODUITS",
      link: "https://docs.numerique.gouv.fr/docs/a2aa8fff-b86e-47ce-9f05-fa7208753929/",
      image: "document-download",
    },
    {
      title: "Que faire si un tiers déclare mes produits à ma place ?",
      desc: "Tout sur la déclaration par un tiers",
      badge: "AIDE",
      link: "https://docs.numerique.gouv.fr/docs/e7b53465-fa62-4e0e-bd2c-16e6b321a5e3/",
      image: "conclusion",
    },
    {
      title: "Besoin d’aide ?",
      desc: "Nous contacter par mail",
      badge: "SUPPORT",
      link: "mailto:affichage-environnemental@ecobalyse.beta.gouv.fr",
      image: "mail-send",
    },
  ],
}

const HelpBanner = ({ organizationType }: { organizationType?: OrganizationType }) => {
  return (
    <Block type='yellow'>
      <h2 className='fr-h4'>Tous les outils pour vous accompagner </h2>
      <div className={styles.container}>
        {(organizationType ? tiles.professionnel : tiles.citoyen).map((tile, index) => (
          <Tile
            key={index}
            small
            orientation='horizontal'
            title={tile.title}
            imageUrl={`/images/${tile.image}.svg`}
            imageAlt=''
            titleAs='h3'
            desc={tile.desc}
            linkProps={{ href: tile.link, target: "_blank", rel: "noopener noreferrer" }}
            start={<Badge>{tile.badge}</Badge>}
          />
        ))}
      </div>
    </Block>
  )
}

export default HelpBanner

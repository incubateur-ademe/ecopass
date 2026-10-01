import { Tile } from "@codegouvfr/react-dsfr/Tile"
import styles from "./HelpBanner.module.css"
import { Badge } from "@codegouvfr/react-dsfr/Badge"
import { OrganizationType } from "@prisma/enums"
import Block from "../Block/Block"

const tiles = {
  citoyen: [
    {
      title: "Comment déclarer un produit en tant que citoyen ?",
      desc: "Déclarer pas à pas",
      badge: "TUTORIEL",
      link: "https://docs.numerique.gouv.fr/docs/bf5c785e-c7bc-4178-9a3d-fbe8a261de94/",
      image: "document-download",
    },
    {
      title: "Pourquoi déclarer un produit en tant que citoyen ?",
      desc: "Contribuer au portail",
      badge: "TOUT SAVOIR",
      link: "https://docs.numerique.gouv.fr/docs/e7b53465-fa62-4e0e-bd2c-16e6b321a5e3/",
      image: "conclusion",
    },
    {
      title: "Besoin d’aide ?",
      desc: "Trouver toutes les réponses à vos questions",
      badge: "FAQ",
      link: "https://docs.numerique.gouv.fr/docs/326c0f51-fc1e-4931-a8f6-9aebcc91a441/",
      image: "mail-send",
    },
  ],
  professionnel: [
    {
      title: "Csv et étiquette, où retrouver vos infos produits ?",
      desc: "Les données utiles pour votre marque",
      badge: "DONNÉES PRODUITS",
      link: "https://docs.numerique.gouv.fr/docs/0e2a7047-25a5-4897-b9f4-928043d1e4b2/",
      image: "document-download",
    },
    {
      title: "Comment mettre à jour des produits déjà déclarés ?",
      desc: "Bien gérer ses références",
      badge: "MISE A JOUR DES PRODUITS",
      link: "https://docs.numerique.gouv.fr/docs/54264b1c-9350-435f-a83b-7de0b6eee92d/",
      image: "conclusion",
    },
    {
      title: "Besoin d’aide ?",
      desc: "Trouver toutes les réponses à vos questions",
      badge: "FAQ",
      link: "https://docs.numerique.gouv.fr/docs/4c19480c-746e-49d9-aa1c-8b94f8790720/",
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

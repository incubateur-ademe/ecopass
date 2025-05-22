import Link from "next/link"
import Block from "../components/Block/Block"
import Label from "../components/Label/Label"
import Button from "@codegouvfr/react-dsfr/Button"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Affichage environnemental</h1>
        <h2>Déclarez le cout environnemental de vos produits textiles</h2>
      </Block>
      {!connected ? (
        <>
          <Block>
            <Label product={{ score: 360, standardized: 154 }} />
          </Block>
          <Block>
            <p>
              Si vous souhaitez deposer un produit sur le portail, veuillez{" "}
              <Link href='/login' className='fr-link'>
                vous connecter
              </Link>
              .
            </p>
          </Block>
          <Block>
            <p>
              Vous êtes une marque ou un bureau d'études dans le domaine du textile et vous souhaitez tester le portail
              de déclaration de l'affichage environnemental ? Veuillez nous contacter à l'adresse{" "}
              <Link className='fr-link' href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
              .
            </p>
          </Block>
        </>
      ) : (
        <Block>
          <div className='fr-grid-row'>
            <div className='fr-col-12 fr-col-md-6'>
              <h3>Mes déclarations</h3>
              <p className='fr-mb-1w'>Déclarer mes produits et suivre leur status.</p>
              <Button linkProps={{ href: "/declarations" }}>Mes déclarations</Button>
            </div>
            <div className='fr-col-12 fr-col-md-6'>
              <h3>Mes produits</h3>
              <p className='fr-mb-1w'>Consulter mes produits déclarés.</p>
              <Button linkProps={{ href: "/produits" }}>Mes produits</Button>
            </div>
          </div>
        </Block>
      )}
    </>
  )
}

export default Home

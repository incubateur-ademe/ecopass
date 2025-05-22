import Link from "next/link"
import Block from "../components/Block/Block"
import { Suspense } from "react"
import Uploads from "../components/Upload/Uploads"
import Products from "../components/Product/Products"
import Upload from "../components/Upload/Upload"
import Label from "../components/Label/Label"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Affichage environnemental</h1>
        <h2>Déclarez le cout environnemental de vos produits textiles</h2>
        <Label product={{ score: 360, standardized: 154 }} />
      </Block>
      {!connected ? (
        <>
          <Block>
            <p>
              Si vous souhaitez deposer un produit sur la plateforme, veuillez{" "}
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
        <>
          <Block>
            <Upload />
          </Block>
          <Block>
            <div className='fr-grid-row fr-grid-row--center'>
              <div className='fr-col-12 fr-col-lg-6'>
                <h2>Mes fichiers</h2>
                <Suspense>
                  <Uploads />
                </Suspense>
              </div>
              <div className='fr-col-12 fr-col-lg-6'>
                <h2>Mes Produits</h2>
                <Suspense>
                  <Products />
                </Suspense>
              </div>
            </div>
          </Block>
        </>
      )}
    </>
  )
}

export default Home

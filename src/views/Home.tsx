import Link from "next/link"
import Block from "../components/Block/Block"
import Search from "../components/Product/Search"
import { Suspense } from "react"
import Uploads from "../components/Upload/Uploads"
import Products from "../components/Product/Products"
import Upload from "../components/Upload/Upload"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Bienvenue sur Écopass</h1>
        <h2>Découvrir l’impact environnemental de mes produits</h2>
      </Block>
      {!connected ? (
        <>
          <Block>
            <h3>Calculer l’impact d’un produit</h3>
            <p>
              Si vous souhaitez deposer un produit sur la plateforme, veuillez{" "}
              <Link href='/login' className='fr-link'>
                vous connecter
              </Link>
            </p>
          </Block>
          <Block>
            <h3>Trouver un produit</h3>
            <Search />
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

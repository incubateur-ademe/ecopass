import Link from "next/link"
import Block from "../components/Block/Block"
import Search from "../components/Product/Search"

const Home = ({ connected }: { connected?: boolean }) => {
  return (
    <>
      <Block>
        <h1>Bienvenue sur Écopass</h1>
      </Block>
      {!connected && (
        <Block>
          <h2>Déposer un produit</h2>
          <p>
            Si vous souhaitez deposer un produit sur la plateforme, veuillez{" "}
            <Link href='/login' className='fr-link'>
              vous connecter
            </Link>
          </p>
        </Block>
      )}
      <Block>
        <h2>Trouver un produit</h2>
        <Search />
      </Block>
    </>
  )
}

export default Home

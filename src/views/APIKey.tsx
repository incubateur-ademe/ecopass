import Block from "../components/Block/Block"
import Link from "next/link"
import { APIKey as APIKeyType } from "@prisma/client"
import Keys from "../components/API/Keys"

const APIKey = ({ keys }: { keys: APIKeyType[] }) => {
  return (
    <Block>
      <h1>Utiliser l'API pour déclarer un produit</h1>
      <div className='fr-mb-4w'>
        <p>L'API du portail de l’Affichage environnemental est utilisée pour déclarer vos produits.</p>
        <p>
          Cette dernière est basée sur l'API Écobalyse en y ajoutant les informations reglementaire. N'hésitez pas à
          consulter{" "}
          <Link className='fr-link' href='/documentation/api'>
            la documentation complète
          </Link>
          .
        </p>
      </div>
      <Keys keys={keys} />
    </Block>
  )
}

export default APIKey

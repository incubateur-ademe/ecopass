import Link from "next/link"
import Block from "../components/Block/Block"

const PlanDuSite = () => {
  return (
    <Block>
      <h1>Plan du site</h1>
      <h2>Pages principales</h2>
      <ul className='fr-mb-4w'>
        <li>
          <Link className='fr-link' prefetch={false} href='/'>
            Page d'accueil
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/produits'>
            Produits déclarés
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/recherche'>
            Recherche de produits
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/declarations'>
            Déclarations
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/organisation'>
            Organisation
          </Link>
        </li>
      </ul>
      <h2>Documentation</h2>
      <ul className='fr-mb-4w'>
        <li>
          <Link className='fr-link' prefetch={false} href='/documentation'>
            Documentation générale
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/documentation/api'>
            Documentation API
          </Link>
        </li>
      </ul>
      <h2>Gestion du compte</h2>
      <ul className='fr-mb-4w'>
        <li>
          <Link className='fr-link' prefetch={false} href='/logout'>
            Déconnexion
          </Link>
        </li>
      </ul>
      <h2>Autres</h2>
      <ul className='fr-mb-4w'>
        <li>
          <Link className='fr-link' prefetch={false} href='/mentions-legales'>
            Mentions légales
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/politique-de-confidentialite'>
            Politique de confidentialité
          </Link>
        </li>
        <li>
          <Link className='fr-link' prefetch={false} href='/plan-du-site'>
            Plan du site
          </Link>
        </li>
      </ul>
    </Block>
  )
}

export default PlanDuSite

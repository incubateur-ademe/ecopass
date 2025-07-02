"use client"

import Block from "../components/Block/Block"
import { ProConnectButton } from "@codegouvfr/react-dsfr/ProConnectButton"
import { signIn } from "next-auth/react"
import Link from "next/link"

const Login = () => {
  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      <div className='fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v'>
        <div className='fr-grid-row fr-grid-row-gutters fr-grid-row--center'>
          <div className='fr-col-12 fr-col-md-9 fr-col-lg-8'>
            <h1>Connexion</h1>
            <p className='fr-mb-4w'>
              Le portail de déclaration de l’affichage environnemental est actuellement en beta privé. Si vous
              rencontrez des difficultés à vous connecter, veuillez contacter l’équipe de l’affichage environnemental à
              cette adresse{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} className='fr-link' prefetch={false}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
            </p>
            <div className='fr-mb-6v'></div>
          </div>
        </div>
      </div>
    </Block>
  )
}

export default Login

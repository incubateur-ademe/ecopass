import Block from "../components/Block/Block"
import Link from "next/link"
import LoginForm from "../components/Login/LoginForm"
import { isTestEnvironment } from "../utils/test"

const Login = () => {
  const test = isTestEnvironment()
  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      <div className='fr-container fr-background-alt--grey fr-px-md-0 fr-py-10v fr-py-md-14v'>
        <div className='fr-grid-row fr-grid-row-gutters fr-grid-row--center'>
          <div className='fr-col-12 fr-col-md-9 fr-col-lg-8'>
            <h1>Connexion</h1>
            {!test && (
              <p>
                La connexion au portail de déclaration de l’affichage environnemental est actuellement réservée aux
                professionnels.
              </p>
            )}

            <p className='fr-mb-2w'>
              Si vous rencontrez des difficultés à vous connecter,{" "}
              <Link
                href={
                  test
                    ? "https://docs.numerique.gouv.fr/docs/fd1182f0-2180-4a62-9531-bf23e812886e/"
                    : "https://docs.numerique.gouv.fr/docs/9a00ac67-d9b4-44a1-8976-008da71a608b/"
                }
                target='_blank'
                rel='noopener noreferrer'
                className='fr-link'>
                consulter les tutoriels de connexion
              </Link>{" "}
              ou contacter l’équipe de l’affichage environnemental à cette adresse{" "}
              <Link href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}`} className='fr-link' prefetch={false}>
                {process.env.NEXT_PUBLIC_SUPPORT_MAIL}
              </Link>
              .
            </p>
            <LoginForm test={test} />
          </div>
        </div>
      </div>
    </Block>
  )
}

export default Login

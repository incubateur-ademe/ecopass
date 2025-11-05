import Card from "@codegouvfr/react-dsfr/Card"
import Tile from "@codegouvfr/react-dsfr/Tile"

const OtherOrganization = () => {
  return (
    <div data-testid='other-organization'>
      <h2>Vous êtes intéressé par l'affichage environnemental ?</h2>
      <div>
        <Card
          titleAs='h3'
          title='Votre avis compte pour nous'
          imageUrl='/images/distributor.png'
          imageAlt=''
          horizontal
          desc={
            <>
              <span>Le portail n'est pour l'instant que disponible pour les professionnels du textile.</span>
              <br />
              <span>Cependant, nous serions preneurs pour échanger sur vos attentes et objectifs.</span>
            </>
          }
        />
      </div>
      <div className='fr-mt-4w'>
        <Tile
          orientation='horizontal'
          imageUrl='/images/mail-send.svg'
          title='Si vous le souhaitez, vous pouvez prendre contact avec nous !'
          linkProps={{ href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_MAIL}` }}
          desc={process.env.NEXT_PUBLIC_SUPPORT_MAIL}
        />
      </div>
    </div>
  )
}

export default OtherOrganization

import Card from "@codegouvfr/react-dsfr/Card"
import Tile from "@codegouvfr/react-dsfr/Tile"

const DistributorOrganization = () => {
  return (
    <div data-testid='distributor-organization'>
      <h2>Vous êtes un distributeur textile ?</h2>
      <div>
        <Card
          titleAs='h3'
          title='Votre avis nous intéresse'
          imageUrl='/images/distributor.png'
          imageAlt=''
          horizontal
          desc={
            <>
              <span>
                Le portail ne vous permet pas encore de récupérer les données de produits déclarés par les marques.
              </span>
              <br />
              <span>
                Cependant, nous serions preneurs pour échanger sur vos attentes et objectifs par rapport à cette
                démarche.
              </span>
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

export default DistributorOrganization

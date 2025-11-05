import Card from "@codegouvfr/react-dsfr/Card"
import Contact from "./Contact"

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
      <Contact />
    </div>
  )
}

export default DistributorOrganization

import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import Search from "../components/Product/Search"
import InformationBanner from "../components/Home/InformationBanner"

const EmptyProduct = () => {
  return (
    <>
      <Block home>
        <h1>Produit non trouvé</h1>
        <Alert
          severity='warning'
          className='fr-mb-2w'
          title='Le code saisi n’existe pas ou n’est pas dans notre base'
          description='Le code-barres saisi ne correspond à aucun produit référencé. Il se peut que la marque ne l’ait pas encore enregistré ou n’ait pas encore utilisé le portail.'
        />
        <Search />
        <Alert
          className='fr-mt-2w'
          severity='info'
          title='Pour rappel'
          description='Le contenu du portail d’affichage environnemental est fourni par les marques textiles. Comme le service vient tout juste d’être lancé, il se peut que certains produits ne soient pas encore disponibles lors de votre recherche.'
        />
      </Block>
      <Block>
        <InformationBanner />
      </Block>
    </>
  )
}

export default EmptyProduct

import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import Search from "../components/Product/Search"

const EmptyProduct = () => {
  return (
    <Block>
      <h1>Produit non trouvé</h1>
      <Alert
        severity='warning'
        title='Le code saisi n’existe pas ou n’est pas dans notre base'
        description={
          <>
            <p>
              Le code-barres saisi ne correspond à aucun produit référencé. Il se peut que la marque ne l’ait pas encore
              enregistré ou n’ait pas encore utilisé le portail.
            </p>
            <br />
            <p>
              Pour rappel, le contenu du portail d’affichage environnemental est fourni par les marques textiles. Comme
              le service vient tout juste d’être lancé, il se peut que certains produits ne soient pas encore
              disponibles lors de votre recherche.
            </p>
          </>
        }
      />
      <Search />
    </Block>
  )
}

export default EmptyProduct

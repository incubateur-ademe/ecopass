import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import ExplanationBanner from "../components/Home/ExplanationBanner"
import ProductNotFound from "../components/Home/ProductNotFound"

const EmptyProduct = () => {
  return (
    <>
      <Block type='yellow'>
        <h1>Produit non trouvé</h1>
        <Alert
          severity='warning'
          className='fr-mb-2w'
          title='Le code saisi n’existe pas ou n’est pas dans notre base'
          description="Le code-barres saisi ne correspond à aucun produit référencé. Il se peut que la marque ne l’ait pas encore enregistré ou n’ait pas encore utilisé le portail. Êtes-vous sûr d'avoir pris un vêtement et d'avoir saisi le code-barres présent sur l’étiquette de référence ?"
        />
        <ProductNotFound />
      </Block>
      <Block>
        <ExplanationBanner />
      </Block>
    </>
  )
}

export default EmptyProduct

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
          description="Le code-barres saisi ne correspond à aucun produit référence. Il se peut que la marque ne l’ait pas encore enregistré ou n’ai pas encore utilisé le portail. Etes-vous sûr d'avoir pris un vêtement, et saisi le code à barres présent sur la taille de référence ?"
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

import Block from "../components/Block/Block"
import AllDocs from "../components/Documentation/AllDocs"

const Documentation = () => (
  <>
    <Block>
      <h1>Documentation du format CSV</h1>
      <p>
        Pour importer vos produits sur le portail de l'Affichage environnemental, vous devez fournir un fichier CSV.
      </p>
      <p>
        Ce dernier peut comporter des valeurs en français, anglais, ou si vous utilisez déjà l'API Ecobalyse, les
        valeurs de cette dernière.
      </p>
    </Block>
    <Block noMargin>
      <AllDocs />
    </Block>
  </>
)

export default Documentation

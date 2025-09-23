import Link from "next/link"
import Block from "../components/Block/Block"
import AllDocs from "../components/Documentation/AllDocs"

const Documentation = () => (
  <>
    <Block>
      <h1>Documentation de la déclaration de l'affichage environnemental</h1>
      <p>
        Pour importer vos produits sur le portail de l'Affichage environnemental, vous devez fournir un fichier CSV ou
        Excel.
      </p>
      <p>
        Pour votre fichier Excel, vous pouvez{" "}
        <Link href='/exemple/exemple.xlsx' className='fr-link' prefetch={false}>
          télécharger notre template
        </Link>
        , qui contient une liste des valeurs autorisées
      </p>
      <p>
        Pour générer votre fichier CSV, vous pouvez utiliser des valeurs en français, anglais, ou si vous utilisez déjà
        l'API Ecobalyse, les valeurs de cette dernière.
      </p>
    </Block>
    <Block noMargin>
      <AllDocs />
    </Block>
  </>
)

export default Documentation

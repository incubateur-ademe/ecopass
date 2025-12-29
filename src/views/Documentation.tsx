import Link from "next/link"
import Block from "../components/Block/Block"
import AllDocs from "../components/Documentation/AllDocs"
import Default from "../components/Documentation/Default"

const Documentation = () => (
  <>
    <Block>
      <h1>Documentation de la déclaration de du coût environnemental</h1>
      <p>
        Pour importer vos produits sur le portail de l'Affichage environnemental, vous devez fournir un fichier CSV ou
        Excel.
      </p>
      <p>
        Pour votre fichier Excel, vous pouvez{" "}
        <Link href='/exemple/exemple.xlsx' className='fr-link' prefetch={false}>
          télécharger notre template
        </Link>
        , qui contient une liste des valeurs autorisées.
      </p>
      <p>
        Pour générer votre fichier CSV, vous pouvez utiliser des valeurs en français, anglais, ou si vous utilisez déjà
        l'API Ecobalyse, les valeurs de cette dernière.
      </p>
      <p>
        Lorsqu'une valeur optionnelle n'est pas fournie, la valeur par défaut utilisée dépend de la catégorie du
        produit. Vous pouvez retrouver ces valeurs dans{" "}
        <Link href='#default' className='fr-link'>
          ce tableau
        </Link>
        .
      </p>
    </Block>
    <Block>
      <h2>Format du fichier de déclaration</h2>
      <AllDocs />
    </Block>
    <Block>
      <h2>Valeurs par défaut</h2>
      <Default />
    </Block>
  </>
)

export default Documentation

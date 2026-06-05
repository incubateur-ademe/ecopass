import Button from "@codegouvfr/react-dsfr/Button"
import { ecobalyseVersion } from "../../utils/ecobalyse/config"
import Link from "next/link"

const En = () => {
  return (
    <>
      <Button className='fr-mb-2w' linkProps={{ href: "/exemple/exemple-en.csv" }}>
        Download the example file
      </Button>
      <h2>Columns</h2>
      <h3>Product information</h3>
      <p>
        For optional fields, if the value is not defined, the <Link href='#default'>default values</Link> of Ecobalyse
        will be used.
      </p>
      <ul>
        <li>
          <p>
            <b>GTINs/EANs</b> : all GTIN (or EAN) codes of the product, separated by semicolon. These codes must consist
            of 8 or 13 digits. If you don't use GTIN codes, please{" "}
            <Link
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              contact us.
            </Link>
          </p>
        </li>
        <li>
          <p>
            <b>Référence interne</b> : reference used internally for your product. If you don't have one, you can use
            the main GTIN (or EAN).
          </p>
        </li>
        <li>
          <p>
            <b>Marque ID</b> (optional): product brand id, you can find it on your{" "}
            <Link href='/organisation'>organization page</Link>.
          </p>
          <p className='fr-hint-text'>If the value is not defined, the default brand will be used.</p>
        </li>
        <li>
          <p>
            <b>Score</b> (optional): Ecobalyse score (version {ecobalyseVersion}), if you have calculated it. Warning:
            if it is different from our calculation, the product will be flagged as an error.
          </p>
          <p className='fr-hint-text'>If the value is not defined, the calculated score will be used.</p>
        </li>
        <li>
          <p>
            <b>Catégorie</b>: product type to choose from the following list:
          </p>
          <ul>
            <li>
              <p>Shirt</p>
            </li>
            <li>
              <p>Jeans</p>
            </li>
            <li>
              <p>Dress / Skirt</p>
            </li>
            <li>
              <p>Coat / Jacket</p>
            </li>
            <li>
              <p>Pants</p>
            </li>
            <li>
              <p>Sweater</p>
            </li>
            <li>
              <p>T-shirt</p>
            </li>
            <li>
              <p>Socks</p>
            </li>
            <li>
              <p>Woven boxer</p>
            </li>
            <li>
              <p>Knitted boxer</p>
            </li>
            <li>
              <p>Swimsuit</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Masse (en kg)</b>: mass of the finished product, in kilograms (min: 0.01 kg).
          </p>
        </li>
        <li>
          <p>
            <b>Remanufacturé</b> (optional): is the product remanufactured? Yes/No.
          </p>
        </li>
        <li>
          <p>
            <b>Nombre de références</b> (optional): number of references in the brand's catalog (min: 1, max: 999999).
          </p>
        </li>
        <li>
          <p>
            <b>Prix (en euros, TTC)</b> (optional): product price, in Euros (€), VAT included (min: 1).
          </p>
        </li>
        <li>
          <p>
            <b>Taille de l'entreprise</b> (optional): type of company and service offer:
          </p>
          <ul>
            <li>
              <p>Small company</p>
            </li>
            <li>
              <p>Large company with repair service</p>
            </li>
            <li>
              <p>Large company without repair service</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Origine de filature</b> (optional): country for the spinning stage.
          </p>
          <p className='fr-hint-text'>
            If not defined, the country of the most represented material in the mix will be used.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de tissage/tricotage</b> (optional): country for the weaving/knitting stage. Mandatory if the
            product is not upcycled.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de l'ennoblissement/impression</b> (optional): country for the finishing/printing stage.
            Mandatory if the product is not upcycled.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de confection</b>: country for the manufacturing stage.
          </p>
        </li>
        <li>
          <p>
            <b>Type d'impression</b> (optional): type of printing process performed on the product, to choose from:
          </p>
          <ul>
            <li>
              <p>Fix-washed</p>
            </li>
            <li>
              <p>Pigmentary</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Pourcentage d'impression</b> (optional): percentage of printed surface (1%, 5%, 20%, 50% or 80%).
          </p>
        </li>
        <li>
          <p>
            <b>Délavage</b> (optional): Is there a fading process applied during the manufacturing stage? Yes/No.
          </p>
        </li>
        <li>
          <p>
            <b>Part du transport aérien</b> (optional): percentage of air transport between manufacturing and
            distribution.
          </p>
        </li>
      </ul>
      <br />
      <h3>Declare a batch</h3>
      <p>To declare a batch of products, indicate one line per product in the batch.</p>
      <p>
        Make sure to provide the same common information (GTINs/EANs, Internal Reference, Brand ID, Score, Price, and
        Number of References) on each line.
      </p>
      <p>To redeclare a batch, you must redeclare all products in the batch.</p>
      <br />
      <h3>Declare a multi-component product</h3>
      <p>
        To declare a product with multiple components, you can add the column "Composant principal". This column must be
        "Yes" for the main component and "No" for the others.
      </p>
      <p>
        Make sure to provide the same common information (GTINs/EANs, Internal Reference, Brand ID, Score, Category,
        Price, and Number of References) on each line.
      </p>
      <br />
      <h3>Material information</h3>
      <p>For each material used, add the following columns (up to 16 materials):</p>
      <ul>
        <li>
          <p>
            <b>Matière X</b>: type of material to choose from the following list:
          </p>
          <ul>
            <li>
              <p>Elastane</p>
            </li>
            <li>
              <p>Acrylic</p>
            </li>
            <li>
              <p>Jute</p>
            </li>
            <li>
              <p>Polypropylene</p>
            </li>
            <li>
              <p>Polyester</p>
            </li>
            <li>
              <p>Recycled polyester</p>
            </li>
            <li>
              <p>Nylon</p>
            </li>
            <li>
              <p>Linen</p>
            </li>
            <li>
              <p>Default wool</p>
            </li>
            <li>
              <p>New supply chain wool</p>
            </li>
            <li>
              <p>Cotton</p>
            </li>
            <li>
              <p>Organic cotton</p>
            </li>
            <li>
              <p>Hemp</p>
            </li>
            <li>
              <p>Viscose</p>
            </li>
            <li>
              <p>Recycled cotton (post-consumer waste)</p>
            </li>
            <li>
              <p>Recycled cotton (production waste)</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Matière X pourcentage</b>: Share of the product that this material represents, in percentage.
          </p>
        </li>
        <li>
          <p>
            <b>Matière X origine</b> (optional): country or region of origin of the material.
          </p>
        </li>
      </ul>
      <p>
        Replace <b>X</b> with a number from 1 to 16 (e.g., Matière 1, Matière 1 pourcentage, Matière 1 origine, Matière
        2…).
      </p>
      <br />
      <h3>Accessory information</h3>
      <p>
        <b>Warning</b>: if you don't have any accessories, you must fill these fields with the value 0.
        <br />
        Otherwise, default accessories will be applied.
      </p>
      <ul>
        <li>
          <p>
            <b>Quantité de zip long</b>: Long zipper quantity
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de zip court</b>: Short zipper quantity
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de bouton en plastique</b>: Plastic button quantity
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de bouton en métal</b>: Metal button quantity
          </p>
        </li>
      </ul>
      <br />
      <h3>Countries</h3>
      <p>The list of available countries is as follows:</p>
      <ul>
        <li>
          <p>Africa</p>
        </li>
        <li>
          <p>Asia</p>
        </li>
        <li>
          <p>Bangladesh</p>
        </li>
        <li>
          <p>Cambodia</p>
        </li>
        <li>
          <p>China</p>
        </li>
        <li>
          <p>Eastern Europe</p>
        </li>
        <li>
          <p>France</p>
        </li>
        <li>
          <p>India</p>
        </li>
        <li>
          <p>Latin America</p>
        </li>
        <li>
          <p>Middle East</p>
        </li>
        <li>
          <p>Morocco</p>
        </li>
        <li>
          <p>Myanmar</p>
        </li>
        <li>
          <p>North America</p>
        </li>
        <li>
          <p>Oceania</p>
        </li>
        <li>
          <p>Pakistan</p>
        </li>
        <li>
          <p>Tunisia</p>
        </li>
        <li>
          <p>Turkey</p>
        </li>
        <li>
          <p>Vietnam</p>
        </li>
        <li>
          <p>Western Europe</p>
        </li>
      </ul>
    </>
  )
}

export default En

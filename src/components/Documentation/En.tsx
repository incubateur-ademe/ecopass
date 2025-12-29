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
      <ul>
        <li>
          <b>GTINs/EANs</b> : all GTIN (or EAN) codes of the product, separated by semi colon. These codes must consist
          of 8 or 13 digits.
        </li>
        <li>
          <b>Référence interne</b> : reference used internally for your product. If you don't have one, you can use the
          main GTIN (or EAN).
        </li>
        <li>
          <b>Marque ID</b> (optional): product brand id, you can find it on your{" "}
          <Link href='/organisation'>organization page</Link> .
        </li>
        <li>
          <b>Score</b> (optional): Ecobalyse score (version {ecobalyseVersion}), if you have calculated it. Warning: if
          it is different from our calculation, the product will be flagged as an error.
          <p className='fr-hint-text'>If not defined, the calculated score will be used.</p>
        </li>
        <li>
          <b>Catégorie</b>: product type to choose from the following list:
          <ul>
            <li>Shirt</li>
            <li>Jeans</li>
            <li>Dress / Skirt</li>
            <li>Coat / Jacket</li>
            <li>Pants</li>
            <li>Sweater</li>
            <li>T-shirt</li>
            <li>Socks</li>
            <li>Woven boxer</li>
            <li>Knitted boxer</li>
            <li>Swimsuit</li>
          </ul>
        </li>
        <li>
          <b>Masse (en kg)</b>: mass of the finished product, in kilograms (min: 0.01 kg).
        </li>
        <li>
          <b>Remanufacturé</b> (optional): is the product remanufactured? Yes/No.
        </li>
        <li>
          <b>Nombre de références</b> (optional): number of references in the brand's catalog (min: 1, max: 999999).
        </li>
        <li>
          <b>Prix (en euros, TTC)</b> (optional): product price, in Euros (€), VAT included (min: 1).
        </li>
        <li>
          <b>Taille de l'entreprise</b> (optional): type of company and service offer:
          <ul>
            <li>Small company</li>
            <li>Large company with repair service</li>
            <li>Large company without repair service</li>
          </ul>
        </li>
        <li>
          <b>Origine de filature</b> (optional): country for the spinning stage.
          <p className='fr-hint-text'>
            If not defined, the country of the most represented material in the mix will be used.
          </p>
        </li>
        <li>
          <b>Origine de tissage/tricotage</b> (optional): country for the weaving/knitting stage. Mandatory if the
          product is not upcycled.
        </li>
        <li>
          <b>Origine de l'ennoblissement/impression</b> (optional): country for the finishing/printing stage. Mandatory
          if the product is not upcycled.
        </li>
        <li>
          <b>Origine de confection</b>: country for the manufacturing stage.
        </li>
        <li>
          <b>Type d'impression</b> (optional): type of printing process performed on the product, to choose from:
          <ul>
            <li>Fix-washed</li>
            <li>Pigmentary</li>
          </ul>
        </li>
        <li>
          <b>Pourcentage d'impression</b> (optional): percentage of printed surface (1%, 5%, 20%, 50% or 80%).
        </li>
        <li>
          <b>Délavage</b> (optional): Is there a fading process applied during the manufacturing stage? Yes/No.
        </li>
        <li>
          <b>Part du transport aérien</b> (optional): percentage of air transport between manufacturing and
          distribution.
        </li>
      </ul>
      <br />
      <h3>Material information</h3>
      <p>For each material used, add the following columns (up to 16 materials):</p>
      <ul>
        <li>
          <b>Matière X</b>: type of material to choose from the following list:
          <ul>
            <li>Elastane</li>
            <li>Acrylic</li>
            <li>Jute</li>
            <li>Polypropylene</li>
            <li>Polyester</li>
            <li>Recycled polyester</li>
            <li>Nylon</li>
            <li>Linen</li>
            <li>Default wool</li>
            <li>New supply chain wool</li>
            <li>Cotton</li>
            <li>Organic cotton</li>
            <li>Hemp</li>
            <li>Viscose</li>
            <li>Recycled cotton (post-consumer waste)</li>
            <li>Recycled cotton (production waste)</li>
          </ul>
        </li>
        <li>
          <b>Matière X pourcentage</b>: Share of the product that this material represents, in percentage.
        </li>
        <li>
          <b>Matière X origine</b> (optional): country or region of origin of the material.
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
          <b>Quantité de zip long</b>: Long zipper quantity
        </li>
        <li>
          <b>Quantité de zip court</b>: Short zipper quantity
        </li>
        <li>
          <b>Quantité de bouton en plastique</b>: Plastic button quantity
        </li>
        <li>
          <b>Quantité de bouton en métal</b>: Metal button quantity
        </li>
      </ul>
      <br />
      <h3>Countries</h3>
      <p>The list of available countries is as follows:</p>
      <ul>
        <li>Africa</li>
        <li>Asia</li>
        <li>Bangladesh</li>
        <li>Cambodia</li>
        <li>China</li>
        <li>Eastern Europe</li>
        <li>France</li>
        <li>India</li>
        <li>Latin America</li>
        <li>Middle East</li>
        <li>Morocco</li>
        <li>Myanmar</li>
        <li>North America</li>
        <li>Oceania</li>
        <li>Pakistan</li>
        <li>Tunisia</li>
        <li>Turkey</li>
        <li>Vietnam</li>
        <li>Western Europe</li>
      </ul>
    </>
  )
}

export default En

import { Business, ProductCategory } from "../../types/Product"
import Table from "../Table/Table"

const Default = () => {
  return (
    <div id='default'>
      <Table
        fixed
        caption='Valeurs par défaut'
        noCaption
        headers={["Catégorie", "Accessoires", "Prix", "Type d'entreprise", "Nombre de références"]}
        data={[
          [ProductCategory.CaleçonTissé, "2 boutons en plastique", "4€", Business.WithoutServices, "100 000"],
          [ProductCategory.Chaussettes, "Aucun", "4€", Business.WithoutServices, "100 000"],
          [ProductCategory.Chemise, "11 boutons en plastique", "15€", Business.WithoutServices, "100 000"],
          [ProductCategory.Jean, "1 bouton en métal", "20€", Business.WithoutServices, "100 000"],
          [ProductCategory.JupeRobe, "1 zip court", "15€", Business.WithoutServices, "100 000"],
          [ProductCategory.MaillotDeBain, "1 bouton en plastique", "15€", Business.WithoutServices, "100 000"],
          [ProductCategory.ManteauVeste, "5 boutons en plastique", "40€", Business.WithoutServices, "100 000"],
          [ProductCategory.PantalonShort, "1 bouton en métal", "20€", Business.WithoutServices, "100 000"],
          [ProductCategory.Pull, "5 boutons en plastique", "20€", Business.WithoutServices, "100 000"],
          [ProductCategory.BoxerSlipTricoté, "Aucun", "4€", Business.WithoutServices, "100 000"],
          [ProductCategory.TShirtPolo, "3 boutons en plastique", "10€", Business.WithoutServices, "100 000"],
        ]}
      />
      <p>
        Pour la part du transport aérien, il découle de l'origine géographique de la confection et du coefficient de
        durabilité. Cette part n'est considérée que lorsque la confection est réalisée hors Europe ou Turquie. (Il est
        considéré que l'entrepôt est en France.) La part de transport aérien (par rapport au transport "aérien +
        terrestre + maritime)" est considérée comme suit pour la valeur par défaut :
      </p>
      <ul>
        <li>Seulement pour le transport entre la confection et l'entrepôt</li>
        <li>
          Si le coefficient de durabilité est supérieur ou égal à 1{" "}
          <ul>
            <li>0% pour les pays situés en Europe ou Turquie,</li>
            <li>33% pour les autres pays.</li>
          </ul>
        </li>
        <li>
          Si le coefficient de durabilité est strictement inférieur à 1{" "}
          <ul>
            <li>0% pour les pays situés en Europe ou Turquie,</li>
            <li>100% pour les autres pays.</li>
          </ul>
        </li>
      </ul>
      <p>
        Le pays de production (et donc de filature) par défaut des matières est toujours la Chine, sauf pour le coton
        recyclé, le polypropène, le nylon et le lin.
      </p>
    </div>
  )
}

export default Default

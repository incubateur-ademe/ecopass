import Button from "@codegouvfr/react-dsfr/Button"
import { ecobalyseVersion } from "../../utils/ecobalyse/config"

const Fr = () => {
  return (
    <>
      <Button className='fr-mb-2w' linkProps={{ href: "/exemple/exemple.csv" }}>
        Télécharger le fichier d'exemple
      </Button>
      <h2>Colonnes</h2>
      <h3>Informations produit</h3>
      <ul>
        <li>
          <b>GTINs/EANs</b> : tout les codes GTIN (ou EAN) du produit, séparés par des points virgules. Ces derniers
          doivent être composés de 8 ou 13 chiffres.
        </li>
        <li>
          <b>Référence interne</b> : réference utilisé en interne pour votre produit. Si vous n'en avez pas, vous pouvez
          utiliser le GTIN (ou l'EAN) principal.
        </li>
        <li>
          <b>Marque</b> (optionnel) : marque du produit.
        </li>
        <li>
          <b>Score</b> (optionnel) : score Ecobalyse (version {ecobalyseVersion}), si vous l'avez calculé. Attention, si
          il est différent de notre calcul, le produit sera en erreur.
          <p className='fr-hint-text'>si pas de valeur définie, on utilise le score calculé.</p>
        </li>
        <li>
          <b>Catégorie</b> : type de produit à choisir dans la liste suivante :
          <ul>
            <li>Chemise</li>
            <li>Jean</li>
            <li>Jupe / Robe</li>
            <li>Manteau / Veste</li>
            <li>Pantalon / Short</li>
            <li>Pull</li>
            <li>T-shirt / Polo</li>
            <li>Chaussettes</li>
            <li>Caleçon (tissé)</li>
            <li>Boxer / Slip (tricoté)</li>
            <li>Maillot de bain</li>
          </ul>
        </li>
        <li>
          <b>Masse (en kg)</b> : masse du produit fini, en kilogrammes (min : 0,01 kg).
        </li>
        <li>
          <b>Remanufacturé</b> (optionnel) : est ce que le produit est remanufacturé ? Oui/Non.
        </li>
        <li>
          <b>Nombre de références</b> (optionnel) : nombre de références au catalogue de la marque (min : 1, max :
          999999).
        </li>
        <li>
          <b>Prix (en euros, TTC)</b> (optionnel) : prix du produit, en Euros (€) (min : 1, max : 1000).
        </li>
        <li>
          <b>Taille de l'entreprise</b> (optionnel) : type d'entreprise et d'offre de services :
          <p className='fr-hint-text'>
            si pas de valeur définie, on utilise "Grande entreprise sans service de réparation"
          </p>
          <ul>
            <li>TPE/PME</li>
            <li>Grande entreprise avec service de réparation</li>
            <li>Grande entreprise sans service de réparation</li>
          </ul>
        </li>
        <li>
          <b>Origine de filature</b> (optionnel) : pays pour l'étape de filature.
          <p className='fr-hint-text'>
            si pas de valeur définie, on utilise celui de production de la matière la plus représentée dans le mix.
          </p>
        </li>
        <li>
          <b>Origine de tissage/tricotage</b> (optionnel) : pays pour l'étape de tissage/tricotage. Requis si le produit
          n'est pas remanufacturé.
        </li>
        <li>
          <b>Origine de l'ennoblissement/impression</b> (optionnel) : pays pour l'étape d'ennoblissement/impression.
          Requis si le produit n'est pas remanufacturé.
        </li>
        <li>
          <b>Origine de confection</b> : pays pour l'étape de confection.
        </li>
        <li>
          <b>Type d'impression</b> (optionnel) : type de procédé d'impression effectuée sur le produit à choisir dans la
          liste suivante :
          <ul>
            <li>Fixé-lavé</li>
            <li>Pigmentaire</li>
          </ul>
        </li>
        <li>
          <b>Pourcentage d'impression</b> (optionnel) : pourcentage de surface imprimée (1%, 5%, 20%, 50% ou 80%).
        </li>
        <li>
          <b>Délavage</b> (optionnel) : Y a t'il application d'un procédé de délavage pour l'étape de confection du
          produit ? Oui/Non.
        </li>
        <li>
          <b>Part du transport aérien</b> (optionnel) : pourcentage du transport aérien entre l'étape de confection et
          l'étape de distribution.
        </li>
      </ul>
      <br />
      <h3>Information sur les matières</h3>
      <p>Pour chaque matière utilisée, ajoutez les colonnes suivantes (jusqu’à 16 matières) :</p>
      <ul>
        <li>
          <b>Matière X</b> : type de matière à choisir dans la liste suivante :
          <ul>
            <li>Elasthane (Lycra)</li>
            <li>Acrylique</li>
            <li>Jute</li>
            <li>Polypropylène</li>
            <li>Polyester</li>
            <li>Polyester recyclé</li>
            <li>Nylon</li>
            <li>Lin</li>
            <li>Laine par défaut</li>
            <li>Laine nouvelle filière</li>
            <li>Coton</li>
            <li>Coton biologique</li>
            <li>Chanvre</li>
            <li>Viscose</li>
            <li>Coton recyclé (déchets post-consommation)</li>
            <li>Coton recyclé (déchets de production)</li>
          </ul>
        </li>
        <li>
          <b>Matière X pourcentage</b> : Part du produit que cette matière représente en pourcentage.
        </li>
        <li>
          <b>Matière X origine</b> (optionnel) : pays ou région d’origine de la matière.
        </li>
      </ul>
      <p>
        Remplacez <b>X</b> par un nombre de 1 à 16 (ex : Matière 1, Matière 1 pourcentage, Matière 1 origine, Matière
        2…).
      </p>
      <br />
      <h3>Informations sur les accessoires</h3>
      <p>
        <b>Attention</b>, si vous n'avez pas d'accessoires, vous devez remplir ces champs avec la valeur 0.
        <br />
        Dans le cas contraire les accesoires par défaut seront appliqués.
      </p>
      <ul>
        <li>
          <b>Quantité de zip long</b>
        </li>
        <li>
          <b>Quantité de zip court</b>
        </li>
        <li>
          <b>Quantité de bouton en plastique</b>
        </li>
        <li>
          <b>Quantité de bouton en métal</b>
        </li>
      </ul>
      <br />
      <h3>Pays</h3>
      <p>La liste des pays disponibles est la suivante :</p>
      <ul>
        <li>Région - Afrique</li>
        <li>Région - Amérique Latine</li>
        <li>Région - Amérique du nord</li>
        <li>Région - Asie</li>
        <li>Région - Europe de l'Est</li>
        <li>Région - Europe de l'Ouest</li>
        <li>Région - Moyen-Orient</li>
        <li>Région - Océanie</li>
        <li>Bangladesh</li>
        <li>Cambodge</li>
        <li>Chine</li>
        <li>France</li>
        <li>Inde</li>
        <li>Maroc</li>
        <li>Myanmar</li>
        <li>Pakistan</li>
        <li>Tunisie</li>
        <li>Turquie</li>
        <li>Vietnam</li>
      </ul>
    </>
  )
}

export default Fr

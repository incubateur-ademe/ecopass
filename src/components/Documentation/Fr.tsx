import Button from "@codegouvfr/react-dsfr/Button"
import { ecobalyseVersion } from "../../utils/ecobalyse/config"
import Link from "next/link"

const Fr = () => {
  return (
    <>
      <Button className='fr-mb-2w' linkProps={{ href: "/exemple/exemple.csv" }}>
        Télécharger le fichier d'exemple
      </Button>
      <h2>Colonnes</h2>
      <h3>Informations produit</h3>
      <p>
        Pour les champs optionnels, si la valeur n'est pas définie on utilise les{" "}
        <Link href='#default'>valeurs par défaut</Link> d'Ecobalyse.
      </p>
      <ul>
        <li>
          <p>
            <b>GTINs/EANs</b> : tous les codes GTIN (ou EAN) du produit, séparés par des points virgules. Ces derniers
            doivent être composés de 8 ou 13 chiffres. Si vous n'utilisez pas de codes GTIN, veuillez{" "}
            <Link
              href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'
              target='_blank'
              rel='noopener noreferrer'>
              nous contacter.
            </Link>
          </p>
        </li>
        <li>
          <p>
            <b>Référence interne</b> : référence utilisée en interne pour votre produit. Si vous n'en avez pas, vous
            pouvez utiliser le GTIN (ou l'EAN) principal.
          </p>
        </li>
        <li>
          <p>
            <b>Marque ID</b> (optionnel) : id de la marque du produit, à retrouver dans votre page{" "}
            <Link href='/organisation'>organisation</Link>.
          </p>
          <p className='fr-hint-text'>Si la valeur n'est pas définie, on utilise la marque par défaut.</p>
        </li>
        <li>
          <p>
            <b>Score</b> (optionnel) : score Ecobalyse (version {ecobalyseVersion}), si vous l'avez calculé. Attention,
            s'il est différent de notre calcul, le produit sera en erreur.
          </p>
          <p className='fr-hint-text'>Si la valeur n'est pas définie, on utilise le score calculé.</p>
        </li>
        <li>
          <p>
            <b>Catégorie</b> : type de produit à choisir dans la liste suivante :
          </p>
          <ul>
            <li>
              <p>Chemise</p>
            </li>
            <li>
              <p>Jean</p>
            </li>
            <li>
              <p>Jupe / Robe</p>
            </li>
            <li>
              <p>Manteau / Veste</p>
            </li>
            <li>
              <p>Pantalon / Short</p>
            </li>
            <li>
              <p>Pull</p>
            </li>
            <li>
              <p>T-shirt / Polo</p>
            </li>
            <li>
              <p>Chaussettes</p>
            </li>
            <li>
              <p>Caleçon (tissé)</p>
            </li>
            <li>
              <p>Boxer / Slip (tricoté)</p>
            </li>
            <li>
              <p>Maillot de bain</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Masse (en kg)</b> : masse du produit fini, en kilogrammes (min : 0,01 kg).
          </p>
        </li>
        <li>
          <p>
            <b>Remanufacturé</b> (optionnel) : est-ce que le produit est remanufacturé ? Oui/Non.
          </p>
        </li>
        <li>
          <p>
            <b>Nombre de références</b> (optionnel) : nombre de références au catalogue de la marque (min : 1, max :
            999999).
          </p>
        </li>
        <li>
          <p>
            <b>Prix (en euros, TTC)</b> (optionnel) : prix du produit, en Euros (€) (min : 1).
          </p>
        </li>
        <li>
          <p>
            <b>Taille de l'entreprise</b> (optionnel) : type d'entreprise et d'offre de services :
          </p>
          <ul>
            <li>
              <p>TPE/PME</p>
            </li>
            <li>
              <p>Grande entreprise avec service de réparation</p>
            </li>
            <li>
              <p>Grande entreprise sans service de réparation</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Origine de filature</b> (optionnel) : pays pour l'étape de filature.
          </p>
          <p className='fr-hint-text'>
            si pas de valeur définie, on utilise celui de production de la matière la plus représentée dans le mix.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de tissage/tricotage</b> (optionnel) : pays pour l'étape de tissage/tricotage. Requis si le
            produit n'est pas remanufacturé.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de l'ennoblissement/impression</b> (optionnel) : pays pour l'étape d'ennoblissement/impression.
            Requis si le produit n'est pas remanufacturé.
          </p>
        </li>
        <li>
          <p>
            <b>Origine de confection</b> : pays pour l'étape de confection.
          </p>
        </li>
        <li>
          <p>
            <b>Type d'impression</b> (optionnel) : type de procédé d'impression effectuée sur le produit à choisir dans
            la liste suivante :
          </p>
          <ul>
            <li>
              <p>Fixé-lavé</p>
            </li>
            <li>
              <p>Pigmentaire</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Pourcentage d'impression</b> (optionnel) : pourcentage de surface imprimée (1%, 5%, 20%, 50% ou 80%).
          </p>
        </li>
        <li>
          <p>
            <b>Délavage</b> (optionnel) : Y a-t-il application d'un procédé de délavage pour l'étape de confection du
            produit ? Oui/Non.
          </p>
        </li>
        <li>
          <p>
            <b>Part du transport aérien</b> (optionnel) : pourcentage du transport aérien entre l'étape de confection et
            l'étape de distribution.
          </p>
        </li>
      </ul>
      <br />
      <h3>Déclarer un lot</h3>
      <p>Pour déclarer un lot de produits, indiquez une ligne par produit du lot.</p>
      <p>
        Attention à bien indiquer les mêmes informations communes (GTINs/EANs, Référence interne, Marque ID, Score, Prix
        et Nombre de références) sur chaque ligne.
      </p>
      <p>Pour redéclarer un lot, il faut redéclarer tous les produits du lot.</p>
      <br />
      <h3>Déclarer un produit multi composant</h3>
      <p>
        Pour déclarer un produit avec plusieurs composants, vous pouvez rajouter la colonne "Composant principal". Cette
        dernière doit valoir "Oui" pour le composant principal et "Non" pour les autres.
      </p>
      <p>
        Attention à bien indiquer les mêmes informations communes (GTINs/EANs, Référence interne, Marque ID, Score,
        Catégorie, Prix et Nombre de références) sur chaque ligne.
      </p>
      <br />
      <h3>Information sur les matières</h3>
      <p>Pour chaque matière utilisée, ajoutez les colonnes suivantes (jusqu’à 16 matières) :</p>
      <ul>
        <li>
          <p>
            <b>Matière X</b> : type de matière à choisir dans la liste suivante :
          </p>
          <ul>
            <li>
              <p>Elasthane (Lycra)</p>
            </li>
            <li>
              <p>Acrylique</p>
            </li>
            <li>
              <p>Jute</p>
            </li>
            <li>
              <p>Polypropylène</p>
            </li>
            <li>
              <p>Polyester</p>
            </li>
            <li>
              <p>Polyester recyclé</p>
            </li>
            <li>
              <p>Nylon</p>
            </li>
            <li>
              <p>Lin</p>
            </li>
            <li>
              <p>Laine par défaut</p>
            </li>
            <li>
              <p>Laine nouvelle filière</p>
            </li>
            <li>
              <p>Coton</p>
            </li>
            <li>
              <p>Coton biologique</p>
            </li>
            <li>
              <p>Chanvre</p>
            </li>
            <li>
              <p>Viscose</p>
            </li>
            <li>
              <p>Coton recyclé (déchets post-consommation)</p>
            </li>
            <li>
              <p>Coton recyclé (déchets de production)</p>
            </li>
          </ul>
        </li>
        <li>
          <p>
            <b>Matière X pourcentage</b> : Part du produit que cette matière représente en pourcentage.
          </p>
        </li>
        <li>
          <p>
            <b>Matière X origine</b> (optionnel) : pays ou région d’origine de la matière.
          </p>
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
          <p>
            <b>Quantité de zip long</b>
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de zip court</b>
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de bouton en plastique</b>
          </p>
        </li>
        <li>
          <p>
            <b>Quantité de bouton en métal</b>
          </p>
        </li>
      </ul>
      <br />
      <h3>Pays</h3>
      <p>La liste des pays disponibles est la suivante :</p>
      <ul>
        <li>
          <p>Région - Afrique</p>
        </li>
        <li>
          <p>Région - Amérique Latine</p>
        </li>
        <li>
          <p>Région - Amérique du nord</p>
        </li>
        <li>
          <p>Région - Asie</p>
        </li>
        <li>
          <p>Région - Europe de l'Est</p>
        </li>
        <li>
          <p>Région - Europe de l'Ouest</p>
        </li>
        <li>
          <p>Région - Moyen-Orient</p>
        </li>
        <li>
          <p>Région - Océanie</p>
        </li>
        <li>
          <p>Bangladesh</p>
        </li>
        <li>
          <p>Cambodge</p>
        </li>
        <li>
          <p>Chine</p>
        </li>
        <li>
          <p>France</p>
        </li>
        <li>
          <p>Inde</p>
        </li>
        <li>
          <p>Maroc</p>
        </li>
        <li>
          <p>Myanmar</p>
        </li>
        <li>
          <p>Pakistan</p>
        </li>
        <li>
          <p>Tunisie</p>
        </li>
        <li>
          <p>Turquie</p>
        </li>
        <li>
          <p>Vietnam</p>
        </li>
      </ul>
    </>
  )
}

export default Fr

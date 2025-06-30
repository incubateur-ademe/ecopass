import Button from "@codegouvfr/react-dsfr/Button"

const Ecobalyse = () => {
  return (
    <>
      <Button className='fr-mb-2w' linkProps={{ href: "/exemple/exemple-ecobalyse.csv" }}>
        Télécharger le fichier d'exemple
      </Button>
      <h2>Colonnes</h2>
      <h3>Informations produit</h3>
      <ul>
        <li>
          <b>GTINs/EANs</b> : tout les codes GTIN (ou EAN) du produit, séparés par des virgules. Ces derniers doivent
          être composés de 8 ou 13 chiffres.
        </li>
        <li>
          <b>Référence interne</b> : réference utilisé en interne pour votre produit. Si vous n'en avez pas, vous pouvez
          utiliser le GTIN (ou l'EAN) principal.
        </li>{" "}
        <li>
          <b>Date de mise sur le marché</b> : au format JJ/MM/YY.
        </li>
        <li>
          <b>Marque</b> (optionnel) : marque du produit.
        </li>
        <li>
          <b>Score</b> (optionnel) : score Ecobalyse, si vous l'avez calculé. Attention, si il est différent de notre
          calcul, le produit sera en erreur.
          <p className='fr-hint-text'>si pas de valeur définie, on utilise le score calculé.</p>
        </li>
        <li>
          <b>Type</b> : type de produit à choisir dans la liste suivante :
          <ul>
            <li>chemise</li>
            <li>jean</li>
            <li>jupe</li>
            <li>manteau</li>
            <li>pantalon</li>
            <li>pull</li>
            <li>tshirt</li>
            <li>chaussettes</li>
            <li>calecon</li>
            <li>slip</li>
            <li>maillot-de-bain</li>
          </ul>
        </li>
        <li>
          <b>Masse (en kg)</b> : masse du produit fini, en kilogrammes (min : 0,01 kg).
        </li>
        <li>
          <b>Remanufacturé</b> (optionnel) : est ce que le produit est remanufacturé ? true/false.
        </li>
        <li>
          <b>Nombre de références</b> (optionnel) : nombre de références au catalogue de la marque (min : 1, max :
          999999).
        </li>
        <li>
          <b>Prix (en euros, TTC)</b> (optionnel) : prix du produit, en Euros (€), TTC (min : 1, max : 1000).
        </li>
        <li>
          <b>Taille de l'entreprise</b> (optionnel) : type d'entreprise et d'offre de services :
          <p className='fr-hint-text'>
            si pas de valeur définie, on utilise "Grande entreprise sans service de réparation"
          </p>
          <ul>
            <li>small-business</li>
            <li>large-business-with-services</li>
            <li>large-business-without-services</li>
          </ul>
        </li>
        <li>
          <b>Traçabilité géographique</b> (optionnel) : Traçabilité renforcée ? true/false.
        </li>
        <li>
          <b>Origine de filature</b> (optionnel) : pays pour l'étape de filature.
          <p className='fr-hint-text'>
            si pas de valeur définie, on utilise celui de production de la matière la plus représentée dans le mix.
          </p>
        </li>
        <li>
          <b>Origine de tissage/tricotage</b> (optionnel) : pays pour l'étape de tissage/tricotage.
        </li>
        <li>
          <b>Origine de l'ennoblissement/impression</b> (optionnel) : pays pour l'étape d'ennoblissement/impression.
        </li>
        <li>
          <b>Origine confection</b> (optionnel) : pays pour l'étape de confection.
        </li>
        <li>
          <b>Type d'impression</b> (optionnel) : type de procédé d'impression effectuée sur le produit à choisir dans la
          liste suivante :
          <ul>
            <li>pigment</li>
            <li>substantive</li>
          </ul>
        </li>
        <li>
          <b>Pourcentage d'impression</b> (optionnel) : pourcentage de surface imprimée.
        </li>
        <li>
          <b>Délavage</b> (optionnel) : Y a t'il application d'un procédé de délavage pour l'étape de confection du
          produit ? true/false.
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
            <li>elasthane</li>
            <li>ei-acrylique</li>
            <li>ei-jute-kenaf</li>
            <li>ei-pp</li>
            <li>ei-pet</li>
            <li>ei-pet-r</li>
            <li>ei-pa</li>
            <li>ei-lin</li>
            <li>ei-laine-par-defaut</li>
            <li>ei-laine-nouvelle-filiere</li>
            <li>ei-coton</li>
            <li>ei-coton-organic</li>
            <li>ei-chanvre</li>
            <li>ei-viscose</li>
            <li>coton-rdpc</li>
            <li>coton-rdp</li>
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
      <p>Pour chaque accessoire, ajoutez les colonnes suivantes (jusqu’à 4 accessoires) :</p>
      <ul>
        <li>
          <b>Accessoire X</b> : type d’accessoire à choisir dans la liste suivante :
          <ul>
            <li>86b877ff-0d59-482f-bb34-3ff306b07496 : Zip long</li>
            <li>0e8ea799-9b06-490c-a925-37564746c454 : Zip court</li>
            <li>d56bb0d5-7999-4b8b-b076-94d79099b56a : Bouton en plastique</li>
            <li>0c903fc7-279b-4375-8cfa-ca8133b8e973 : Bouton en métal</li>
          </ul>
        </li>
        <li>
          <b>Accessoire X quantité</b> : quantité d'accessoire dans le produit (min: 1).
        </li>
      </ul>
      <p>
        Remplacez <b>X</b> par un nombre de 1 à 4 (ex : Accessoire 1, Accessoire 1 quantité, Accessoire 2…).
      </p>
      <br />
      <h3>Pays</h3>
      <p>La liste des pays disponibles est la suivante :</p>
      <ul>
        <li>REO</li>
        <li>REE</li>
        <li>RAS</li>
        <li>RAF</li>
        <li>RME</li>
        <li>RLA</li>
        <li>RNA</li>
        <li>ROC</li>
        <li>MM</li>
        <li>BD</li>
        <li>CN</li>
        <li>FR</li>
        <li>IN</li>
        <li>KH</li>
        <li>MA</li>
        <li>PK</li>
        <li>TN</li>
        <li>TR</li>
        <li>VN</li>
      </ul>
    </>
  )
}

export default Ecobalyse

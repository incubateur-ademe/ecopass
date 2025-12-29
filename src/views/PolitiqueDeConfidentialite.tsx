import LegalContainer from "../components/Mentions/LegalContainer"
import Table from "../components/Table/Table"

const PolitiqueDeConfidentialite = () => {
  return (
    <LegalContainer>
      <h1>Politique de confidentialité</h1>
      <p>Mis à jour le 18/11/2025</p>
      <h2>Qui est responsable de la plateforme ?</h2>
      <p>
        La plateforme est sous la responsabilité du Commissariat général au développement durable, représenté par
        monsieur Brice Huet, Commissaire général et délégué interministériel au développement durable.
      </p>
      <h2>Pourquoi traitons-nous des données à caractère personnel ?</h2>
      <p>
        Nous traitons vos données pour permettre aux organismes de réaliser la déclaration d'information sur le coût
        environnemental de leurs produits textiles.
      </p>
      <h2>Quelles sont les données à caractère personnel que nous traitons ?</h2>
      <p>
        Nous ne traitons que les données dont nous avons besoin : nom, prénom, adresse e-mail et entreprise du déclarant
        et entreprise pour laquelle on déclare, mandat ou autorisation.
      </p>
      <h2>Qu'est-ce qui nous autorise à traiter des données à caractère personnel ?</h2>
      <p>
        Nous sommes autorisés à traiter ces données car il s'agit d'une mission d'intérêt public. Vous pouvez la trouver
        à l'article 2 de la loi n°2021-1104 du 22 août 2021 portant lutte contre le dérèglement climatique et
        renforcement de la résilience face à ses effets.
      </p>
      <h2>Pendant combien de temps conservons-nous ces données ?</h2>
      <p>Nous conservons ces données pour une durée de 2 ans à compter du dernier contact.</p>
      <h2>Quels sont vos droits ?</h2>
      <p>Vous disposez des droits suivants concernant vos données à caractère personnel :</p>
      <ul>
        <li>Droit d'information et droit d'accès aux données ;</li>
        <li>Droit de rectification de vos données ;</li>
        <li>Droit d'opposition ;</li>
        <li>Droit à la limitation du traitement de vos données.</li>
      </ul>
      <p>
        Pour exercer ces droits ou pour toute question sur le traitement de vos données, contactez-nous à{" "}
        <a
          target='_blank'
          rel='noopener noreferrer'
          className='fr-link'
          href='mailto:affichage-environnemental@ecobalyse.beta.gouv.fr'>
          affichage-environnemental@ecobalyse.beta.gouv.fr
        </a>
      </p>
      <br />
      <p>Vous pouvez exercer vos droits également en adressant un courrier par voie postale :</p>
      <p>
        Commissariat général au développement durable
        <br />
        Tour Séquoia
        <br />1 place Carpeaux
        <br />
        92800 Puteaux France
      </p>
      <br />
      <p>
        Puisque ce sont des droits personnels, nous ne traiterons votre demande que si nous sommes en mesure de vous
        identifier. Dans le cas où nous ne parvenons pas à vous identifier, nous pouvons être amenés à vous demander une
        preuve de votre identité.
      </p>
      <p>
        Pour vous aider dans votre démarche, vous trouverez un modèle de courrier élaboré par la CNIL ici :{" "}
        <a
          target='_blank'
          rel='noopener noreferrer'
          className='fr-link'
          href='https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces'>
          https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
        </a>
        .
      </p>
      <p>
        Nous nous engageons à répondre dans un délai raisonnable qui ne saurait dépasser 1 mois à compter de la
        réception de votre demande.
      </p>
      <h2>Qui va avoir accès aux données à caractère personnel ?</h2>
      <p>
        Outre les données et informations disponibles en « open-data », les accès aux autres données sont strictement
        encadrés et juridiquement justifiés, notamment les données à caractère personnel des personnes déclarantes. Les
        personnes suivantes vont avoir accès aux données :
      </p>
      <ul>
        <li>
          Les agents habilités au titre de l'article L. 511-7 du code de la consommation et aux agents, chargés de
          l'application du dispositif encadré par le présent décret, affectés à la direction générale de la concurrence,
          de la consommation et de la répression des fraudes, à des fins de contrôle
        </li>
        <li>
          Les agents des ministères chargés de l'environnement et de l'économie et aux agents de l'agence de
          l'environnement et de la maîtrise de l'énergie chargés de mettre en œuvre le dispositif encadré par le présent
          décret, à des fins de production d'indicateurs de suivi de cette politique publique
        </li>
      </ul>
      <p>
        Par ailleurs, certains acteurs traitent les données à caractère personnel seulement pour notre compte (nos
        sous-traitants) :
      </p>
      <Table
        headers={["Partenaire", "Pays destinataire", "Traitement réalisé", "Garanties"]}
        data={[
          [
            "Scalingo",
            "France",
            "Hébergement",
            <a
              key='1'
              target='_blank'
              rel='noopener noreferrer'
              className='fr-link'
              href='https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles'>
              https://scalingo.com/fr/contrat-gestion-traitements-donnees-personnelles
            </a>,
          ],
        ]}
      />
      <h2>Quelles mesures de sécurité mettons-nous en place ?</h2>
      <p>Nous mettons en place plusieurs mesures pour sécuriser les données :</p>
      <ul>
        <li>Stockage des données en base de données ;</li>
        <li>Stockage des mots de passe en base hachée ;</li>
        <li>Cloisonnement des données ;</li>
        <li>Mesures de traçabilité ;</li>
        <li>Surveillance ;</li>
        <li>Protection contre les virus, malwares et logiciels espions ;</li>
        <li>Protection des réseaux ;</li>
        <li>Sauvegarde ;</li>
        <li>Mesures restrictives limitant l'accès physique aux données à caractère personnel.</li>
      </ul>
      <p>
        Nous rappelons également que toute personne qui le souhaite peut déclarer une faille de sécurité ou un
        dysfonctionnement du site.
      </p>
    </LegalContainer>
  )
}

export default PolitiqueDeConfidentialite

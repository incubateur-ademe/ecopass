import Block from "../components/Block/Block"
import Image from "next/image"
import styles from "./Informations.module.css"
import { Highlight } from "@codegouvfr/react-dsfr/Highlight"
import Badge from "@codegouvfr/react-dsfr/Badge"
import Card from "@codegouvfr/react-dsfr/Card"

const Informations = () => {
  return (
    <>
      <Block>
        <h1>Coût environnemental des vêtements : un guide pour tout comprendre</h1>
        <Image className={styles.mainImage} src='/images/information.png' alt='' width={400} height={300} />
      </Block>
      <Block secondary>
        <h2>Comment lire et interpréter le logo ?</h2>
        <div className={styles.section}>
          <div className={styles.logoExample}>
            <Image src='/images/score.png' alt='' width={378} height={188} />
          </div>
          <div className={styles.content}>
            <p>
              A l’image d’un prix (en €), d’une valeur nutritionnelle (en kcal) ou encore d’un score carbone (en kg
              CO2e), <b>le coût environnemental quantifie l’impact de chaque produit</b>.
            </p>
            <Highlight>
              Plus le résultat est élevé, plus le produit a un coût pour l’environnement. Ce résultat est exprimé en «
              points d’impact ».
            </Highlight>
            <p>
              Ce logo n’a pas pour vocation de donner un jugement de valeurs avec un indicateur coloriel. L’objectif
              principal est d’informer le consommateur que chaque achat de vêtement a un impact, un coût pour la
              planète.
            </p>
            <p>Libre à chacun de se donner un « budget planète ». </p>
          </div>
        </div>
      </Block>

      <Block>
        <h2>Pourquoi cet affichage ?</h2>
        <div className={styles.sectionReversed}>
          <Image src='/images/tshirt-2.png' alt='' width={192} height={193} />
          <div>
            <p>
              Dans notre vie quotidienne, la plupart de nos activités et de nos habitudes de consommation ont un impact,
              parfois significatif, sur l’environnement, notamment dans le secteur du textile. En effet, les constats
              sont alarmants :
            </p>
            <Highlight className={styles.highlight}>
              <b>L&apos;industrie textile est devenue l&apos;une des plus polluantes au monde :</b>
            </Highlight>
            <div className={styles.impactList}>
              <div className={styles.impactItem}>
                <div className={styles.impactIcon}>
                  <Image src='/images/informations/climate.svg' alt='' width={60} height={60} />
                </div>
                <ul>
                  <li>
                    Elle est responsable de 2 % à 8 % des émissions mondiales de gaz à effet de serre (source : ADEME);
                  </li>
                  <li>
                    Elle génère désormais plus de gaz à effet de serre que les vols internationaux et le trafic maritime
                    réunis (source : ADEME), et consomme 4 % de l’eau potable du monde (source : Oxfam);
                  </li>
                  <li>
                    Chaque année, ce sont 240 000 tonnes de microfibres plastiques qui sont relâchées dans les océans du
                    monde entier en raison de la production, de l’entretien, puis de la fin de vie de nos vêtements
                    synthétiques (source : ADEME);
                  </li>
                </ul>
              </div>

              <div className={styles.impactItem}>
                <div className={styles.impactIcon}>
                  <Image src='/images/informations/water.svg' alt='' width={60} height={60} />
                </div>
                <ul>
                  <li>
                    20 % de la pollution des eaux est imputable à la teinture ou à la finition et au traitement des
                    textiles d'habillement dans le monde (source : Parlement européen);
                  </li>
                  <li>
                    7 500 litres, c’est le volume d’eau nécessaire pour fabriquer un jean en coton, soit l’équivalent de
                    l’eau bue par un être humain pendant sept ans (source : ONU);
                  </li>
                  <li>
                    95 % : c'est la part des habits français importés (sources : Fédération indépendante du made in
                    France et Union des Industries Textile);
                  </li>
                </ul>
              </div>

              <div className={styles.impactItem}>
                <div className={styles.impactIcon}>
                  <Image src='/images/informations/ecosystem.svg' alt='' width={60} height={60} />
                </div>
                <p>
                  En 2020, la Convention citoyenne pour le climat a remis son rapport contenant 149 mesures pour lutter
                  contre le réchauffement climatique. Parmi celles-ci, figure l’ambition de créer une obligation
                  d’affichage de l’impact environnemental des produits et services afin d’inciter à se tourner vers une
                  consommation plus sobre et plus vertueuse sur le plan environnemental.{" "}
                </p>
              </div>

              <div className={styles.impactItem}>
                <div className={styles.impactIcon}>
                  <Image src='/images/informations/loi.svg' alt='' width={60} height={60} />
                </div>
                <p>
                  C’est dans cet esprit que la loi Climat et Résilience, promulguée le 24 août 2021, comporte une mesure
                  prévoyant une meilleure information à destination du consommateur « de façon fiable et facilement
                  compréhensible ».
                </p>
              </div>

              <div className={styles.impactItem}>
                <div className={styles.impactIcon}>
                  <Image src='/images/informations/france.svg' alt='' width={60} height={60} />
                </div>
                <p>
                  Porté par le Gouvernement, l’affichage du coût environnemental des vêtements a ainsi pour objectif de
                  permettre aux consommateurs d’accéder de manière transparente aux impacts environnementaux de chaque
                  produit qu’il choisit, incitant par la suite à des choix plus éclairés. Ce dispositif, public et
                  encadré par des règles communes, s’adresse également aux producteurs et aux distributeurs pour
                  encourager et valoriser leurs efforts d'écoconception.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Block>
      <Block>
        <Card
          horizontal
          start={<Badge>Le revers de mon look</Badge>}
          title='Quels impacts ont mes vêtements sur la planète ?'
          imageUrl='/images/impactmode.png'
          imageAlt=''
          titleAs='h3'
          desc='Industrie textile, matières premières, fabrication, nous avons le pouvoir de changer les choses.'
          enlargeLink
          footer="Consulter l'infographie de l'ADEME sur l'industrie textile"
          linkProps={{ href: "/organisation" }}
        />
      </Block>
      <Block secondary>
        <h2>Qu&apos;est-ce qui est pris en compte dans le calcul ?</h2>
        <p>
          Il s’agit d’une mesure d’impact qui évalue le coût environnemental de chaque produit. Allant de 0 à l’infini,
          le résultat agrège toutes les dimensions de l’impact environnemental engendré par un vêtement en prenant en
          compte :
          <br />
          <br />
          les émissions de gaz à effet de serre et donc l’impact sur le climat
          <br />
          <br />
          les atteintes à la biodiversité (via l’acidification, l’eutrophisation terrestre, l’eutrophisation de l’eau
          douce, l’eutrophisation marine, l’écotoxicité de l’eau douce, l’utilisation des sols)
          <br />
          <br />
          la consommation d'eau et d'autres ressources naturelles (fossiles, minérales et métalliques)
          <br />
          <br />
          les effets des pollutions des milieux et des environnements (via les radiations ionisantes, la formation
          d’ozone photochimique, l’appauvrissement de la couche d’ozone, les particules)
          <br />
          <br />
          Ces impacts sont mesurés sur chaque étape du cycle de vie d’un vêtement : de la production des matières à la
          fin de vie du vêtement, en passant par sa production (tissage, tricotage, teinture, confection…), son
          transport à chaque étape et son utilisation/lavage.
        </p>
      </Block>

      <Block>
        <h2>Quelles sont les marques qui affichent et quels sont les vêtements considérés ?</h2>
        <p>
          Le Ministère de la transition écologique a mis en place un cadre réglementaire à un dispositif volontaire
          depuis le 1er Octobre 2025. Cela permet d’avoir une méthodologie et un affichage identiques d’une marque à
          l’autre, pour plus de crédibilité. L’affichage du coût environnemental est une démarche volontaire. Ainsi,
          seules les marques qui s’engagent dans une démarche de transparence auprès du consommateur affichent
          aujourd’hui le coût environnemental sur leurs vêtements.
          <br />
          <br />
          Le cadre réglementaire s’applique aujourd’hui uniquement aux vêtements de la filière REP TLC, mais certaines
          catégories sont pour le moment hors scope, pour des raisons méthodologiques, comme les soutiens-gorges et le
          linge de maison. La filière REP TLC exclut les vêtements en cuir, les déguisements, les vêtements techniques
          et les vêtements à usage professionnel.{" "}
        </p>
      </Block>
    </>
  )
}

export default Informations

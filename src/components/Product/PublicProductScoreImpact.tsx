import { ProductWithScore } from "../../db/product"
import styles from "./PublicProductScoreImpact.module.css"
import Table from "../Table/Table"
import Badge from "@codegouvfr/react-dsfr/Badge"
import { impactCategories, ponderations } from "../../utils/product/impacts"
import Image from "next/image"
import ProductLifeCycleImpacts from "./ProductLifeCycleImpacts"

type ScoreKey = keyof Omit<NonNullable<ProductWithScore["informations"][number]["score"]>, "id" | "productId">

const PublicProductScoreImpact = ({
  score,
}: {
  score: Omit<NonNullable<ProductWithScore["informations"][number]["score"]>, "id" | "productId">
}) => {
  const calculateImpactValue = (key: string, base: number, ponderation: number) => {
    const baseValue = score[key as ScoreKey] || 0
    return (baseValue / base) * ponderation * 1_000_000
  }

  return (
    <>
      {score.materials !== null && score.materials > 0 && (
        <>
          <h2>Quels sont les impacts au fil du cycle de vie du produit ?</h2>
          <p className='fr-mb-4w'>
            L’ensemble des étapes du cycle de vie d'un produit textile sont modélisées dans le calculateur, de la
            production des matières premières à sa fin de vie. Le niveau d’analyse de chaque étape est lié à sa
            contribution à l’impact environnemental global du produit et de la maîtrise des paramètres par le metteur en
            marché (ex : consommation d'électricité du procédé de filature).
          </p>
          <ProductLifeCycleImpacts score={score} />
        </>
      )}
      <h2>Quels sont les impacts de ce produit sur l’environnement ?</h2>
      <p className='fr-mb-4w'>
        La conception d’un vêtement a des impacts sur l’environnement, tels que le changement climatique, la
        consommation d’eau, l’utilisation des sols et des ressources. Le tableau ci-dessous, issu des méthodes
        d’empreinte environnementale des produits (EEP) et d’empreinte environnementale des organisations (EEO) vous
        détaille ces impacts sur{" "}
        {Object.values(impactCategories).reduce((acc, category) => acc + category.impacts.length, 0)} catégories.
      </p>
      <div className='fr-mb-8w'>
        {Object.entries(impactCategories).map(([categoryKey, category]) => {
          const impacts = category.impacts
            .map((impact) => {
              const impactData = ponderations[impact.key]
              return {
                key: impact.key,
                label: impactData.label,
                definition: impact.definition,
                base: impactData.base,
                ponderation: impactData.ponderation,
                value: calculateImpactValue(impact.key, impactData.base, impactData.ponderation),
                baseValue: score[impact.key as ScoreKey] || 0,
              }
            })
            .filter((impact) => impact.baseValue > 0)

          return (
            <div key={categoryKey} className={styles.category}>
              <Table
                className='fr-mb-0'
                caption={
                  <>
                    <Image
                      className={styles.categoryIcon}
                      src={`/images/scores/${category.icon}.svg`}
                      alt=''
                      width={60}
                      height={60}
                    />
                    {category.label}
                  </>
                }
                fixed
                headers={["Nom", "Valeur", "Pourcentage", "Définition"]}
                data={impacts.map((impact) => [
                  impact.label,
                  <Badge key={impact.label} severity='info' noIcon>
                    {Math.round(impact.value)} pts
                  </Badge>,
                  <Badge key={impact.label} severity='info' noIcon>
                    {((impact.value / score.score) * 100).toFixed(2)}%
                  </Badge>,
                  impact.definition,
                ])}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default PublicProductScoreImpact

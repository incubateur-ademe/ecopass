import Link from "next/link"
import Block from "../components/Block/Block"
import { Stats } from "../services/stats/stats"
import { ProductCategory } from "../types/Product"
import styles from "./Statistics.module.css"

const plural: Record<ProductCategory, string> = {
  [ProductCategory.Chemise]: "Chemises",
  [ProductCategory.Jean]: "Jeans",
  [ProductCategory.JupeRobe]: "Jupes / Robes",
  [ProductCategory.ManteauVeste]: "Manteaux / Vestes",
  [ProductCategory.PantalonShort]: "Pantalons / Shorts",
  [ProductCategory.Pull]: "Pulls",
  [ProductCategory.TShirtPolo]: "T-shirts / Polos",
  [ProductCategory.Chaussettes]: "Chaussettes",
  [ProductCategory.CaleçonTissé]: "Caleçons (tissés)",
  [ProductCategory.BoxerSlipTricoté]: "Boxers / Slips (tricotés)",
  [ProductCategory.MaillotDeBain]: "Maillots de bain",
}

const getPlural = (count: number, category: string) => {
  if (count > 1) {
    const pluralCategory = plural[category as ProductCategory]
    if (pluralCategory) {
      return pluralCategory
    }
  }
  return category
}

const Statistics = ({ stats }: { stats: Stats }) => {
  return (
    <>
      <Block>
        <h1>Statistiques</h1>
        <ul className={styles.list}>
          <li>
            <b>{stats.visits.toLocaleString("fr-FR")}</b> visites
          </li>
          <li>
            <b>{stats.fileUploads.toLocaleString("fr-FR")}</b> fichiers déposés
          </li>
          <li>
            <b>{stats.apiUploads.toLocaleString("fr-FR")}</b> déclarations via l'API
          </li>
          <li>
            <b>
              {Object.values(stats.products)
                .reduce((acc, count) => acc + count, 0)
                .toLocaleString("fr-FR")}
            </b>{" "}
            produits déposés par <b>{stats.distinctBrands.toLocaleString("fr-FR")}</b> marques :
            <ul className={styles.smallList}>
              {Object.entries(stats.products)
                .sort(([, countA], [, countB]) => countB - countA)
                .map(([category, count]) => (
                  <li key={category}>
                    <b>{count.toLocaleString("fr-FR")}</b> {getPlural(count, category)}
                  </li>
                ))}
            </ul>
          </li>
        </ul>
        <Link
          className='fr-link'
          href='https://stats.beta.gouv.fr/index.php?module=CoreHome&action=index&idSite=226&period=day&date=yesterday'
          target='_blank'
          rel='noopener noreferrer'>
          Découvrez toutes les statistiques du site Impact CO₂ sur le tableau de bord de notre outil de suivi Matomo
        </Link>
      </Block>
    </>
  )
}

export default Statistics

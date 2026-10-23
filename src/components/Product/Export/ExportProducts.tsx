"use client"
import styles from "./ExportProducts.module.css"
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"
import { ProductFilters } from "../../../db/product"
import { Export } from "@prisma/client"
import { ExportType } from "@prisma/enums"
import { Alert } from "@codegouvfr/react-dsfr/Alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { exportProducts } from "../../../serverFunctions/export"

const ExportProducts = ({
  filters,
  exports,
  admin,
}: {
  filters: ProductFilters
  exports: Export[]
  admin?: boolean
}) => {
  const router = useRouter()
  const [success, setSuccess] = useState(false)
  const onClick = useCallback(
    (type: ExportType) => {
      setSuccess(false)
      exportProducts(filters, type).then(() => {
        setSuccess(true)
        router.refresh()
      })
    },
    [router, filters],
  )

  const handleExportsScroll = () => {
    const element = document.getElementById("exports")
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <div className={styles.container}>
        <p>
          <b>Faire un export de données</b> (vous pouvez y appliquer les filtres) :
        </p>
        <ButtonsGroup
          buttons={
            admin
              ? [
                  {
                    priority: "secondary",
                    iconId: "fr-icon-file-download-fill",
                    children: "Exporter le CSV",
                    onClick: () => onClick(ExportType.ADMIN),
                  },
                ]
              : [
                  {
                    priority: "secondary",
                    iconId: "fr-icon-file-download-fill",
                    children: "Exporter les données .csv",
                    onClick: () => onClick(ExportType.CSV),
                  },
                  {
                    priority: "secondary",
                    iconId: "fr-icon-file-download-fill",
                    children: "Exporter les étiquettes .svg",
                    onClick: () => onClick(ExportType.SVG),
                  },
                ]
          }
          inlineLayoutWhen='always'
        />
      </div>
      {success ? (
        <Alert
          severity='success'
          title='Votre fichier d’export de données est en cours de création'
          description={
            <>
              Lorsque ce dernier sera prêt, vous pourrez le télécharger depuis{" "}
              <Link href='#exports' onClick={handleExportsScroll}>
                le tableau ci-dessous
              </Link>
              .
            </>
          }
        />
      ) : (
        exports.length > 0 && (
          <Alert
            severity='info'
            small
            description={
              <>
                Vous avez des fichiers d'exports prêts à télécharger,{" "}
                <Link href='#exports' onClick={handleExportsScroll}>
                  en bas de page
                </Link>
                .
              </>
            }
          />
        )
      )}
    </>
  )
}

export default ExportProducts

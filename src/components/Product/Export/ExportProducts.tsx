import { Suspense } from "react"
import Exports from "./Exports"
import NewExport from "../NewExport"
import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import { ExportType } from "@prisma/enums"

const ExportProducts = ({ brand }: { brand?: string }) => {
  return (
    <>
      <h2>Coût environnemental</h2>
      <Tabs
        tabs={[
          {
            label: "Étiquettes (.svg)",
            content: (
              <>
                <p>
                  Pour télécharger l'ensemble des étiquettes coût environnemental de vos produits en format SVG,
                  veuillez cliquer sur le bouton ci dessous.
                </p>
                <p>Note : Vos fichiers restent disponibles 30 jours.</p>
                <br />
                <NewExport brand={brand} type={ExportType.SVG} />
                <Suspense>
                  <Exports brand={brand} type={ExportType.SVG} />
                </Suspense>
              </>
            ),
          },
          {
            label: "Scores (.csv)",
            content: (
              <>
                <p>
                  Pour télécharger le CSV contenant les scores coût environnemental de vos produits, veuillez cliquer
                  sur le bouton ci dessous.
                </p>
                <p>Note : Vos fichiers restent disponibles 30 jours.</p>
                <br />
                <NewExport brand={brand} type={ExportType.CSV} />
                <Suspense>
                  <Exports brand={brand} type={ExportType.CSV} />
                </Suspense>
              </>
            ),
          },
        ]}
      />
    </>
  )
}

export default ExportProducts

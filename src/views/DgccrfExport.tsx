import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import DgccrfExportForm from "../components/Dgccrf/DgccrfExportForm"

const DgccrfExport = ({
  brands,
}: {
  brands: {
    id: string
    name: string
  }[]
}) => {
  return (
    <Block>
      <h1>Export DGCCRF</h1>
      {brands.length === 0 ? (
        <Alert
          severity='info'
          title='Aucune marque disponible'
          description="Aucune marque n'est disponible pour l'export."
        />
      ) : (
        <DgccrfExportForm brands={brands} />
      )}
    </Block>
  )
}

export default DgccrfExport

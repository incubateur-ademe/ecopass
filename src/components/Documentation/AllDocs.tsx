import { Tabs } from "@codegouvfr/react-dsfr/Tabs"
import Fr from "./Fr"
import En from "./En"
import Ecobalyse from "./Ecobalyse"

const AllDocs = () => {
  return (
    <Tabs
      tabs={[
        { label: "Français", content: <Fr /> },
        { label: "English", content: <En /> },
        { label: "Écobalyse", content: <Ecobalyse /> },
      ]}
    />
  )
}
export default AllDocs

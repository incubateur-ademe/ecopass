import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Search from "../components/Dgccrf/Search"
import { OrganizationAndBrands } from "../serverFunctions/dgccrf"

const DGCCRFHome = ({ organizationsAndBrands }: { organizationsAndBrands: OrganizationAndBrands | null }) => {
  return (
    <>
      <Search organizationsAndBrands={organizationsAndBrands} />
      <Block home>
        <Informations />
      </Block>
    </>
  )
}

export default DGCCRFHome

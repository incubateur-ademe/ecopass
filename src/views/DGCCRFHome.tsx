import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Search from "../components/Dgccrf/Search"
import InformationProBanner from "../components/Home/InformationProBanner"
import { OrganizationAndBrands } from "../serverFunctions/dgccrf"

const DGCCRFHome = ({
  organizationsAndBrands,
  isAdmin,
}: {
  organizationsAndBrands: OrganizationAndBrands | null
  isAdmin: boolean
}) => {
  return (
    <>
      <Search organizationsAndBrands={organizationsAndBrands} />
      <Block home>{isAdmin ? <InformationProBanner /> : <Informations />}</Block>
    </>
  )
}

export default DGCCRFHome

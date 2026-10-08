import { OrganizationType } from "@prisma/enums"
import Block from "../components/Block/Block"
import HelpBanner from "../components/Help/HelpBanner"
import Upload from "../components/Upload/Upload"
import Uploads from "../components/Upload/Uploads"

const Declarations = ({
  page,
  canDeclare,
  organizationType,
}: {
  page: number
  canDeclare?: boolean
  organizationType?: OrganizationType
}) => {
  return (
    <>
      <Block>
        <h1>Mes déclarations</h1>
        <Upload canDeclare={canDeclare} />
      </Block>
      <Block>
        <h2>Mes fichiers de résultats</h2>
        <Uploads page={page} />
      </Block>
      <HelpBanner organizationType={organizationType} />
    </>
  )
}

export default Declarations

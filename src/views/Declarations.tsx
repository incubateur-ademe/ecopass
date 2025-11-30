import Block from "../components/Block/Block"
import Upload from "../components/Upload/Upload"
import Uploads from "../components/Upload/Uploads"

const Declarations = ({ page }: { page: number }) => {
  return (
    <>
      <Block>
        <h1>Mes déclarations</h1>
        <h2>Nouvelle déclaration</h2>
        <Upload />
      </Block>
      <Block>
        <h2>Mes fichiers</h2>
        <Uploads page={page} />
      </Block>
    </>
  )
}

export default Declarations

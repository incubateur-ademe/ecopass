import Block from "../components/Block/Block"
import Upload from "../components/Upload/Upload"
import Uploads from "../components/Upload/Uploads"

const Declarations = () => {
  return (
    <>
      <Block>
        <h1>Mes Déclarations</h1>
        <h2>Nouvelle déclaration</h2>
        <Upload />
      </Block>
      <Block>
        <h2>Mes fichiers</h2>
        <Uploads />
      </Block>
    </>
  )
}

export default Declarations

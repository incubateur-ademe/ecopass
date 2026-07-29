import Block from "../components/Block/Block"
import Contact from "../components/Organization/Contact"
import Upload from "../components/Upload/Upload"
import Uploads from "../components/Upload/Uploads"

const Declarations = ({ page }: { page: number }) => {
  return (
    <>
      <Block>
        <h1>Mes déclarations</h1>
        <Upload />
      </Block>
      <Block>
        <h2>Mes fichiers</h2>
        <Uploads page={page} />
      </Block>
      <Block type='yellow'>
        <Contact />
      </Block>
    </>
  )
}

export default Declarations

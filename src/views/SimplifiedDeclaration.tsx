import Block from "../components/Block/Block"
import Contact from "../components/Organization/Contact"
import SimplifiedDeclaration from "../components/Declaration/SimplifiedDeclaration"
import { getAllAvailableBrands } from "../db/brands"

const SimplifiedDeclarationView = async () => {
  const brands = await getAllAvailableBrands()

  return (
    <>
      <Block>
        <h1>Nouvelle déclaration : via formulaire simplifié</h1>
        <SimplifiedDeclaration brands={brands} />
      </Block>
      <Block type='yellow'>
        <Contact />
      </Block>
    </>
  )
}

export default SimplifiedDeclarationView

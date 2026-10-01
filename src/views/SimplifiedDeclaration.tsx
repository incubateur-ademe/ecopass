import Block from "../components/Block/Block"
import SimplifiedDeclaration from "../components/Declaration/SimplifiedDeclaration"
import { getAllAvailableBrands } from "../db/brands"
import HelpBanner from "../components/Help/HelpBanner"

const SimplifiedDeclarationView = async () => {
  const brands = await getAllAvailableBrands()

  return (
    <>
      <Block>
        <h1>Nouvelle déclaration : via formulaire simplifié</h1>
        <SimplifiedDeclaration brands={brands} />
      </Block>
      <HelpBanner />
    </>
  )
}

export default SimplifiedDeclarationView

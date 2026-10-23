import Block from "../components/Block/Block"
import SimplifiedDeclaration from "../components/Declaration/SimplifiedDeclaration"
import { getAllAvailableBrands } from "../db/brands"
import HelpBanner from "../components/Help/HelpBanner"

const SimplifiedDeclarationView = async ({ gtin }: { gtin?: string }) => {
  const brands = await getAllAvailableBrands()

  return (
    <>
      <Block>
        <h1>Nouvelle déclaration : via formulaire simplifié</h1>
        <SimplifiedDeclaration brands={brands} gtin={gtin} />
      </Block>
      <HelpBanner />
    </>
  )
}

export default SimplifiedDeclarationView

import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Search from "../components/Dgccrf/Search"

const DGCCRFHome = () => {
  return (
    <>
      <Block large home>
        <h1>Bienvenue sur le portail de déclaration de l’affichage environnemental</h1>
        <Search />
      </Block>
      <Block home>
        <Informations />
      </Block>
    </>
  )
}

export default DGCCRFHome

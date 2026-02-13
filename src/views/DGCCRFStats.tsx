import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Metabase from "../components/Stats/Metabase"

const DGCCRFStats = ({ token }: { token: string }) => {
  return (
    <>
      <Block home>
        <h1>Les ordres de grandeur</h1>
        <Metabase token={token} />
      </Block>
      <Block home>
        <Informations />
      </Block>
    </>
  )
}

export default DGCCRFStats

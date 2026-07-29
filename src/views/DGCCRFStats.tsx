import Block from "../components/Block/Block"
import Informations from "../components/Dgccrf/Informations"
import Metabase from "../components/Stats/Metabase"

const DGCCRFStats = ({ token }: { token: string }) => {
  return (
    <>
      <Block type='yellow'>
        <h1>Les ordres de grandeur</h1>
        <Metabase token={token} />
      </Block>
      <Block type='yellow'>
        <Informations />
      </Block>
    </>
  )
}

export default DGCCRFStats

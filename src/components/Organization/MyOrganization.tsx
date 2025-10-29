import { UserOrganization } from "../../db/user"
import Block from "../Block/Block"
import Informations from "./Informations"
import MyBrands from "./MyBrands"
import MyDelegations from "./MyDelegations"
import OtherDelegations from "./OtherDelegations"

const MyOrganization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <Block>
      <div className='fr-grid-row fr-grid-row--gutters'>
        <div className='fr-col-12 fr-col-md-4'>
          <Informations organization={organization} />
        </div>
        <div className='fr-col-12 fr-col-md-8'>
          <h2>Marques déclarées</h2>
          <MyBrands organization={organization} />
          <h2>Délégations</h2>
          <MyDelegations organization={organization} />
          <OtherDelegations organization={organization} />
        </div>
      </div>
    </Block>
  )
}

export default MyOrganization

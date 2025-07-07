import Block from "../components/Block/Block"
import MyBrands from "../components/Organization/MyBrands"
import MyDelegations from "../components/Organization/MyDelegations"
import { UserOrganization } from "../db/user"

const Organization = ({ organization }: { organization: UserOrganization }) => {
  return (
    <>
      <Block>
        <h1>Mon organisation {organization.name}</h1>
        <h2>Mes marques</h2>
        <MyBrands organization={organization} />
      </Block>
      <Block>
        <h2>Mes délégations</h2>
        <MyDelegations organization={organization} />
      </Block>
    </>
  )
}

export default Organization

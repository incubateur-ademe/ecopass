import Block from "../components/Block/Block"
import MyBrands from "../components/Organization/MyBrands"
import MyDelegations from "../components/Organization/MyDelegations"
import { UserBrand } from "../db/user"

const Organization = ({ brand }: { brand: UserBrand }) => {
  return (
    <>
      <Block>
        <h1>Mon organisation {brand.name}</h1>
        <h2>Mes marques</h2>
        <MyBrands brand={brand} />
      </Block>
      <Block>
        <h2>Mes déléguations</h2>
        <MyDelegations brand={brand} />
      </Block>
    </>
  )
}

export default Organization

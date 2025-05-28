import Block from "../components/Block/Block"
import Products from "../components/Product/Products"

const ProductsPage = ({ page }: { page: number }) => {
  return (
    <Block>
      <h1>Mes produits déclarés</h1>
      <Products page={page} />
    </Block>
  )
}

export default ProductsPage

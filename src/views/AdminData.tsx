import Block from "../components/Block/Block"
import DGCCRFBrandProductsTable from "../components/Brand/DGCCRFBrandProductsTable"
import { Products } from "../db/product"

const AdminData = ({
  filter,
  currentPage,
  productCount,
  products,
}: {
  products: Products
  productCount: number
  currentPage: number
  filter: {
    category?: string
    organization?: string
    from?: string
    to?: string
  }
}) => {
  return (
    <Block>
      <h1>Extraction des données</h1>
      <DGCCRFBrandProductsTable
        products={products}
        currentPage={currentPage}
        productCount={productCount}
        filter={filter}
      />
    </Block>
  )
}

export default AdminData

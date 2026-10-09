import { Export } from "@prisma/client"
import Block from "../components/Block/Block"
import DGCCRFBrandProductsTable from "../components/Brand/DGCCRFBrandProductsTable"
import { ProductFilters, Products } from "../db/product"
import ExportsTable from "../components/Product/Export/ExportsTable"

const AdminData = ({
  filters,
  currentPage,
  productCount,
  products,
  brands,
  categories,
  declarants,
  exports,
}: {
  products: Products
  productCount: number
  currentPage: number
  filters: ProductFilters
  brands: { name: string; id: string }[]
  categories: string[]
  declarants: string[]
  exports: Export[]
}) => {
  return (
    <>
      <Block>
        <h1>Extraction des données</h1>
        <DGCCRFBrandProductsTable
          products={products}
          currentPage={currentPage}
          productCount={productCount}
          filters={filters}
          brands={brands}
          categories={categories}
          declarants={declarants}
          exports={exports}
        />
      </Block>
      {exports.length > 0 && (
        <Block>
          <h2 id='exports'>Vos exports de données</h2>
          <ExportsTable exports={exports} admin />
        </Block>
      )}
    </>
  )
}

export default AdminData

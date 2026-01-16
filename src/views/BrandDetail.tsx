import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import BrandHeader from "../components/Brand/BrandHeader"
import BrandProductsTable from "../components/Brand/BrandProductsTable"
import { Products } from "../db/product"
import { getLastDeclarationDate } from "../utils/brands/computeBrandStats"
import { BrandInformation } from "../db/brands"

const BrandDetail = ({
  brand,
  products,
  currentPage,
}: {
  brand: BrandInformation
  products: Products
  currentPage: number
}) => {
  const productCount = brand.productsByCategory.reduce((acc, current) => acc + current.count, 0)
  const lastDeclarationDate = getLastDeclarationDate(products)

  if (productCount === 0) {
    return (
      <Block home backLink={{ url: "/marques", label: "Chercher une autre marque" }}>
        <h1>{brand.name}</h1>
        <Alert severity='info' small description="Cette marque n'a pas encore de produits déclarés." />
      </Block>
    )
  }

  return (
    <>
      <Block home backLink={{ url: "/marques", label: "Chercher une autre marque" }}>
        <BrandHeader
          name={brand.name}
          lastDeclarationDate={lastDeclarationDate}
          productCount={productCount}
          categories={brand.productsByCategory}
        />
      </Block>

      <Block>
        <BrandProductsTable
          products={products}
          currentPage={currentPage}
          brandId={brand.id}
          totalPages={Math.ceil(productCount / 10)}
        />
      </Block>
    </>
  )
}

export default BrandDetail

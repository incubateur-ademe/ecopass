import Alert from "@codegouvfr/react-dsfr/Alert"
import Block from "../components/Block/Block"
import BrandHeader from "../components/Brand/BrandHeader"
import BrandProductsTable from "../components/Brand/BrandProductsTable"
import { Products } from "../db/product"
import { computeCategories, getLastDeclarationDate } from "../utils/brands/computeBrandStats"

const BrandDetail = ({ brand, products }: { brand: { id: string; name: string }; products: Products }) => {
  const productCount = products.length
  const lastDeclarationDate = getLastDeclarationDate(products)
  const categories = computeCategories(products)

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
          categories={categories}
        />
      </Block>

      <Block>
        <BrandProductsTable products={products} />
      </Block>
    </>
  )
}

export default BrandDetail

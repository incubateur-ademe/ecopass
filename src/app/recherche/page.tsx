import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import { PageProps } from "../../types/Next"
import SearchProducts from "../../views/SearchProducts"
import { getAllBrands, searchProducts } from "../../db/product"

export const metadata: Metadata = {
  title: "Recherche de produits - Affichage environnemental",
}

const SearchProductsPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const page = params.page ? parseInt(params.page as string, 10) : 1
  const brandId = params.brandId ? (params.brandId as string) : undefined
  const search = params.search ? (params.search as string) : undefined
  const category = params.category ? (params.category as string) : undefined
  const size = 20

  const [brands, { products, total }] = await Promise.all([
    getAllBrands(),
    brandId || search || category
      ? searchProducts({ page, size, brandId, search, category })
      : { products: [], total: 0 },
  ])

  return (
    <>
      <StartDsfrOnHydration />
      <SearchProducts
        page={page}
        size={size}
        total={total}
        products={products}
        brands={brands}
        selectedBrandId={brandId}
        searchQuery={search}
        selectedCategory={category}
      />
    </>
  )
}

export default SearchProductsPage

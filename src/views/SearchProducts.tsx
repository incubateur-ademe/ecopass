import { Products } from "../db/product"
import SearchContainer from "../components/Product/Search/SearchContainer"

const SearchProducts = ({
  page,
  size,
  total,
  products,
  brands,
  selectedBrandId,
  searchQuery,
  selectedCategory,
}: {
  page: number
  size: number
  total: number
  products: Products
  brands: { name: string; id: string }[]
  selectedBrandId?: string
  searchQuery?: string
  selectedCategory?: string
}) => {
  return (
    <SearchContainer
      page={page}
      size={size}
      total={total}
      products={products}
      brands={brands}
      selectedBrandId={selectedBrandId}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
    />
  )
}

export default SearchProducts

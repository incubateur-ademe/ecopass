import BrandsList from "../components/Brand/BrandsList"
import { BrandWithStats } from "../db/brands"

const Brands = ({
  brands,
  defaultSearch,
  defaultPage,
}: {
  brands: BrandWithStats[]
  defaultSearch: string
  defaultPage: number
}) => {
  return <BrandsList brands={brands} defaultSearch={defaultSearch} defaultPage={defaultPage} />
}

export default Brands

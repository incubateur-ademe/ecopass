import BrandsList from "../components/Brand/BrandsList"
import { BrandWithStats } from "../db/brands"

const Brands = ({
  brands,
  defaultSearch,
  defaultPage,
  isDGCCRF,
}: {
  brands: BrandWithStats[]
  defaultSearch: string
  defaultPage: number
  isDGCCRF: boolean
}) => {
  return <BrandsList brands={brands} defaultSearch={defaultSearch} defaultPage={defaultPage} isDGCCRF={isDGCCRF} />
}

export default Brands

import BrandsList from "../components/Brand/BrandsList"
import { BrandWithStats } from "../db/brands"

const Brands = ({ brands }: { brands: BrandWithStats[] }) => {
  return <BrandsList brands={brands} />
}

export default Brands

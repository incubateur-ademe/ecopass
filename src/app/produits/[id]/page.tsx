import { getProductWithScore } from "../../../db/product";
import Product from "../../../pages/Product";

type Props = {
  params: Promise<{ id: string }>;
};

const ProductPage = async (props: Props) => {
  const params = await props.params;

  const product = await getProductWithScore(params.id);
  return <Product product={product} />;
};

export default ProductPage;

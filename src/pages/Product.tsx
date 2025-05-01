import Block from "../components/Block/Block";
import { ProductWithScore } from "../db/product";

const Product = ({ product }: { product: ProductWithScore | null }) => {
  return product ? (
    <Block>
      <p>{product.score?.score}</p>
      <p>Calculé le {product.createdAt.toDateString()}</p>
    </Block>
  ) : null;
};

export default Product;

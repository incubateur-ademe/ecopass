import Block from "../components/Block/Block";
import { ProductWithScore } from "../db/product";

const Product = ({ product }: { product: ProductWithScore }) => {
  return (
    <Block>
      <p>{product.score?.score}</p>
      <p>Calculé le {product.createdAt.toDateString()}</p>
    </Block>
  );
};

export default Product;

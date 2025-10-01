import { GetAllProducts } from "../stack/GetProducts";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { CardProduct } from "../components/CardProduct";

export const ProductList = () => {
  const { data: products, isPending, error } = GetAllProducts();
  const navigate = useNavigate();

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <article className="my-16 lg:max-w-5xl mx-auto">
      <section></section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {products?.map((product) => (
          <div key={product.id}>
            <CardProduct
              id={product.id}
              title={product.title}
              image={product.image}
              price={product.price}
            />
          </div>
        ))}
      </section>
    </article>
  );
};

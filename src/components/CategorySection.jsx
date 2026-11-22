import { GetProductsByCategory } from "../stack/GetProducts";
import { CardProduct } from "./CardProduct";
import { Loader } from "./Loader";
import { QueryError } from "./QueryError";

export const CategorySection = ({ category, id }) => {
  const { data, isPending, isError, isFetching, refetch } = GetProductsByCategory(category);
  const products = data?.filter((product) => product.id !== id);

  if (!category || (products && products.length === 0)) return null;

  return (
    <section aria-labelledby="related-title" className="mt-12 border-t border-line pt-8 sm:mt-16">
      <h2 id="related-title" className="section-title mb-5">También te puede interesar</h2>
      {isPending ? (
        <Loader className="lg:grid-cols-4" />
      ) : isError && !data ? (
        <QueryError message="No pudimos cargar los productos relacionados." retry={() => refetch()} isFetching={isFetching} />
      ) : (
        <div className="product-grid lg:grid-cols-4">
          {products.map((product) => <CardProduct key={product.id} {...product} />)}
        </div>
      )}
    </section>
  );
};

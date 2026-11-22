import { Link, useParams } from "react-router-dom";
import { GetProductsById } from "../stack/GetProducts";
import { Loader } from "../components/Loader";
import { CategorySection } from "../components/CategorySection";
import { QueryError } from "../components/QueryError";
import { categoryLabel, formatPrice } from "../utils/products";

export const ProductDetails = () => {
  const { id } = useParams();
  const { data: product, isPending, isError, isFetching, refetch } = GetProductsById(id);

  return (
    <div className="shell py-7 sm:py-10">
      <Link to="/productlist" className="button button-secondary mb-6">
        <span aria-hidden="true">←</span> Volver a productos
      </Link>

      {isPending ? (
        <Loader variant="detail" />
      ) : isError && !product ? (
        <QueryError message="No pudimos cargar el producto." retry={() => refetch()} isFetching={isFetching} />
      ) : !product ? (
        <div className="state-panel">
          <h1 className="section-title">Producto no encontrado</h1>
          <p className="text-muted">Volvé al catálogo para seguir explorando.</p>
        </div>
      ) : (
        <>
          <article className="detail-grid">
            <div className="product-media aspect-[5/4] rounded-2xl border border-line">
              <img
                src={product.image}
                alt={product.title}
                className="product-image p-8 sm:p-14"
                width="600"
                height="480"
              />
            </div>
            <div className="panel min-w-0 p-6 sm:p-8">
              <p className="inline-flex rounded-full bg-tint px-3 py-1 text-xs font-semibold text-action">{categoryLabel(product.category)}</p>
              <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight wrap-anywhere lg:text-4xl">{product.title}</h1>
              <p className="mt-4 text-2xl font-bold tracking-tight">{formatPrice(product.price)}</p>
              <div className="mt-6 border-t border-line pt-5">
                <h2 className="mb-2 font-semibold">Descripción</h2>
                <p className="leading-relaxed wrap-anywhere text-muted">{product.description}</p>
              </div>
            </div>
          </article>
          <CategorySection category={product.category} id={product.id} />
        </>
      )}
    </div>
  );
};

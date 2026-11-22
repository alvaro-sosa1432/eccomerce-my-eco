import { Link } from "react-router-dom";
import { CardProduct } from "../components/CardProduct";
import { Loader } from "../components/Loader";
import { QueryError } from "../components/QueryError";
import { WishlistButton } from "../components/WishlistButton";
import { useWishlist } from "../hooks/useWishlist";
import { GetAllProducts } from "../stack/GetProducts";

export function WishlistPage() {
  const favorites = useWishlist();
  const ids = favorites.data;
  const catalog = GetAllProducts(undefined, { enabled: Boolean(ids?.length) });
  const products = new Map(catalog.data?.map((product) => [product.id, product]));

  return (
    <div className="shell py-9 sm:py-12">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Mis favoritos</h1>
      {ids && <p role="status" className="mt-3 text-muted">{ids.length} {ids.length === 1 ? "producto" : "productos"}</p>}

      <section aria-label="Productos favoritos" className="mt-7">
        {!ids && favorites.isError ? (
          <QueryError message="No pudimos cargar tus favoritos." retry={favorites.refetch} isFetching={favorites.isFetching} />
        ) : !ids ? (
          <Loader count={3} />
        ) : !ids.length ? (
          <div className="state-panel">
            <p className="text-muted">Todavía no guardaste ningún producto.</p>
            <Link to="/productlist" className="button button-secondary">Explorar productos</Link>
          </div>
        ) : !catalog.data && catalog.isError ? (
          <QueryError message="No pudimos cargar los detalles de tus favoritos." retry={catalog.refetch} isFetching={catalog.isFetching} />
        ) : !catalog.data ? (
          <Loader count={3} />
        ) : (
          <div className="product-grid">
            {ids.map((id) => {
              const product = products.get(id);
              return product ? <CardProduct key={id} {...product} /> : (
                <article key={id} className="state-panel">
                  <h2 className="font-semibold">Producto no disponible</h2>
                  <p className="text-sm text-muted">Podés quitarlo de tus favoritos.</p>
                  <WishlistButton productId={id} productTitle={`producto no disponible ${id}`} />
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

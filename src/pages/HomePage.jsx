import { Link } from "react-router-dom";
import { GetProducts } from "../stack/GetProducts";
import { CardProduct } from "../components/CardProduct";
import { Loader } from "../components/Loader";
import { QueryError } from "../components/QueryError";

export const HomePage = () => {
  const { data, isPending, isError, isFetching, refetch } = GetProducts();

  return (
    <div className="shell pt-6 pb-16 sm:pt-9 lg:pt-12">
      <section className="grid overflow-hidden rounded-2xl border border-line bg-banner md:grid-cols-[1fr_1fr]">
        <div className="flex flex-col items-start justify-center px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <h1 className="max-w-[12ch] text-4xl leading-[1.05] font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Encontrá algo para <span className="text-action">cada día</span>
          </h1>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted">
            Explorá nuestra selección de moda, joyería y tecnología. Elegí lo que va con vos.
          </p>
          <Link to="/productlist" className="button button-primary mt-7">
            Explorar productos <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="relative min-h-48 overflow-hidden bg-banner-media sm:min-h-60 md:min-h-0">
          <img
            src={`${import.meta.env.BASE_URL}banner-hero.webp`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[35%_0%]"
            fetchPriority="high"
          />
        </div>
      </section>

      <section aria-labelledby="featured-title" className="mt-12 sm:mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="featured-title" className="section-title">Productos destacados</h2>
            <p className="mt-2 text-muted">Una selección del catálogo para empezar a explorar.</p>
          </div>
          <Link to="/productlist" className="button button-secondary">
            Ver todo el catálogo <span aria-hidden="true">→</span>
          </Link>
        </div>
        {isPending ? (
          <Loader count={6} />
        ) : isError && !data ? (
          <QueryError message="No pudimos cargar los productos destacados." retry={() => refetch()} isFetching={isFetching} />
        ) : data.length ? (
          <div className="product-grid">
            {data.map((product) => <CardProduct key={product.id} {...product} />)}
          </div>
        ) : (
          <p className="state-panel text-muted">Por ahora no hay productos destacados.</p>
        )}
      </section>
    </div>
  );
};

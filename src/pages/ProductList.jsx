import { useRef, useState } from "react";
import { GetAllProducts } from "../stack/GetProducts";
import { Loader } from "../components/Loader";
import { CardProduct } from "../components/CardProduct";
import { QueryError } from "../components/QueryError";
import { categoryLabel } from "../utils/products";

const emptyProducts = [];

export const ProductList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const searchInput = useRef(null);
  const { data, isPending, isError, isFetching, refetch } = GetAllProducts();
  const products = data ?? emptyProducts;
  const categories = [...new Set(products.map((product) => product.category))]
    .sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b), "es"));
  const searchTerm = search.trim().toLocaleLowerCase("es");
  const results = products.filter((product) =>
    (!category || product.category === category) &&
    product.title.toLocaleLowerCase("es").includes(searchTerm)
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    searchInput.current?.focus();
  };

  return (
    <div className="shell py-9 sm:py-12">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Explorar productos</h1>
      <p className="mt-3 text-muted">Encontrá lo que buscás por nombre o categoría.</p>

      <div className="panel mt-7 grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.4fr)] sm:p-5">
        <label className="grid min-w-0 gap-2 text-sm font-semibold">
          Buscar por nombre
          <span className="relative block">
            <svg aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input ref={searchInput} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Escribí el nombre de un producto" className="field pl-11 font-normal placeholder:text-muted" />
          </span>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold">
          Categoría
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="field font-normal disabled:opacity-60" disabled={!data}>
            <option value="">Todas las categorías</option>
            {categories.map((value) => <option key={value} value={value}>{categoryLabel(value)}</option>)}
          </select>
        </label>
      </div>

      <section aria-label="Resultados del catálogo" className="mt-7">
        <div className="mb-4 flex min-h-11 flex-wrap items-center justify-between gap-x-3">
          <p role="status" className="text-sm font-medium text-muted">
            {data && `${results.length} ${results.length === 1 ? "resultado" : "resultados"}`}
          </p>
          {(search || category) && (
            <button type="button" onClick={clearFilters} className="button text-action hover:bg-tint">
              Limpiar filtros
            </button>
          )}
        </div>
        {isPending ? (
          <Loader count={8} className="lg:grid-cols-4" />
        ) : isError && !data ? (
          <QueryError message="No pudimos cargar el catálogo." retry={() => refetch()} isFetching={isFetching} />
        ) : results.length ? (
          <div className="product-grid lg:grid-cols-4">
            {results.map((product) => <CardProduct key={product.id} {...product} />)}
          </div>
        ) : (
          <div className="state-panel">
            <h2 className="text-lg font-semibold">{searchTerm || category ? "No encontramos coincidencias" : "El catálogo está vacío"}</h2>
            {(searchTerm || category) && <p className="text-muted">Probá con otro nombre o limpiá los filtros para ver el catálogo completo.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

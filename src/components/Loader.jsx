export const Loader = ({ count = 3, variant = "cards", className = "" }) => (
  <div role="status">
    <span className="sr-only">{variant === "detail" ? "Cargando producto" : "Cargando productos"}</span>
    {variant === "detail" ? (
      <div aria-hidden="true" className="detail-grid motion-safe:animate-skeleton">
        <div className="aspect-[5/4] rounded-2xl bg-skeleton" />
        <div className="panel space-y-5 p-6 sm:p-8">
          <div className="h-7 w-28 rounded-full bg-skeleton" />
          <div className="h-8 w-11/12 rounded bg-skeleton" />
          <div className="h-8 w-2/3 rounded bg-skeleton" />
          <div className="h-7 w-24 rounded bg-skeleton" />
          <div className="h-20 rounded bg-surface-alt" />
        </div>
      </div>
    ) : (
      <div aria-hidden="true" className={`product-grid motion-safe:animate-skeleton ${className}`}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="panel p-3">
            <div className="aspect-[5/4] rounded-xl bg-skeleton" />
            <div className="px-1 pt-4 pb-1">
              <div className="mb-2 h-3.5 w-1/3 rounded bg-surface-alt" />
              <div className="h-11 w-5/6 rounded bg-surface-alt" />
              <div className="mt-3 mb-4 h-7 w-1/3 rounded bg-skeleton" />
              <div className="h-11 rounded-xl bg-surface-alt" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

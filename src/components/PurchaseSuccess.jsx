import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export function PurchaseSuccess() {
  const title = useRef(null);
  useEffect(() => { title.current?.focus(); }, []);

  return (
    <section className="panel mx-auto flex max-w-lg flex-col items-center gap-4 p-6 text-center sm:p-10">
      <svg aria-hidden="true" className="size-20 text-action" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="40" cy="40" r="35" className="fill-tint" stroke="none" />
        <circle cx="40" cy="40" r="35" pathLength="1" className="purchase-circle" transform="rotate(-90 40 40)" />
        <path d="m25 40 10 10 20-20" pathLength="1" className="purchase-check" />
      </svg>
      <h1 ref={title} tabIndex={-1} className="section-title">¡Compra realizada!</h1>
      <p className="text-muted">Compra de demostración completada.</p>
      <Link to="/productlist" className="button button-primary mt-2">Seguir comprando</Link>
    </section>
  );
}

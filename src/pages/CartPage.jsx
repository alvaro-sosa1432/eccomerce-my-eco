import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { ClearCartDialog } from "../components/ClearCartDialog";
import { Loader } from "../components/Loader";
import { PurchaseSuccess } from "../components/PurchaseSuccess";
import { QueryError } from "../components/QueryError";
import { useCart, useCartActions } from "../hooks/useCart";
import { maxCartQuantity } from "../services/cartService";
import { GetAllProducts } from "../stack/GetProducts";
import { formatPrice } from "../utils/products";

function CartItem({ item, product, disabled, change }) {
  const { product_id: id, quantity } = item;
  const title = product?.title ?? `Producto no disponible (${id})`;
  const adjust = (delta) => change("adjust", { productId: id, delta });

  return (
    <article className="panel grid min-w-0 gap-4 p-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
      {product && (
        <Link to={`/product/${id}`} tabIndex={-1} aria-hidden="true" className="product-media size-24 rounded-xl">
          <img src={product.image} alt="" className="product-image p-2" loading="lazy" />
        </Link>
      )}
      <div className={product ? "min-w-0" : "sm:col-span-2"}>
        <h2 className="font-semibold wrap-anywhere">
          {product ? <Link to={`/product/${id}`} className="rounded hover:text-action">{title}</Link> : title}
        </h2>
        {product && <p className="mt-1 text-sm text-muted">{formatPrice(product.price)} por unidad</p>}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={`Cantidad de ${title}`} className="flex items-center gap-2">
            <button type="button" className="button button-secondary size-11 px-0 disabled:opacity-50" aria-label={`Disminuir cantidad de ${title}`} onClick={() => adjust(-1)} disabled={disabled || quantity <= 1}>−</button>
            <span className="min-w-6 text-center font-semibold tabular-nums" aria-live="polite">{quantity}</span>
            <button type="button" className="button button-secondary size-11 px-0 disabled:opacity-50" aria-label={`Aumentar cantidad de ${title}`} onClick={() => adjust(1)} disabled={disabled || !product || quantity >= maxCartQuantity}>+</button>
          </div>
          {product && <p className="text-sm font-semibold tabular-nums">{formatPrice(Math.round(product.price * 100) * quantity / 100)}</p>}
          <button type="button" className="button px-2 text-action hover:bg-tint disabled:opacity-60" aria-label={`Eliminar ${title}`} disabled={disabled} onClick={() => change("remove", { productId: id })}>Eliminar</button>
        </div>
      </div>
    </article>
  );
}

function CartContent() {
  const [completed, setCompleted] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const clearButton = useRef(null);
  const cartTitle = useRef(null);
  const cart = useCart();
  const { change, isBusy, pendingAction } = useCartActions();
  const catalog = GetAllProducts(undefined, { enabled: Boolean(cart.data?.length) });
  const byId = new Map(catalog.data?.filter(({ price }) => Number.isFinite(price) && price >= 0).map((product) => [product.id, product]));
  const rows = cart.data?.map((item) => ({ item, product: byId.get(item.product_id) })) ?? [];
  const incomplete = rows.some(({ product }) => !product);
  const totalCents = rows.reduce((sum, { item, product }) => sum + (product ? Math.round(product.price * 100) * item.quantity : 0), 0);
  const canCheckout = rows.length > 0 && !incomplete && !isBusy &&
    !cart.isError && !cart.isFetching && !catalog.isError && !catalog.isFetching;

  function checkout() {
    if (!canCheckout) return;
    const expected = Object.fromEntries(rows.map(({ item }) => [item.product_id, item.quantity]));
    change("checkout", { expected }, () => setCompleted(true));
  }

  function clear() {
    if (!isBusy && rows.length) change("clear", {}, closeClearDialog);
  }

  function closeClearDialog() {
    setShowClearDialog(false);
  }

  if (completed) return <PurchaseSuccess />;

  return (
    <>
      <h1 ref={cartTitle} tabIndex={-1} className="text-4xl font-bold tracking-tight sm:text-5xl">Mi carrito</h1>
      {cart.isError && (
        <div className="mt-6">
          <QueryError message="No pudimos cargar tu carrito." retry={cart.refetch} isFetching={cart.isFetching} />
        </div>
      )}
      {!cart.data && !cart.isError && <div className="mt-6"><Loader count={3} /></div>}
      {cart.data && !rows.length && !cart.isError && (
        <div className="state-panel mt-6">
          <p className="text-muted">Tu carrito está vacío.</p>
          <Link to="/productlist" className="button button-primary">Explorar productos</Link>
        </div>
      )}
      {rows.length > 0 && (
        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-label="Productos del carrito" aria-busy={isBusy} className="min-w-0 space-y-3">
            {catalog.isError && <QueryError message="No pudimos cargar los detalles de los productos." retry={catalog.refetch} isFetching={catalog.isFetching} />}
            {!catalog.data && !catalog.isError && <Loader count={2} />}
            {catalog.data && rows.map(({ item, product }) => (
              <CartItem key={item.product_id} item={item} product={product} disabled={isBusy} change={change} />
            ))}
            <button ref={clearButton} type="button" className="button button-secondary disabled:opacity-60" disabled={isBusy} onClick={() => setShowClearDialog(true)}>
              Vaciar carrito
            </button>
          </section>
          <section aria-label="Resumen del carrito" className="panel space-y-4 p-5">
            {catalog.data && (
              <p className="flex flex-wrap justify-between gap-2 font-bold">
                <span>{incomplete ? "Subtotal disponible" : "Total estimado"}</span>
                <span className="tabular-nums">{formatPrice(totalCents / 100)}</span>
              </p>
            )}
            {catalog.data && incomplete && <p className="text-sm text-muted">Quitá los productos no disponibles para confirmar la compra.</p>}
            <p className="text-sm text-muted">Compra de demostración. No se procesan pagos reales.</p>
            <button type="button" className="button button-primary w-full disabled:opacity-60" aria-busy={pendingAction === "checkout"} disabled={!canCheckout} onClick={checkout}>
              {pendingAction === "checkout" ? "Confirmando…" : "Confirmar compra"}
            </button>
          </section>
        </div>
      )}
      <ClearCartDialog
        open={showClearDialog}
        pending={pendingAction === "clear"}
        disabled={isBusy || !rows.length}
        onDismiss={closeClearDialog}
        onConfirm={clear}
        trigger={clearButton}
        fallbackFocus={cartTitle}
      />
    </>
  );
}

export function CartPage() {
  const { user } = useAuth();
  return <div className="shell py-9 sm:py-12"><CartContent key={user.id} /></div>;
}

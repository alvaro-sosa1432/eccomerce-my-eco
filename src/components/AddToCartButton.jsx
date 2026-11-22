import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useCartActions } from "../hooks/useCart";

export function CartIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h3l2.4 10.2A2 2 0 0 0 9.3 16h8.9a2 2 0 0 0 1.9-1.4L22 8H6" />
      <circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export function AddToCartButton({ productId, productTitle, primary = false }) {
  const { user, isInitializing } = useAuth();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { change, isBusy, pendingAction } = useCartActions();

  function add() {
    if (!user) {
      navigate("/login", { state: { from: pathname + search + hash } });
      return;
    }
    change("add", { productId, delta: 1 });
  }

  return (
    <button
      type="button"
      className={`button w-full disabled:opacity-60 ${primary ? "button-primary" : "button-secondary text-action"}`}
      disabled={isInitializing || isBusy}
      aria-busy={Boolean(pendingAction)}
      aria-label={pendingAction ? `Agregando al carrito: ${productTitle}` : `Agregar al carrito: ${productTitle}`}
      onClick={add}
    >
      <CartIcon />
      {pendingAction ? "Agregando…" : "Agregar al carrito"}
    </button>
  );
}

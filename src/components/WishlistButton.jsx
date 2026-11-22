import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useWishlist, useWishlistMutation } from "../hooks/useWishlist";

export function HeartIcon({ filled = false }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z" />
    </svg>
  );
}

function ProductFavorite({ productId, productTitle, userId, isInitializing }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { data, isError, isFetching, refetch } = useWishlist();
  const { toggle, isUpdating } = useWishlistMutation(userId, productId);
  const isFavorite = data?.includes(productId) ?? false;
  const isLoading = isInitializing || Boolean(userId && !data && isFetching);
  const mustRetry = Boolean(userId && !data && isError);
  const label = mustRetry ? "Reintentar carga de favoritos" : "Favorito";

  function handleClick() {
    if (!userId) {
      navigate("/login", { state: { from: pathname + search + hash } });
    } else if (mustRetry) {
      refetch();
    } else if (data) {
      toggle(!isFavorite);
    }
  }

  return (
    <button
      type="button"
      className={`button button-secondary w-11 shrink-0 px-0 disabled:opacity-60 ${isFavorite ? "text-action" : "text-muted"}`}
      aria-label={`${label}: ${productTitle}`}
      aria-pressed={mustRetry || (userId && !data) ? undefined : isFavorite}
      aria-busy={isLoading || isUpdating}
      disabled={isLoading || isUpdating || Boolean(userId && !data && !mustRetry)}
      onClick={handleClick}
    >
      {isLoading || isUpdating
        ? <span aria-hidden="true" className="size-4 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin" />
        : <HeartIcon filled={isFavorite} />}
    </button>
  );
}

export function WishlistButton({ productId, productTitle }) {
  const { user, isInitializing } = useAuth();
  return <ProductFavorite key={user?.id} productId={productId} productTitle={productTitle} userId={user?.id} isInitializing={isInitializing} />;
}

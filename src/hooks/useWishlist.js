import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { notify } from "../lib/notify";
import { supabase } from "../lib/supabase";
import { listWishlist, setWishlistProduct } from "../services/wishlistService";

const wishlistKey = (userId) => ["wishlist", userId];

export function useWishlist() {
  const { user, isInitializing } = useAuth();
  const userId = user?.id;

  return useQuery({
    queryKey: wishlistKey(userId),
    queryFn: ({ signal }) => listWishlist(userId, signal),
    enabled: Boolean(supabase && userId && !isInitializing),
    staleTime: 30_000,
  });
}

export function useWishlistMutation(userId, productId) {
  const client = useQueryClient();
  const queryKey = wishlistKey(userId);
  const mutationKey = [...queryKey, "set", productId];
  const filters = { mutationKey, exact: true };
  const isUpdating = useIsMutating(filters) > 0;
  const { mutate } = useMutation({
    mutationKey,
    mutationFn: setWishlistProduct,
    onSuccess: async (_, { add }) => {
      if (add) notify("success", "Agregado a favoritos", "El producto se guardó en tu wishlist");
      else notify("info", "Eliminado de favoritos", "El producto se quitó de tu wishlist");
      await client.cancelQueries({ queryKey, exact: true });
      client.setQueryData(queryKey, (ids) => {
        if (!ids) return undefined;
        if (!add) return ids.filter((id) => id !== productId);
        return ids.includes(productId) ? ids : [productId, ...ids];
      });
    },
    onError: (error) => {
      const description = error?.code === "42501"
        ? "Comprobá que tu sesión esté activa y volvé a intentar."
        : "No pudimos guardar el cambio. Revisá tu conexión y volvé a intentar.";
      notify("error", "Error en favoritos", description);
    },
    onSettled: () => client.invalidateQueries({ queryKey, exact: true }),
  });

  function toggle(add) {
    if (!userId || client.isMutating(filters)) return;
    mutate({ userId, productId, add });
  }

  return { toggle, isUpdating };
}

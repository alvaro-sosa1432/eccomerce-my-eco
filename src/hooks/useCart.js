import { useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "../lib/notify";
import { useAuth } from "../auth/useAuth";
import { supabase } from "../lib/supabase";
import { cartKey, listCart, mutateCart } from "../services/cartService";

const messages = {
  add: "Producto agregado al carrito",
  adjust: "Cantidad actualizada",
  remove: "Producto eliminado del carrito",
  clear: "Carrito vaciado correctamente",
};

function cartErrorMessage(error, action) {
  if (error.code === "PGRST202") return "Supabase no encuentra la función del carrito. Si administrás el proyecto, verificá la migración y la caché del esquema.";
  if (error.code === "42883") return "Supabase no pudo resolver una función requerida para el carrito. Revisá el error de la base de datos.";
  if (error.code === "P4091") return "La cantidad cambió o alcanzó el límite. Revisá tu carrito.";
  if (error.code === "P4092") return "No se pudo completar la operación. Revisá los productos y volvé a intentar.";
  if (error.code === "42501") return "No hay permiso para modificar el carrito. Comprobá tu sesión.";
  return action === "checkout"
    ? "No pudimos confirmar la compra. Revisá el estado de tu carrito."
    : "No pudimos actualizar el carrito. Volvé a intentar.";
}

export function useCart() {
  const { user, isInitializing } = useAuth();
  const userId = user?.id;
  return useQuery({
    queryKey: cartKey(userId),
    queryFn: ({ signal }) => listCart(userId, signal),
    enabled: Boolean(supabase && userId && !isInitializing),
    staleTime: 30_000,
  });
}

export function useCartActions() {
  const { user } = useAuth();
  const userId = user?.id;
  const client = useQueryClient();
  const queryKey = cartKey(userId);
  const mutationKey = [...queryKey, "mutation"];
  const filters = { mutationKey, exact: true };
  const isBusy = useIsMutating(filters) > 0;
  const { mutate, isPending, variables } = useMutation({
    mutationKey,
    mutationFn: mutateCart,
    retry: false,
    networkMode: "always",
    onSettled: () => client.invalidateQueries({ queryKey, exact: true }),
  });

  function change(action, fields = {}, afterSuccess) {
    if (!userId || client.isMutating(filters)) return;

    mutate({ userId, action: action === "add" ? "adjust" : action, ...fields }, {
      onSuccess: () => {
        if (action === "remove" || action === "clear") notify("info", messages[action]);
        else if (messages[action]) notify("success", messages[action]);
        else if (action === "checkout") notify("info", "Tu carrito quedó vacío", undefined, "bottom-center");
        afterSuccess?.();
      },
      onError: (error) => notify("error", "Error del carrito", cartErrorMessage(error, action)),
    });
  }

  return { change, isBusy, pendingAction: isPending ? variables.action : null };
}

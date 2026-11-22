import { supabase } from "../lib/supabase";

export const cartKey = (userId) => ["cart", userId];
export const maxCartQuantity = 99;

export async function listCart(userId, signal) {
  const { data, error } = await supabase.from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", userId)
    .order("created_at")
    .order("product_id")
    .abortSignal(signal);

  if (error) throw error;
  return data;
}

export async function mutateCart({ userId, action, productId, delta, expected }) {
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!userId || data.session?.user.id !== userId) throw { code: "42501" };

  const { error } = await supabase.rpc("mutate_cart", {
    p_user_id: userId,
    p_action: action,
    p_product_id: productId,
    p_delta: delta,
    p_expected: expected,
  }).retry(false);

  if (error) throw error;
}

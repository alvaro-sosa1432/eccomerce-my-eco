import { supabase } from "../lib/supabase";

async function assertSession(userId) {
  if (!supabase || !userId) throw new Error("Sesión requerida.");
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session?.user.id !== userId) throw new Error("La sesión cambió.");
}

export async function listWishlist(userId, signal) {
  await assertSession(userId);
  const { data, error } = await supabase.from("wishlists")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("product_id")
    .abortSignal(signal);

  if (error) throw error;
  return data.map(({ product_id }) => product_id);
}

export async function setWishlistProduct({ userId, productId, add }) {
  await assertSession(userId);

  const { error } = add
    ? await supabase.from("wishlists").insert({ user_id: userId, product_id: productId })
    : await supabase.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);

  // Another device may have already added this product.
  if (error && !(add && error.code === "23505")) throw error;
}

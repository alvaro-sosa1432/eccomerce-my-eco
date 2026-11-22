import { useQuery } from "@tanstack/react-query";

const productsUrl = "https://fakestoreapi.com/products";

const fetchProducts = async (path, signal, allowMissing = false) => {
  const response = await fetch(`${productsUrl}${path}`, { signal });
  if (allowMissing && (response.status === 404 || response.status === 204)) return null;
  if (!response.ok) throw new Error("No se pudieron cargar los productos");
  const body = await response.text();
  return allowMissing && !body.trim() ? null : JSON.parse(body);
};

export const GetProducts = () => useQuery({
  queryKey: ["Mostrando Productos"],
  queryFn: ({ signal }) => fetchProducts("?limit=6", signal),
});

export const GetProductsById = (id) => useQuery({
  queryKey: ["product", id],
  queryFn: async ({ signal }) => {
    const product = await fetchProducts(`/${encodeURIComponent(id)}`, signal, true);
    return product?.id ? product : null;
  },
  enabled: !!id,
});

export const GetProductsByCategory = (category) => useQuery({
  queryKey: ["Product category", category],
  queryFn: ({ signal }) => fetchProducts(`/category/${encodeURIComponent(category)}?limit=3`, signal),
  enabled: !!category,
});

export const GetAllProducts = (title, { enabled = true } = {}) => useQuery({
  queryKey: ["Listado de productos", title],
  queryFn: ({ signal }) => fetchProducts("/", signal),
  enabled,
});

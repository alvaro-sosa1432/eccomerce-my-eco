import { useQuery } from "@tanstack/react-query";

export const GetProducts = () => {
  const fetchProducts = async () => {
    const response = await fetch("https://fakestoreapi.com/products?limit=6");
    return response.json();
  };

  return useQuery({
    queryKey: ["Mostrando Productos"],
    queryFn: fetchProducts,
  });
};

export const GetProductsById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error("Error al cargar el producto");
      return response.json();
    },
    enabled: !!id,
  });
};

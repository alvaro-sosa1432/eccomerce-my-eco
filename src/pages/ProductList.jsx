import { GetAllProducts } from "../stack/GetProducts";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { CardProduct } from "../components/CardProduct";
import { useState } from "react";

export const ProductList = () => {
  const [search, setSearch] = useState(" ");
  const { data: products, isPending, error } = GetAllProducts();
  const navigate = useNavigate();

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <article className="my-16 lg:max-w-5xl mx-auto">
      <section>
        <div className="flex justify-center items-center">
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="border border-orange-300 rounded-lg px-2 py-1 outline-none my-8 "
            type="text"
            placeholder="Ingrese Nombre"
          />
        </div>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 mt-10 mx-10">
        {products?.map((product) => (
          <div className=" " key={product.id}>
            <CardProduct
              id={product.id}
              title={product.title}
              image={product.image}
              price={product.price}
            />
          </div>
        ))}
      </section>
    </article>
  );
};

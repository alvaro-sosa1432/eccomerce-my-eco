import { useNavigate } from "react-router-dom";
import { GetProductsByCategory } from "../stack/GetProducts";
import { CardProduct } from "./CardProduct";
import { Loader } from "./Loader";

export const CategorySection = ({ category }) => {
  const { data: product, isPending, error } = GetProductsByCategory(category);
  const navigate = useNavigate();

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <section>
      <h1 className="font-bold text-2xl text-orange-400">Pueden interesarte</h1>
      <div className=" grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3  w-full justify-start  rounded-lg">
        {product.map((item) => (
          <CardProduct
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
};

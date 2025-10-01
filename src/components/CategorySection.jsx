import { useNavigate } from "react-router-dom";
import { GetProductsByCategory } from "../stack/GetProducts";
import { CardProduct } from "./CardProduct";
import { Loader } from "./Loader";

export const CategorySection = ({ category, id }) => {
  const { data, isPending, error } = GetProductsByCategory(category);
  const navigate = useNavigate();

  const products = data?.filter((product) => product.id !== id);

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <section className="h-screen">
      <h1 className="font-bold text-2xl text-orange-400 my-10 text-center">
        Pueden interesarte
      </h1>
      <div className=" flex flex-col sm:flex-row justify-evenly items-center gap-4   rounded-lg">
        {products.map((item) => (
          <div key={item.id}>
            <CardProduct
              id={item.id}
              title={item.title}
              price={item.price}
              image={item.image}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

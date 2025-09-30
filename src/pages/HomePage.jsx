import { useNavigate } from "react-router-dom";
import { GetProducts } from "../stack/GetProducts";
import { CardProduct } from "../components/CardProduct";
import { Loader } from "../components/Loader";

export const HomePage = () => {
  const navigate = useNavigate();

  const { data, isPending, error } = GetProducts();

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <div className="md:max-w-2xl lg:max-w-3xl mx-auto">
      <section className="flex justify-center mx-auto mt-14  h-[300px]  ">
        <div className="bg-[url(/banner.jpg)] h-full  bg-no-repeat bg-cover w-full sm:rounded-b-lg  flex justify-center items-center ">
          <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="ml-8 text-4xl text-white font-bold text-center ">
              Bienvenidos a MyEccommerce!
            </h1>
            <span className=" hidden sm:block text-white text-2xl font-semibold">
              Disfrute su compra
            </span>
          </div>
        </div>
      </section>
      <section className=" mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center items-center gap-4 ">
        {data?.map((product) => (
          <div className=" mx-auto " key={product.id}>
            <CardProduct
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

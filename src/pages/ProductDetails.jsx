import { useNavigate, useParams } from "react-router-dom";
import { GetProductsById } from "../stack/GetProducts";
import { Loader } from "../components/Loader";

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isPending, error } = GetProductsById(id);

  if (isPending) return <Loader />;

  if (error) return navigate("*");

  return (
    <main className="  mx-auto h-screen max-w-2xl  ">
      <article className="w-full mt-18  ">
        <section className="grid grid-cols-1 sm:grid-cols-2 justify-between items-center gap-2">
          <div className="mx-auto flex justify-center">
            <img className="w-9/12" src={product.image} alt={product.title} />
          </div>
          <div className=" text-orange-400 flex flex-col items-start gap-4 h-full sm:border border-orange-200 p-4 rounded-lg  ">
            <div className="flex flex-col gap-2 p-4">
              <h1 className="text-2xl font-bold ">{product.title}</h1>
              <span className="font-semibold text-xl">{product.price} $</span>
            </div>
            <div className=" flex flex-col h-full  items-center justify-center mx-auto p-4 gap-4  ">
              <span className="uppercase font-semibold ">
                {product.category}
              </span>
              <p>{product.description}</p>
              <button className="bg-orange-400 w-full text-white rounded-lg p-2 hover:bg-orange-500 cursor-pointer transition-colors duration-300 ">
                Add Cart
              </button>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

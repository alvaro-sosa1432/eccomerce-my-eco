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
    <main className="flex flex-col justify-center items-center h-screen max-w-2xl  ">
      <article className="w-full  ">
        <div className="">
          <img className="w-5/12" src={product.image} alt="" />
        </div>
        <h1>{product.title}</h1>
        <div></div>
      </article>
    </main>
  );
};

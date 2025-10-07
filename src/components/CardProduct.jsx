import { ButtonDetails } from "./ButtonDetails";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Loader } from "./Loader";

export const CardProduct = ({ id, title, price, image }) => {
  const cortarTitulo = (titulo, maxPalabras = 5) => {
    const palabras = titulo.split(" ");
    return palabras.length > maxPalabras
      ? palabras.slice(0, maxPalabras).join(" ") + "..."
      : titulo;
  };

  return (
    <article className="flex flex-col  items-center justify-center mx-auto rounded-lg     h-96  ">
      <Link
        to={`/product/${id}`}
        className="flex flex-col justify-center items-center    "
      >
        <LazyLoadImage
          loading="lazy"
          decoding="async"
          className=" p-4 h-auto "
          width={200}
          height={200}
          src={image}
          alt={title}
          placeholder={<Loader />}
        />
        <div className="flex justify-end w-full p-2 relative  cursor-pointer">
          <Icon
            className="absolute -top-3 p-2 text-orange-400 z-0 hover:bg-orange-400 hover:text-white rounded-lg transition-colors duration-300  "
            icon="tdesign:cart-add-filled"
            width="40"
            height="40"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center items-center gap-2 text-center  p-2 text-orange-400 ">
        <h1 className="text-center text-xs font-bold line-clamp-2 ">
          {cortarTitulo(title)}
        </h1>
        <p className="font-semibold">{price}$</p>
        <ButtonDetails id={id} />
      </div>
    </article>
  );
};

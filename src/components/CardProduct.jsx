import { ButtonDetails } from "./ButtonDetails";
import { Icon } from "@iconify/react";

export const CardProduct = ({ id, title, price, image }) => {
  return (
    <article className="flex flex-col z-0  items-center justify-center mx-auto w-68  rounded-lg  h-96 ">
      <div className="flex flex-col justify-center items-center   ">
        <img className="w-11/12 p-4 h-50" src={image} alt={title} />
        <div className="flex justify-end w-full p-2 relative z-index cursor-pointer">
          <Icon
            className="absolute -top-3 p-2 text-orange-400 hover:bg-orange-400 hover:text-white rounded-lg transition-colors duration-300  "
            icon="tdesign:cart-add-filled"
            width="40"
            height="40"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-2 text-center  p-2 text-orange-400 ">
        <h1 className="text-center text-xs font-bold">{title}</h1>
        <p className="font-semibold">{price}$</p>
        <ButtonDetails id={id} />
      </div>
    </article>
  );
};

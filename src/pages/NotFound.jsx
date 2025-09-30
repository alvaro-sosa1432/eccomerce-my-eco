import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export const NotFound = () => {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <h2 className="text-orange-400 font-bold text-2xl">
        Ups A Ocurrido un Error!
      </h2>
      <Link
        to="/"
        className="flex  items-center justify-center gap-2  font-semibold w-40 bg-orange-400 rounded-lg p-2 text-white hover:bg-orange-500 cursor-pointer transition-colors duration-300 "
      >
        <Icon icon="bxs:home" width="24" height="24" />
        <span>Home</span>
      </Link>
    </div>
  );
};

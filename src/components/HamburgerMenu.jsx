import { useState } from "react";
import { Icon } from "@iconify/react";
// import { Link, useLocation } from "react-router-dom";

export const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const location = useLocation();
  // const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative text-white  ">
      <button
        onClick={toggleMenu}
        className="p-4 focus:outline-none "
        aria-label="Menú principal"
        aria-expanded={isOpen}
      >
        <div className="w-6 h-6 flex items-center ">
          <div className="">
            {isOpen ? (
              <Icon
                className="cursor-pointer text-white p-2  rounded-full transition-all duration-300 "
                icon="maki:cross"
                width="50"
                height="50"
              />
            ) : (
              <Icon
                className="cursor-pointer text-white p-2   rounded-full transition-colors duration-300 "
                icon="line-md:menu"
                width="50"
                height="50"
              />
            )}
          </div>
        </div>
      </button>

      {/* Menú desplegable */}
      <div
        className={`absolute  -left-2 right-0 w-screen  h-screen min-[350px]:w-78  bg-gradient-to-r from-orange-500 to-orange-400   shadow-lg  z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 visible transform translate-x-0"
            : "opacity-0 invisible transform -translate-x-2"
        }`}
      >
        <div className="w-76">
          <div className="flex flex-col gap-3 text-center p-4">
            {/* {currentPath !== "/" && (
              <Link to={`/`} className="">
                Inicio
              </Link>
            )}

            {currentPath !== "/characterlist" && (
              <Link to={`/characterlist`} className="">
                Mas Personajes
              </Link>
            )} */}
            <a className="flex justify-center gap-2" href="">
              <Icon icon="bxs:home" width="24" height="24" />
              Home
            </a>
            <a href="">Productos</a>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar al hacer clic fuera del menú */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40  bg-opacity-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

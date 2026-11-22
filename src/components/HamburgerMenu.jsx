import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { AccountNavigation } from "./AccountNavigation";
import { CartIcon } from "./AddToCartButton";
import { ThemeToggle } from "./ThemeToggle";
import { HeartIcon } from "./WishlistButton";
import { useAuth } from "../auth/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

export const HamburgerMenu = () => {
  const { isAuthenticated } = useAuth();
  const { data: favorites } = useWishlist();
  const { data: cart } = useCart();
  const units = cart?.reduce((total, { quantity }) => total + quantity, 0) ?? 0;
  const { key } = useLocation();
  const [openLocation, setOpenLocation] = useState(null);
  const isOpen = openLocation === key;
  const container = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOutside = (event) => {
      if (!container.current?.contains(event.target)) setOpenLocation(null);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpenLocation(null);
      button.current?.focus();
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const selectRoute = () => {
    if (isOpen) button.current?.focus();
    setOpenLocation(null);
  };

  return (
    <div ref={container} className="lg:contents">
      <button
        ref={button}
        type="button"
        onClick={() => setOpenLocation(isOpen ? null : key)}
        className="button button-secondary w-11 px-0 lg:hidden"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d={isOpen ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      <nav
        id="mobile-navigation"
        aria-label="Navegación principal"
        className={`${isOpen ? "flex" : "hidden"} panel absolute inset-x-4 top-full z-10 flex-col gap-1 p-2 shadow-lg sm:inset-x-auto sm:right-6 sm:w-60 lg:static lg:flex lg:w-auto lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center lg:gap-2 xl:gap-4 lg:border-0 lg:p-0 lg:shadow-none`}
      >
        <div className="flex flex-col gap-1 lg:mx-auto lg:flex-row">
          <NavLink to="/" end className="nav-link lg:px-2 xl:px-4" onClick={selectRoute}>Inicio</NavLink>
          <NavLink to="/productlist" className="nav-link lg:px-2 xl:px-4" onClick={selectRoute}>Productos</NavLink>
          <NavLink to="/wishlist" className="nav-link gap-2 lg:px-2 xl:px-4" onClick={selectRoute}>
            <HeartIcon />
            Favoritos
            {isAuthenticated && favorites && (
              <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold tabular-nums text-action">
                {favorites.length}
              </span>
            )}
          </NavLink>
          <NavLink to="/cart" className="nav-link gap-2 lg:px-2 xl:px-4" onClick={selectRoute}>
            <CartIcon />
            Carrito
            {isAuthenticated && units > 0 && (
              <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold tabular-nums text-action">
                {units}
              </span>
            )}
          </NavLink>
        </div>
        <AccountNavigation onSelect={selectRoute} />
        <ThemeToggle />
      </nav>
    </div>
  );
};

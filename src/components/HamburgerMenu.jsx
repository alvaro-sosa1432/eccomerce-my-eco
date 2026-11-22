import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export const HamburgerMenu = () => {
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
    button.current?.focus();
    setOpenLocation(null);
  };

  return (
    <div ref={container} className="md:hidden">
      <button
        ref={button}
        type="button"
        onClick={() => setOpenLocation(isOpen ? null : key)}
        className="button button-secondary w-11 px-0"
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
        hidden={!isOpen}
        className="panel absolute inset-x-4 top-full z-10 space-y-1 p-2 shadow-lg sm:inset-x-auto sm:right-6 sm:w-60"
      >
        <NavLink to="/" end className="nav-link w-full" onClick={selectRoute}>Inicio</NavLink>
        <NavLink to="/productlist" className="nav-link w-full" onClick={selectRoute}>Productos</NavLink>
      </nav>
    </div>
  );
};

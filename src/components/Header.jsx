import { Link, NavLink } from "react-router-dom";
import { HamburgerMenu } from "./HamburgerMenu";

export const Header = () => (
  <header className="border-b border-line bg-white">
    <div className="shell relative flex min-h-18 items-center justify-between gap-4">
      <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded-xl font-bold tracking-tight">
        <span className="grid size-10 place-items-center rounded-xl bg-tint text-action">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 8h15l1 13h-17l1-13Z M9 10V6a3 3 0 0 1 6 0v4" />
          </svg>
        </span>
        MyEccommerce
      </Link>
      <nav aria-label="Navegación principal" className="hidden items-center gap-2 md:flex">
        <NavLink to="/" end className="nav-link">Inicio</NavLink>
        <NavLink to="/productlist" className="nav-link">Productos</NavLink>
      </nav>
      <HamburgerMenu />
    </div>
  </header>
);

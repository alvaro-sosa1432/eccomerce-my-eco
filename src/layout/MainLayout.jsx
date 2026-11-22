import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Header } from "../components/Header";

export const MainLayout = () => {
  const { pathname } = useLocation();
  const main = useRef(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="button button-primary sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-20"
        onClick={() => main.current?.focus()}
      >
        Ir al contenido
      </button>
      <Header />
      <main ref={main} tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
    </>
  );
};

import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuthAction } from "../auth/authForm";
import { useAuth } from "../auth/useAuth";
import { notify } from "../lib/notify";
import { supabase } from "../lib/supabase";

export function AccountNavigation({ onSelect }) {
  const { user, isInitializing } = useAuth();
  const { pending, error, run } = useAuthAction("No pudimos confirmar el cierre en el servidor.", "No pudimos cerrar sesión");
  const login = useRef(null);

  function signOut() {
    run(async () => {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      notify("info", "Sesión cerrada", "Cerraste sesión correctamente");
    }, () => requestAnimationFrame(() => login.current?.focus()));
  }

  if (isInitializing) return <span role="status" className="nav-link">Comprobando sesión…</span>;

  return (
    <div aria-label="Cuenta" className="relative flex min-w-0 flex-col gap-1 lg:flex-row lg:items-center">
      {user ? (
        <>
          <span className="truncate px-4 text-sm font-semibold text-muted lg:max-w-40 xl:max-w-60" title={user.email}>
            {user.email || "Mi cuenta"}
          </span>
          <button type="button" onClick={signOut} disabled={pending} className="button button-secondary shrink-0 disabled:opacity-70">
            {pending ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </>
      ) : (
        <>
          <NavLink ref={login} to="/login" className="nav-link" onClick={onSelect}>Iniciar sesión</NavLink>
          <NavLink to="/register" className="button button-secondary" onClick={onSelect}>Registrarse</NavLink>
        </>
      )}
      {error && <p role="alert" className="rounded-xl bg-danger-surface p-3 text-sm text-danger lg:absolute lg:top-full lg:right-0 lg:z-10 lg:mt-2 lg:w-60">{error}</p>}
    </div>
  );
}

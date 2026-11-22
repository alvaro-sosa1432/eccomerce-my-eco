import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { authConfigError } from "../lib/supabase";

export function RequireAuth() {
  const { pathname, search, hash } = useLocation();
  const { isAuthenticated, isInitializing, initializationError } = useAuth();

  if (isInitializing) return <p className="shell py-8" role="status">Comprobando sesión…</p>;
  if (authConfigError || initializationError) {
    return <p className="shell py-8" role="alert">{authConfigError || "No pudimos comprobar tu sesión. Recargá la página."}</p>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: pathname + search + hash }} />;
  }
  return <Outlet />;
}

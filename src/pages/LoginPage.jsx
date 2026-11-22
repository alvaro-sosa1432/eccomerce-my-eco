import { Navigate, useLocation } from "react-router-dom";
import { AuthFeedback, AuthForm, AuthSubmit, EmailField, PasswordField } from "../components/AuthForm";
import { safeReturnPath, useAuthAction } from "../auth/authForm";
import { notify } from "../lib/notify";
import { useAuth } from "../auth/useAuth";
import { authConfigError, supabase } from "../lib/supabase";

export function LoginPage() {
  const location = useLocation();
  const { isAuthenticated, isInitializing, initializationError } = useAuth();
  const { pending, error, run } = useAuthAction("Volvé a intentar en unos minutos.", "No pudimos iniciar sesión");

  if (isAuthenticated) return <Navigate to={safeReturnPath(location.state?.from)} replace />;

  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    run(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fields.get("email").trim(),
        password: fields.get("password"),
      });
      if (error) throw error;
      if (!data.session) throw new Error("Sesión no disponible.");
      notify("success", "¡Bienvenido!", "Iniciaste sesión correctamente");
    });
  }

  return (
    <AuthForm title="Iniciar sesión" links={[["/register", "Registrarse"], ["/forgot-password", "Recuperar contraseña"], ["/", "Inicio"]]}>
      <AuthFeedback
        error={authConfigError || error || (initializationError && "No pudimos comprobar la sesión. Podés volver a iniciar sesión.")}
        status={isInitializing && "Comprobando sesión…"}
      />
      {!authConfigError && !isInitializing && (
        <form className="space-y-4" onSubmit={submit} aria-busy={pending}>
          <EmailField />
          <PasswordField />
          <AuthSubmit pending={pending}>{pending ? "Iniciando sesión…" : "Iniciar sesión"}</AuthSubmit>
        </form>
      )}
    </AuthForm>
  );
}

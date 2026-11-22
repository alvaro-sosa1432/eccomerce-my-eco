import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthFeedback, AuthForm, AuthSubmit, EmailField, PasswordField } from "../components/AuthForm";
import { passwordMinLength, useAuthAction, validatePasswords } from "../auth/authForm";
import { notify } from "../lib/notify";
import { useAuth } from "../auth/useAuth";
import { authConfigError, authRedirectUrl, supabase } from "../lib/supabase";

export function RegisterPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const [sent, setSent] = useState(false);
  const { pending, error, setError, run } = useAuthAction("Volvé a intentar en unos minutos.", "No pudimos crear tu cuenta");

  if (isAuthenticated) return <Navigate to="/" replace />;

  function submit(event) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const password = fields.get("password");
    const validationError = validatePasswords(password, fields.get("confirmation"));
    if (validationError) return setError(validationError);
    run(async () => {
      const { data, error } = await supabase.auth.signUp({
        email: fields.get("email").trim(),
        password,
        options: { emailRedirectTo: authRedirectUrl },
      });
      if (error) throw error;
      if (data.session) {
        notify("success", "¡Cuenta creada!", "Tu cuenta se creó correctamente");
      } else {
        notify("info", "Revisá tu correo", "Te enviamos las instrucciones para confirmar tu cuenta");
      }
      return Boolean(data.session);
    }, (hasSession) => setSent(!hasSession));
  }

  return (
    <AuthForm title="Crear cuenta" links={[["/login", "Iniciar sesión"], ["/", "Inicio"]]}>
      <AuthFeedback
        error={authConfigError || error}
        status={isInitializing ? "Comprobando sesión…" : sent && "Revisá tu bandeja de entrada y la carpeta de spam. Si recibís un enlace de confirmación, abrilo para activar tu cuenta."}
      />
      {!authConfigError && !isInitializing && !sent && (
        <form className="space-y-4" onSubmit={submit} aria-busy={pending}>
          <EmailField />
          <PasswordField isNew />
          <PasswordField isNew name="confirmation" label="Confirmar contraseña" />
          <p className="text-sm text-muted">Usá al menos {passwordMinLength} caracteres.</p>
          <AuthSubmit pending={pending}>{pending ? "Creando cuenta…" : "Crear cuenta"}</AuthSubmit>
        </form>
      )}
    </AuthForm>
  );
}

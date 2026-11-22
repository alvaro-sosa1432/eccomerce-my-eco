import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { passwordMinLength } from "../auth/authForm";

export function AuthForm({ title, children, links }) {
  const titleId = useId();
  return (
    <div className="shell py-9 sm:py-14">
      <section aria-labelledby={titleId} className="panel mx-auto max-w-md space-y-5 p-5 sm:p-8">
        <h1 id={titleId} className="section-title">{title}</h1>
        {children}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-action">
          {links.map(([to, label]) => <Link key={to} to={to} className="rounded underline underline-offset-4">{label}</Link>)}
        </div>
      </section>
    </div>
  );
}

export function EmailField() {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      Correo electrónico
      <input type="email" name="email" autoComplete="email" required className="field font-normal" />
    </label>
  );
}

export function PasswordField({ name = "password", label = "Contraseña", isNew = false }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid gap-2 text-sm font-semibold">
      <label htmlFor={id}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={isNew ? "new-password" : "current-password"}
          minLength={isNew ? passwordMinLength : undefined}
          required
          className="field font-normal"
        />
        <button
          className="button button-secondary"
          type="button"
          aria-label={`${visible ? "Ocultar" : "Mostrar"}: ${label.toLowerCase()}`}
          aria-controls={id}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </div>
  );
}

export function AuthFeedback({ error, status }) {
  return (
    <>
      {error && <p role="alert" className="rounded-xl bg-danger-surface p-3 text-sm text-danger">{error}</p>}
      {status && <p role="status" className="rounded-xl bg-tint p-3 text-sm text-ink">{status}</p>}
    </>
  );
}

export function AuthSubmit({ pending, children }) {
  return (
    <button type="submit" disabled={pending} className="button button-primary w-full disabled:cursor-wait disabled:opacity-70">
      {children}
    </button>
  );
}

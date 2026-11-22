import { setTheme, useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const dark = useTheme() === "dark";
  const label = dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  return (
    <button
      type="button"
      className="button button-secondary justify-start lg:w-11 lg:shrink-0 lg:justify-center lg:px-0"
      aria-label={label}
      title={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19" />
          </>
        ) : <path d="M20.8 14.3A9 9 0 0 1 9.7 3.2a9 9 0 1 0 11.1 11.1Z" />}
      </svg>
      <span className="lg:hidden">{label}</span>
    </button>
  );
}

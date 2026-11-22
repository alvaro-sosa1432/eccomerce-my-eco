import { useId, useLayoutEffect, useRef } from "react";

export function ClearCartDialog({ open, pending, disabled, onDismiss, onConfirm, trigger, fallbackFocus }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialog = useRef(null);
  const cancelButton = useRef(null);
  const confirmButton = useRef(null);
  const progress = useRef(null);
  const wasPending = useRef(false);
  const pressedBackdrop = useRef(false);

  useLayoutEffect(() => {
    if (!open) return;

    const element = dialog.current;
    const notifications = document.getElementById("commerce-notifications");
    const opener = trigger.current;
    const fallback = fallbackFocus.current;

    element.showModal();
    // The shared Sileo viewport must be inside the native modal's top layer.
    element.append(notifications);
    pressedBackdrop.current = false;
    cancelButton.current.focus();

    return () => {
      document.body.append(notifications);
      element.close();
      const target = opener?.isConnected && !opener.disabled ? opener : fallback;
      target?.focus();
    };
  }, [open, trigger, fallbackFocus]);

  useLayoutEffect(() => {
    if (open && pending) progress.current.focus();
    if (open && !pending && wasPending.current && !disabled) confirmButton.current.focus();
    wasPending.current = pending;
  }, [open, pending, disabled]);

  function dismiss() {
    if (!pending) onDismiss();
  }

  return (
    <dialog
      ref={dialog}
      className="clear-cart-dialog fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-auto bg-transparent text-ink"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onPointerDown={(event) => { pressedBackdrop.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (pressedBackdrop.current && event.target === event.currentTarget) dismiss();
        pressedBackdrop.current = false;
      }}
    >
      <div className="panel rounded-2xl p-5 shadow-xl sm:p-7">
        <div className="mb-4 grid size-11 place-items-center rounded-xl bg-tint text-action">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" />
          </svg>
        </div>
        <h2 id={titleId} className="section-title">¿Vaciar el carrito?</h2>
        <p id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
          Se eliminarán todos los productos de tu carrito. Esta acción no se puede deshacer.
        </p>
        <p ref={progress} role="status" tabIndex={-1} className="sr-only">{pending ? "Vaciando carrito…" : ""}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelButton} type="button" className="button button-secondary disabled:opacity-60" disabled={pending} onClick={dismiss}>
            Cancelar
          </button>
          <button ref={confirmButton} type="button" className="button button-primary disabled:opacity-60" disabled={disabled} aria-busy={pending} onClick={onConfirm}>
            {pending ? "Vaciando…" : "Sí, vaciar"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

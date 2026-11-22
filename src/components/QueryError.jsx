export const QueryError = ({ message, retry, isFetching }) => (
  <div className="state-panel">
    <p role="alert" className="font-semibold">{message}</p>
    <button type="button" onClick={retry} disabled={isFetching} className="button button-secondary disabled:opacity-60">
      {isFetching ? "Reintentando…" : "Reintentar"}
    </button>
  </div>
);

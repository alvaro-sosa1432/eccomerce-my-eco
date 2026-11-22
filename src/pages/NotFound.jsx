import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="shell py-10">
    <div className="state-panel">
      <h1 className="section-title">Página no encontrada</h1>
      <Link to="/" className="button button-primary">Volver al inicio</Link>
    </div>
  </div>
);

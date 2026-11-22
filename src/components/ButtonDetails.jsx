import { Link } from "react-router-dom";

export const ButtonDetails = ({ id, title }) => (
  <Link
    to={`/product/${id}`}
    className="button button-secondary w-full justify-between"
    aria-label={`Ver detalles de ${title}`}
  >
    Ver detalles <span aria-hidden="true">→</span>
  </Link>
);

import { Link } from "react-router-dom";

export const ButtonDetails = ({ id }) => {
  return (
    <Link
      className="bg-orange-400 w-40 rounded-lg py-2 hover:bg-orange-500 transition-colors duration-300 text-white"
      to={`product/${id}`}
    >
      Mas Detalles
    </Link>
  );
};

import { ButtonDetails } from "./ButtonDetails";
import { categoryLabel, formatPrice } from "../utils/products";

export const CardProduct = ({ id, title, price, image, category }) => (
  <article className="panel flex min-w-0 flex-col p-3 hover:border-stone-300 hover:shadow-sm motion-safe:transition-[border-color,box-shadow]">
    <div className="product-media aspect-[5/4] rounded-xl">
      <img
        className="product-image p-5 sm:p-7"
        width="240"
        height="192"
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
      />
    </div>
    <div className="flex flex-1 flex-col px-1 pt-4 pb-1">
      <p className="mb-1.5 text-xs font-semibold text-action">{categoryLabel(category)}</p>
      <h3 className="line-clamp-2 min-h-11 text-sm leading-[1.375rem] font-semibold wrap-anywhere" title={title}>{title}</h3>
      <p className="mt-3 mb-4 text-lg font-bold tracking-tight tabular-nums">{formatPrice(price)}</p>
      <div className="mt-auto"><ButtonDetails id={id} title={title} /></div>
    </div>
  </article>
);

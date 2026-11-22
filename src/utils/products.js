const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "code",
});

export const formatPrice = (price) => currency.format(price);

const categoryLabels = {
  electronics: "Electrónica",
  jewelery: "Joyería",
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer",
};

export const categoryLabel = (category) => categoryLabels[category] ?? category;

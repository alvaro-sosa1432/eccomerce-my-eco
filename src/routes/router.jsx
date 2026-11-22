import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { ProductDetails } from "../pages/ProductDetails";
import { ProductList } from "../pages/ProductList";

export const EccommerceRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

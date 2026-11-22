import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { ProductDetails } from "../pages/ProductDetails";
import { ProductList } from "../pages/ProductList";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { UpdatePasswordPage } from "../pages/UpdatePasswordPage";
import { WishlistPage } from "../pages/WishlistPage";
import { CartPage } from "../pages/CartPage";
import { RequireAuth } from "./RequireAuth";

export const EccommerceRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="update-password" element={<UpdatePasswordPage />} />
          <Route element={<RequireAuth />}>
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

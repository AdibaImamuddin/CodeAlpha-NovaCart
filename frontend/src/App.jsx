
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import VerifyOtp from "./pages/VerifyOtp";
import FAQ from "./pages/FAQ";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Addresses from "./pages/Addresses";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function AppContent() {
  const location = useLocation();

  const hideHeader =
    location.pathname === "/dashboard" ||
    location.pathname === "/orders" ||
    location.pathname === "/addresses" ||
    location.pathname === "/profile" ||
    location.pathname === "/change-password" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Protected Admin Panel */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;

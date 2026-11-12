
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Heart
} from "lucide-react";

import { useCart } from "../context/CartContext";
import "../styles/header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { cartCount } = useCart();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Product Search
  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/shop?search=${encodeURIComponent(searchQuery.trim())}`
    );

    setSearchQuery("");
    closeMenu();
  };

  // Dark / Light Theme
  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    setDarkMode(newTheme === "dark");
  };

  return (
    <header className="site-header">
      <div className="header-inner container">

        {/* Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          NOVA<span>CART.</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/shop" onClick={closeMenu}>
            Shop
          </Link>

          <Link to="/collections" onClick={closeMenu}>
            Collections
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link to="/faq" onClick={closeMenu}>
            FAQ
          </Link>

          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>

          <Link
            to="/register"
            className="header-register-link"
            onClick={closeMenu}
          >
            Create Account
          </Link>

        </nav>

        {/* Header Actions */}
        <div className="header-actions">

          {/* Search */}
          <form
            className="header-search-form"
            onSubmit={handleSearch}
          >
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />

            <button
              type="submit"
              className="icon-btn"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="icon-btn"
            aria-label="Wishlist"
            onClick={closeMenu}
          >
            <Heart size={20} />
          </Link>

          {/* Shopping Cart */}
          <Link
            to="/cart"
            className="icon-btn cart-btn"
            aria-label={`Shopping cart, ${cartCount} items`}
            onClick={closeMenu}
          >
            <ShoppingBag size={20} />
            <span className="cart-count">{cartCount}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Mobile Menu */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;

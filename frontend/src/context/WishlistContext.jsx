
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../services/api.js";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("novacart-wishlist");
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Fetch wishlist from MongoDB after login
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const data = await apiRequest("/wishlist");

        const products = data.products.map((item) => ({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
        }));

        setWishlistItems(products);
      } catch (error) {
        console.error("Wishlist fetch error:", error.message);
      }
    };

    fetchWishlist();
  }, []);

  // Save wishlist in Local Storage
  useEffect(() => {
    localStorage.setItem(
      "novacart-wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  // Add or remove product
  const toggleWishlist = async (product) => {
    const productId = String(product.id ?? product._id ?? "");

    if (!productId) {
      console.error("Product ID is missing.");
      return;
    }

    const exists = wishlistItems.some(
      (item) => String(item.id) === productId
    );

    if (exists) {
      setWishlistItems((previous) =>
        previous.filter((item) => String(item.id) !== productId)
      );

      if (localStorage.getItem("token")) {
        try {
          await apiRequest(
            `/wishlist/${encodeURIComponent(productId)}`,
            { method: "DELETE" }
          );
        } catch (error) {
          console.error("Wishlist remove error:", error.message);
        }
      }

      return;
    }

    const newProduct = {
      id: productId,
      name: product.name ?? product.title ?? "Product",
      price: Number(product.price ?? 0),
      image: product.image ?? product.imageUrl ?? "",
    };

    setWishlistItems((previous) => [...previous, newProduct]);

    if (localStorage.getItem("token")) {
      try {
        await apiRequest("/wishlist", {
          method: "POST",
          body: JSON.stringify({
            productId,
            name: newProduct.name,
            price: newProduct.price,
            image: newProduct.image,
          }),
        });
      } catch (error) {
        console.error("Wishlist add error:", error.message);
      }
    }
  };

  // Check whether product is wishlisted
  const isWishlisted = (id) => {
    return wishlistItems.some(
      (item) => String(item.id) === String(id)
    );
  };

  // Remove product
  const removeFromWishlist = async (id) => {
    setWishlistItems((previous) =>
      previous.filter((item) => String(item.id) !== String(id))
    );

    if (localStorage.getItem("token")) {
      try {
        await apiRequest(
          `/wishlist/${encodeURIComponent(String(id))}`,
          { method: "DELETE" }
        );
      } catch (error) {
        console.error("Wishlist remove error:", error.message);
      }
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    const currentItems = [...wishlistItems];

    setWishlistItems([]);

    if (localStorage.getItem("token")) {
      try {
        await Promise.all(
          currentItems.map((item) =>
            apiRequest(
              `/wishlist/${encodeURIComponent(String(item.id))}`,
              { method: "DELETE" }
            )
          )
        );
      } catch (error) {
        console.error("Clear wishlist error:", error.message);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}

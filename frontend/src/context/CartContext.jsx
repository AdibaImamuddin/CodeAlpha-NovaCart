
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("novacart-cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("novacart-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((previous) => {
      const existing = previous.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previous.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...previous, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

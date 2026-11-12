
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page container">
        <div className="cart-empty">
          <ShoppingBag size={55} />
          <h1>Your Bag Is Empty</h1>
          <p>Looks like you haven't added anything to your bag yet.</p>
          <Link to="/shop" className="cart-shop-btn">
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page container">
      <div className="cart-heading">
        <div>
          <p className="cart-eyebrow">YOUR SHOPPING BAG</p>
          <h1>Shopping Bag</h1>
          <p>{cartItems.length} product(s) in your bag</p>
        </div>

        <Link to="/shop" className="continue-shopping">
          <ArrowLeft size={17} />
          Continue Shopping
        </Link>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <strong>Rs. {item.price.toLocaleString()}</strong>

                <div className="cart-quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              <div className="cart-item-actions">
                <strong>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </strong>

                <button
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>Rs. {cartTotal.toLocaleString()}</strong>
          </div>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>

          <Link to="/shop" className="summary-continue">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;

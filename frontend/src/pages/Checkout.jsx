
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PackageCheck, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { apiRequest } from "../services/api";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadAddresses = async () => {
      if (!localStorage.getItem("token")) {
        setLoadingAddresses(false);
        return;
      }

      try {
        const data = await apiRequest("/addresses");
        const savedAddresses = data.addresses || [];

        setAddresses(savedAddresses);

        const defaultAddress = savedAddresses.find(
          (item) => item.isDefault
        );

        if (defaultAddress) {
          selectAddress(defaultAddress);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, []);

  const selectAddress = (address) => {
    setSelectedAddress(address._id);

    setForm((previous) => ({
      ...previous,
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSelectedAddress("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (cartItems.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!localStorage.getItem("token")) {
      setError("Please login before placing your order.");
      return;
    }

    setSubmitting(true);

    try {
      if (saveAddress && !selectedAddress) {
        const addressData = await apiRequest("/addresses", {
          method: "POST",
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone,
            addressLine: form.address,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "Pakistan",
          }),
        });

        setAddresses(addressData.addresses || []);
      }

      const orderData = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: String(item.id),
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image || "",
          })),

          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine: form.address,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: "Pakistan",
          },

          paymentMethod: "COD",

          totalAmount: cartItems.reduce(
            (total, item) =>
              total + Number(item.price) * Number(item.quantity),
            0
          ),
        }),
      });

      const savedOrder = orderData.order;

      sessionStorage.setItem(
        "novacart-order",
        JSON.stringify({
          orderId: savedOrder.orderId,
          total: savedOrder.totalAmount,
          itemCount: savedOrder.items.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          date: savedOrder.createdAt,
        })
      );

      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError(err.message || "Unable to place your order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page container">
        <div className="checkout-empty">
          <PackageCheck size={45} />
          <h2>Your shopping bag is empty</h2>
          <p>Add products before proceeding to checkout.</p>
          <Link to="/shop">Explore Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page container">
      <Link to="/cart" className="checkout-back">
        <ArrowLeft size={17} />
        Back to Shopping Bag
      </Link>

      <div className="checkout-heading">
        <p className="checkout-eyebrow">NOVA CART / YOUR ORDER</p>
        <h1>Checkout</h1>
        <p>Enter your shipping details to complete your order.</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-layout">
        <section className="checkout-form">
          <h2>Shipping Information</h2>
          <p className="checkout-section-text">
            Where should we deliver your order?
          </p>

          {loadingAddresses && <p>Loading saved addresses...</p>}

          {addresses.length > 0 && (
            <div className="checkout-field full-width">
              <label htmlFor="savedAddress">Choose a Saved Address</label>
              <select
                id="savedAddress"
                value={selectedAddress}
                onChange={(e) => {
                  const address = addresses.find(
                    (item) => item._id === e.target.value
                  );

                  if (address) {
                    selectAddress(address);
                  } else {
                    setSelectedAddress("");
                    setForm((previous) => ({
                      ...previous,
                      fullName: "",
                      phone: "",
                      address: "",
                      city: "",
                      state: "",
                      postalCode: "",
                    }));
                  }
                }}
              >
                <option value="">Enter a new address</option>

                {addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {address.fullName} - {address.city}
                    {address.isDefault ? " (Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="checkout-fields">
            <div className="checkout-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
                pattern="03[0-9]{9}"
                title="Enter a valid 11-digit Pakistani mobile number starting with 03."
                autoComplete="tel"
                required
              />
            </div>

            <div className="checkout-field full-width">
              <label htmlFor="address">Complete Address</label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House number, street and area"
                rows={4}
                autoComplete="street-address"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
                autoComplete="address-level2"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="state">State / Province</label>
              <input
                id="state"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter your province"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="postalCode">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                autoComplete="postal-code"
                required
              />
            </div>
          </div>

          {localStorage.getItem("token") && (
            <label className="payment-option">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              <span>
                <strong>Save this delivery address</strong>
                <small>Keep this address in your account.</small>
              </span>
            </label>
          )}

          <div className="payment-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="COD"
                defaultChecked
              />
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives.</small>
              </span>
            </label>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button
            type="submit"
            className="place-order-btn"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Place Order"}
          </button>

          <p className="checkout-security">
            <ShieldCheck size={16} />
            Demo checkout — no payment will be collected.
          </p>
        </section>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-products">
            {cartItems.map((item) => (
              <div className="checkout-product" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="checkout-product-info">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <strong>
                    Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>Rs. {cartTotal.toLocaleString("en-PK")}</span>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="checkout-grand-total">
            <span>Total</span>
            <strong>Rs. {cartTotal.toLocaleString("en-PK")}</strong>
          </div>

          <p className="checkout-summary-note">
            Shipping charges are shown as free for this frontend demo.
          </p>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;

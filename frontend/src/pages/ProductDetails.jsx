
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { products } from "../data/product.js";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find(
    (item) => String(item.id) === id
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="product-details-page">
        <h2>Product Not Found</h2>
        <Link to="/shop">Back to Shop</Link>
      </main>
    );
  }

  const handleAddToBag = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  return (
    <main className="product-details-page">

      <Link to="/shop" className="back-link">
        <ArrowLeft size={18} />
        Back to Shop
      </Link>

      <section className="product-details-layout">

        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">

          <span className="detail-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          <div className="detail-price">
            Rs. {product.price.toLocaleString("en-PK")}
          </div>

          <p className="detail-description">
            {product.description ||
              "Discover quality and style with this carefully selected NovaCart product."}
          </p>

          <div className="quantity-section">
            <span>Quantity</span>

            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                <Minus size={16} />
              </button>

              <span>{quantity}</span>

              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <h3 className="detail-total">
            Total: Rs. {(product.price * quantity).toLocaleString("en-PK")}
          </h3>

          <button
            className="detail-add-btn"
            onClick={handleAddToBag}
          >
            <ShoppingBag size={19} />
            {added ? "Added Successfully" : "Add to Bag"}
          </button>

          {added && (
            <p className="cart-success-message">
              Product successfully added to your shopping bag!
              <Link to="/cart"> View Cart</Link>
            </p>
          )}

        </div>

      </section>
    </main>
  );
}

export default ProductDetails;

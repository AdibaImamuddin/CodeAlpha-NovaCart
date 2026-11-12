
import { Link, Navigate } from "react-router-dom";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

function OrderSuccess() {
  const savedOrder = sessionStorage.getItem("novacart-order");

  if (!savedOrder) {
    return <Navigate to="/shop" replace />;
  }

  const order = JSON.parse(savedOrder);

  return (
    <main className="order-success-page container">

      <div className="success-card">

        <div className="success-icon">
          <CheckCircle size={65} />
        </div>

        <p className="success-eyebrow">NOVA CART</p>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for shopping with NovaCart.
          Your order has been received successfully.
        </p>

        <div className="order-details">
          <div className="order-detail-row">
            <span>Order ID</span>
            <strong>{order.orderId}</strong>
          </div>

          <div className="order-detail-row">
            <span>Total Items</span>
            <strong>{order.itemCount}</strong>
          </div>

          <div className="order-detail-row">
            <span>Payment Method</span>
            <strong>Cash on Delivery</strong>
          </div>

          <div className="order-detail-row">
            <span>Order Total</span>
            <strong>
              Rs. {order.total.toLocaleString("en-PK")}
            </strong>
          </div>
        </div>

        <div className="success-note">
          <Package size={20} />
          <span>
            This is a demo confirmation. Your order has not been
            sent to a real store or database.
          </span>
        </div>

        <Link to="/shop" className="success-shop-btn">
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>

      </div>

    </main>
  );
}

export default OrderSuccess;

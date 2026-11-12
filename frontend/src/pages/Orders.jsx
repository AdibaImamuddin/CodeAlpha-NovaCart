
import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Wallet,
  Truck,
  Heart,
  Package,
  User,
  MapPin,
  LogOut,
  Store,
  LockKeyhole,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

import { apiRequest } from "../services/api";
import "../styles/dashboard.css";

function Orders() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Store },
    { path: "/orders", label: "My Orders", icon: ShoppingBag },
    { path: "/wishlist", label: "My Wishlist", icon: Heart },
    { path: "/checkout", label: "Delivery Address", icon: MapPin },
    { path: "/profile", label: "Personal Information", icon: User },
    { path: "/change-password", label: "Change Password", icon: LockKeyhole },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/orders/my-orders");

      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    return (status || "Pending").toLowerCase();
  };

  return (
    <main className="customer-dashboard">
      <button
        className="dashboard-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle dashboard menu"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {sidebarOpen && (
        <div
          className="dashboard-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <h2 className="dashboard-logo">NOVACART.</h2>

        <p className="dashboard-menu-label">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `dashboard-menu ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              {item.label}
            </NavLink>
          );
        })}

        <button className="dashboard-menu" onClick={handleLogout}>
          <LogOut size={19} />
          Logout
        </button>

        <div className="dashboard-promo">
          <ShoppingBag size={25} />
          <h3>Happy Shopping!</h3>
          <p>Discover something beautiful today.</p>
          <Link to="/shop" onClick={closeSidebar}>
            Explore Shop
          </Link>
        </div>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-welcome">
          <p>MY ACCOUNT / MY ORDERS</p>
          <h1>My Orders</h1>
          <span>
            Welcome {user.name || "Customer"}, view your shopping history here.
          </span>
        </div>

        <div className="dashboard-orders">
          <div className="orders-heading">
            <h2>Order History</h2>

            <button
              className="orders-refresh-btn"
              onClick={fetchOrders}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="dashboard-empty">
              <Package size={40} />
              <h3>Could not load orders</h3>
              <p>{error}</p>
              <button onClick={fetchOrders}>Try Again</button>
            </div>
          ) : orders.length === 0 ? (
            <div className="dashboard-empty">
              <Package size={40} />
              <h3>No orders yet</h3>
              <p>Your purchases will appear here.</p>
              <Link to="/shop">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article
                  className="order-card"
                  key={order._id || order.orderId}
                >
                  <div className="order-card-header">
                    <div>
                      <span>Order ID</span>
                      <h3>{order.orderId}</h3>
                    </div>

                    <span
                      className={`order-status ${getStatusClass(order.status)}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="order-card-info">
                    <p>
                      <strong>Date:</strong> {formatDate(order.createdAt)}
                    </p>

                    <p>
                      <strong>Items:</strong> {order.items?.length || 0}
                    </p>

                    <p>
                      <strong>Payment:</strong> {order.paymentMethod || "COD"}
                    </p>

                    <p>
                      <strong>Total:</strong> Rs.{" "}
                      {Number(order.totalAmount || 0).toLocaleString("en-PK")}
                    </p>
                  </div>

                  <div className="order-products">
                    {order.items?.map((item, index) => (
                      <div
                        className="order-product-row"
                        key={item.productId || index}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="order-product-placeholder">
                            <ShoppingBag size={20} />
                          </div>
                        )}

                        <div>
                          <strong>{item.name}</strong>
                          <p>
                            Quantity: {item.quantity} · Rs. {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Orders;

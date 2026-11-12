
import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import { apiRequest } from "../services/api";

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
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!localStorage.getItem("token")) {
        navigate("/login");
        return;
      }

      try {
        const [ordersResponse, wishlistResponse] = await Promise.all([
          apiRequest("/orders/my-orders"),
          apiRequest("/wishlist"),
        ]);

        setOrders(ordersResponse.orders || []);

        const products =
          wishlistResponse.wishlist?.products ||
          wishlistResponse.products ||
          wishlistResponse.data?.products ||
          [];

        setWishlistCount(products.length);
      } catch (error) {
        console.error("Dashboard data error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const activeOrders = orders.filter((order) =>
    ["Pending", "Confirmed", "Shipped"].includes(order.status)
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: loading ? "..." : totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Total Spent",
      value: loading
        ? "..."
        : `Rs. ${totalSpent.toLocaleString("en-PK")}`,
      icon: Wallet,
    },
    {
      title: "Active Orders",
      value: loading ? "..." : activeOrders,
      icon: Truck,
    },
    {
      title: "Wishlist Items",
      value: loading ? "..." : wishlistCount,
      icon: Heart,
    },
  ];

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
        <div className="dashboard-overlay" onClick={closeSidebar} />
      )}

      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <h2 className="dashboard-logo">NOVACART.</h2>

        <p className="dashboard-menu-label">MENU</p>

        {[
          { path: "/dashboard", label: "Dashboard", icon: Store },
          { path: "/orders", label: "My Orders", icon: ShoppingBag },
          { path: "/wishlist", label: "My Wishlist", icon: Heart },
          { path: "/addresses", label: "Delivery Address", icon: MapPin },
         { path: "/profile", label: "Personal Information", icon: User },
          {
            path: "/change-password",
            label: "Change Password",
            icon: LockKeyhole,
          },
        ].map((item) => {
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
          <p>MY ACCOUNT / DASHBOARD</p>
          <h1>Welcome back, {user.name || "Customer"}!</h1>
          <span>
            Here is an overview of your shopping activity.
          </span>
        </div>

        <div className="dashboard-stats">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div className="dashboard-stat-card" key={item.title}>
                <Icon size={25} />
                <p>{item.title}</p>
                <h2>{item.value}</h2>
              </div>
            );
          })}
        </div>

        <div className="dashboard-sections">
          <div className="dashboard-orders">
            <h2>Recent Orders</h2>

            {loading ? (
              <div className="dashboard-empty">
                <p>Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="dashboard-empty">
                <Package size={40} />
                <h3>No orders yet</h3>
                <p>Your purchases will appear here.</p>
                <Link to="/shop">Start Shopping</Link>
              </div>
            ) : (
              <>
                {orders.slice(0, 3).map((order) => (
                  <div className="recent-order-item" key={order._id}>
                    <div>
                      <strong>{order.orderId}</strong>
                      <p>{order.status}</p>
                    </div>
                    <strong>
                      Rs. {Number(order.totalAmount || 0).toLocaleString("en-PK")}
                    </strong>
                  </div>
                ))}

                <Link className="view-all-orders" to="/orders">
                  View All Orders
                </Link>
              </>
            )}
          </div>

          <div className="dashboard-profile">
            <h2>Account Overview</h2>
            <User size={35} />
            <h3>{user.name || "Customer"}</h3>
            <p>{user.email || "Email not available"}</p>
            <p>Customer Account</p>
            <Link to="/shop">Continue Shopping</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

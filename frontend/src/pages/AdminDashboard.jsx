
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Warehouse,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  TrendingUp,
  CircleDollarSign,
  ShoppingCart,
  UserRound,
  ArrowUpRight,
  Sun,
  Moon,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminDashboard.css";

import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminInventory from "./AdminInventory";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Products", icon: Package },
  { name: "Categories", icon: Layers },
  { name: "Orders", icon: ShoppingBag, count: 24 },
  { name: "Customers", icon: Users },
  { name: "Inventory", icon: Warehouse },
  { name: "Analytics", icon: ChartNoAxesCombined },
  { name: "Settings", icon: Settings },
];

const recentOrders = [
  {
    id: "#NV1001",
    customer: "Ali Raza",
    amount: "Rs. 4,250",
    status: "Pending",
  },
  {
    id: "#NV1000",
    customer: "Sara Khan",
    amount: "Rs. 2,890",
    status: "Confirmed",
  },
  {
    id: "#NV0999",
    customer: "Ahmed Ali",
    amount: "Rs. 3,750",
    status: "Shipped",
  },
  {
    id: "#NV0998",
    customer: "Fatima Noor",
    amount: "Rs. 5,200",
    status: "Delivered",
  },
  {
    id: "#NV0997",
    customer: "Usman Tariq",
    amount: "Rs. 1,890",
    status: "Cancelled",
  },
];

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("adminTheme") === "dark"
  );

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSales: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const navigate = useNavigate();

  // Fetch real dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login as admin first.");
        }

        const response = await fetch(
          "https://codealphanovacart-one.vercel.app/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load dashboard statistics."
          );
        }

        setStats({
          totalProducts: data.stats.totalProducts ?? 0,
          totalOrders: data.stats.totalOrders ?? 0,
          totalCustomers: data.stats.totalCustomers ?? 0,
          totalSales: data.stats.totalSales ?? 0,
        });

        setStatsError("");
      } catch (error) {
        setStatsError(error.message);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      change: "Live Data",
      icon: Package,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "Live Data",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "Live Data",
      icon: UserRound,
    },
    {
      title: "Total Sales",
      value: `Rs. ${stats.totalSales.toLocaleString()}`,
      change: "Live Data",
      icon: CircleDollarSign,
    },
  ];

  const toggleTheme = () => {
    setDarkMode((previous) => {
      const nextTheme = !previous;

      localStorage.setItem(
        "adminTheme",
        nextTheme ? "dark" : "light"
      );

      return nextTheme;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleMenuClick = (page) => {
    setSidebarOpen(false);

    if (
      [
        "Dashboard",
        "Products",
        "Categories",
        "Orders",
        "Customers",
        "Inventory",
        "Analytics",
        "Settings",
      ].includes(page)
    ) {
      setActivePage(page);
    } else {
      alert(`${page} section will be added next.`);
    }
  };

  return (
    <div
      className={`admin-layout ${
        darkMode ? "admin-dark" : "admin-light"
      }`}
    >
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="admin-brand">
          <ShoppingBag size={34} />
          <h2>NovaCart</h2>
          <span>Admin Panel</span>
        </div>

        <nav className="admin-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`admin-menu-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {item.count && <small>{item.count}</small>}
              </button>
            );
          })}
        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="admin-mobile-menu"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={23} />
          </button>

          <div className="admin-search">
            <Search size={19} />
            <input placeholder="Search anything..." />
          </div>

          <div className="admin-top-actions">
            <button
              className="admin-theme-toggle"
              onClick={toggleTheme}
              title={
                darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
              aria-label={
                darkMode
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {darkMode ? (
                <Sun size={21} />
              ) : (
                <Moon size={21} />
              )}
            </button>

            <button className="admin-notification">
              <Bell size={21} />
              <span>3</span>
            </button>

            <div className="admin-user">
              <div className="admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Dashboard Page */}
        {activePage === "Dashboard" && (
          <section className="admin-content">
            <div className="admin-heading">
              <div>
                <h1>Dashboard</h1>
                <p>
                  Welcome back, Admin! Here's what's
                  happening in your store.
                </p>
              </div>

              <button className="admin-date-button">
                Last 30 Days
              </button>
            </div>

            {/* Statistics */}
            {statsLoading && (
              <p>Loading dashboard statistics...</p>
            )}

            {statsError && (
              <p className="admin-error-message">
                {statsError}
              </p>
            )}

            <div className="admin-stats-grid">
              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    className="admin-stat-card"
                    key={stat.title}
                  >
                    <div className="admin-stat-icon">
                      <Icon size={27} />
                    </div>

                    <div className="admin-stat-info">
                      <h2>{stat.value}</h2>
                      <p>{stat.title}</p>
                      <span>
                        <TrendingUp size={14} />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Middle Section */}
            <div className="admin-middle-grid">
              <section className="admin-panel sales-panel">
                <div className="admin-panel-heading">
                  <h3>Sales Overview</h3>

                  <select defaultValue="30D">
                    <option>7D</option>
                    <option value="30D">30D</option>
                    <option>3M</option>
                    <option>1Y</option>
                  </select>
                </div>

                <div className="sales-placeholder">
                  <ChartNoAxesCombined size={55} />
                  <p>
                    Sales analytics chart will appear here.
                  </p>
                </div>
              </section>

              <section className="admin-panel orders-panel">
                <div className="admin-panel-heading">
                  <h3>Recent Orders</h3>

                  <button
                    onClick={() => setActivePage("Orders")}
                  >
                    View All <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.amount}</td>
                          <td>
                            <span
                              className={`order-status ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Bottom Section */}
            <div className="admin-bottom-grid">
              <section className="admin-panel products-panel">
                <div className="admin-panel-heading">
                  <h3>Top Selling Products</h3>

                  <button
                    onClick={() => setActivePage("Products")}
                  >
                    View All <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="top-product">
                  <div className="product-placeholder">
                    <Package size={27} />
                  </div>

                  <div className="top-product-info">
                    <h4>Elegant Handbag</h4>
                    <p>1,245 sold</p>

                    <div className="product-progress">
                      <span style={{ width: "85%" }} />
                    </div>
                  </div>

                  <strong>Rs. 1,50,000</strong>
                </div>

                <div className="top-product">
                  <div className="product-placeholder">
                    <ShoppingBag size={27} />
                  </div>

                  <div className="top-product-info">
                    <h4>Stylish Sneakers</h4>
                    <p>980 sold</p>

                    <div className="product-progress">
                      <span style={{ width: "68%" }} />
                    </div>
                  </div>

                  <strong>Rs. 1,25,000</strong>
                </div>
              </section>

              <section className="admin-panel inventory-panel">
                <div className="admin-panel-heading">
                  <h3>Inventory Status</h3>
                </div>

                {[
                  { name: "In Stock", value: 72 },
                  { name: "Low Stock", value: 18 },
                  { name: "Out of Stock", value: 10 },
                ].map((item) => (
                  <div
                    className="inventory-row"
                    key={item.name}
                  >
                    <span>{item.name}</span>

                    <div className="inventory-progress">
                      <span
                        style={{
                          width: `${item.value}%`,
                        }}
                      />
                    </div>

                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </section>
            </div>
          </section>
        )}

        {/* Products Page */}
        {activePage === "Products" && <AdminProducts />}

        {/* Categories Page */}
        {activePage === "Categories" && <AdminCategories />}

        {/* Orders Page */}
        {activePage === "Orders" && <AdminOrders />}

        {/* Customers Page */}
        {activePage === "Customers" && <AdminCustomers />}

        {/* Inventory Page */}
        {activePage === "Inventory" && <AdminInventory />}

        {/* Analytics Page */}
        {activePage === "Analytics" && <AdminAnalytics />}

        {/* Settings Page */}
        {activePage === "Settings" && <AdminSettings />}
      </main>
    </div>
  );
}

export default AdminDashboard;

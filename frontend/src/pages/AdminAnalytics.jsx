
import { useEffect, useMemo, useState } from "react";
import {
  ChartNoAxesCombined,
  TrendingUp,
  ShoppingBag,
  CircleDollarSign,
  RefreshCw,
  Package,
} from "lucide-react";

import "../styles/adminAnalytics.css";

const ORDERS_API = "https://codealphanovacart-one.vercel.app/api/orders/admin/all";
const PRODUCTS_API = "https://codealphanovacart-one.vercel.app/api/products";

function AdminAnalytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const [ordersResponse, productsResponse] = await Promise.all([
        fetch(ORDERS_API, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(PRODUCTS_API),
      ]);

      const ordersData = await ordersResponse.json();
      const productsData = await productsResponse.json();

      if (!ordersResponse.ok) {
        throw new Error(ordersData.message || "Unable to load orders.");
      }

      if (!productsResponse.ok) {
        throw new Error(productsData.message || "Unable to load products.");
      }

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || []
      );

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : productsData.products || []
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const validOrders = orders.filter(
      (order) => order.status !== "Cancelled"
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const totalUnits = products.reduce(
      (sum, product) => sum + Number(product.stock || 0),
      0
    );

    return {
      totalOrders: orders.length,
      totalRevenue,
      completedOrders: orders.filter(
        (order) => order.status === "Delivered"
      ).length,
      totalProducts: products.length,
      totalUnits,
    };
  }, [orders, products]);

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount).toLocaleString("en-PK")}`;

  if (loading) {
    return (
      <section className="admin-analytics-page">
        <p className="aa-message">Loading analytics...</p>
      </section>
    );
  }

  return (
    <section className="admin-analytics-page">
      <div className="aa-header">
        <div>
          <span className="aa-eyebrow">STORE PERFORMANCE</span>
          <h1>Analytics</h1>
          <p>Track your store's performance and business activity.</p>
        </div>

        <button className="aa-refresh" onClick={fetchAnalytics}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && <div className="aa-error">{error}</div>}

      <div className="aa-stats-grid">
        <div className="aa-stat-card">
          <div className="aa-stat-icon">
            <ShoppingBag size={23} />
          </div>
          <p>Total Orders</p>
          <h2>{analytics.totalOrders}</h2>
          <span>All recorded orders</span>
        </div>

        <div className="aa-stat-card">
          <div className="aa-stat-icon">
            <CircleDollarSign size={23} />
          </div>
          <p>Revenue</p>
          <h2>{formatCurrency(analytics.totalRevenue)}</h2>
          <span>Excluding cancelled orders</span>
        </div>

        <div className="aa-stat-card">
          <div className="aa-stat-icon">
            <TrendingUp size={23} />
          </div>
          <p>Delivered Orders</p>
          <h2>{analytics.completedOrders}</h2>
          <span>Successfully delivered</span>
        </div>

        <div className="aa-stat-card">
          <div className="aa-stat-icon">
            <Package size={23} />
          </div>
          <p>Total Products</p>
          <h2>{analytics.totalProducts}</h2>
          <span>{analytics.totalUnits} units in stock</span>
        </div>
      </div>

      <div className="aa-report-card">
        <div className="aa-report-heading">
          <div>
            <h2>Order Performance</h2>
            <p>Current order status breakdown</p>
          </div>
          <ChartNoAxesCombined size={25} />
        </div>

        {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map(
          (status) => {
            const count = orders.filter(
              (order) => order.status === status
            ).length;

            const percentage = orders.length
              ? (count / orders.length) * 100
              : 0;

            return (
              <div className="aa-progress-row" key={status}>
                <div className="aa-progress-label">
                  <span>{status}</span>
                  <strong>{count}</strong>
                </div>

                <div className="aa-progress-track">
                  <span style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="aa-note">
        <ChartNoAxesCombined size={20} />
        <p>
          These reports are calculated from your current database records.
          Revenue excludes cancelled orders.
        </p>
      </div>
    </section>
  );
}

export default AdminAnalytics;

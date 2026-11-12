
import { useEffect, useState } from "react";
import {
  Warehouse,
  Package,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
} from "lucide-react";

import "../styles/adminInventory.css";

const API = "http://localhost:7000/api/products";

function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load inventory.");
      }

      const productList = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(productList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (Number(stock) <= 0) return "Out of Stock";
    if (Number(stock) <= 10) return "Low Stock";
    return "In Stock";
  };

  const lowStock = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 10
  ).length;

  const outOfStock = products.filter(
    (product) => Number(product.stock) <= 0
  ).length;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.toLowerCase().includes(search.toLowerCase());

    const status = getStockStatus(product.stock);
    const matchesFilter =
      filter === "All" || status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-inventory-page">
      <div className="ai-header">
        <div>
          <span className="ai-eyebrow">STORE MANAGEMENT</span>
          <h1>Inventory Management</h1>
          <p>Monitor product availability and stock levels.</p>
        </div>

        <button className="ai-refresh" onClick={fetchProducts}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="ai-stats-grid">
        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <Package size={23} />
          </div>
          <div>
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon warning">
            <AlertTriangle size={23} />
          </div>
          <div>
            <p>Low Stock</p>
            <h2>{lowStock}</h2>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon danger">
            <XCircle size={23} />
          </div>
          <div>
            <p>Out of Stock</p>
            <h2>{outOfStock}</h2>
          </div>
        </div>

        <div className="ai-stat-card">
          <div className="ai-stat-icon">
            <Warehouse size={23} />
          </div>
          <div>
            <p>Total Units</p>
            <h2>
              {products.reduce(
                (total, product) =>
                  total + Math.max(0, Number(product.stock) || 0),
                0
              )}
            </h2>
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      {lowStock + outOfStock > 0 && (
        <div className="ai-alert">
          <AlertTriangle size={21} />
          <div>
            <strong>Stock Attention Required</strong>
            <p>
              {lowStock + outOfStock} products need stock attention.
              Please review their availability.
            </p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="ai-toolbar">
        <div className="ai-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search product or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ai-filter"
        >
          <option value="All">All Products</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="ai-table-card">
        <div className="ai-table-heading">
          <h2>Stock Overview</h2>
          <span>{filteredProducts.length} Products</span>
        </div>

        {loading ? (
          <div className="ai-message">Loading inventory...</div>
        ) : error ? (
          <div className="ai-message ai-error">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="ai-message">No products found.</div>
        ) : (
          <div className="ai-table-wrapper">
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available Stock</th>
                  <th>Stock Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);

                  return (
                    <tr key={product._id}>
                      <td>
                        <div className="ai-product">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="ai-product-placeholder">
                              <Package size={21} />
                            </div>
                          )}

                          <strong>{product.name}</strong>
                        </div>
                      </td>

                      <td>{product.category || "Uncategorized"}</td>

                      <td>
                        Rs. {Number(product.price || 0).toLocaleString("en-PK")}
                      </td>

                      <td>
                        <strong>{product.stock ?? 0}</strong>
                      </td>

                      <td>
                        <span
                          className={`ai-status ${
                            status === "In Stock"
                              ? "in-stock"
                              : status === "Low Stock"
                              ? "low-stock"
                              : "out-stock"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInventory;

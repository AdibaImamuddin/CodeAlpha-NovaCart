

import { useEffect, useState } from "react";
import { Search, ShoppingBag, Eye, RefreshCw } from "lucide-react";
import "../styles/adminOrders.css";

const API = "http://localhost:7000/api/orders";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/admin/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load orders.");
        return;
      }

      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch {
      alert("Server connection failed. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);

    try {
      const response = await fetch(
        `${API}/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Status update failed.");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(data.order);
      }

      alert("Order status updated successfully.");
    } catch {
      alert("Unable to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName =
      order.user?.name ||
      order.shippingAddress?.fullName ||
      "";

    const matchesSearch =
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getStatusClass = (status) =>
    status?.toLowerCase() || "pending";

  return (
    <div className="admin-orders-page">
      <div className="ao-header">
        <div>
          <span className="ao-eyebrow">STORE MANAGEMENT</span>
          <h1>Orders Management</h1>
          <p>View customer orders and manage their delivery status.</p>
        </div>

        <button
          className="ao-refresh-button"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh Orders
        </button>
      </div>

      <div className="ao-summary-card">
        <div className="ao-summary-icon">
          <ShoppingBag size={23} />
        </div>

        <div>
          <span>Total Orders</span>
          <h2>{orders.length}</h2>
        </div>

        <div className="ao-summary-decoration"></div>
      </div>

      <div className="ao-toolbar">
        <div className="ao-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search order ID, customer or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="ao-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="ao-table-card">
        <div className="ao-table-heading">
          <div>
            <h2>All Orders</h2>
            <p>Customer purchases and order information</p>
          </div>
          <span className="ao-count">{filteredOrders.length} Orders</span>
        </div>

        <div className="ao-table-wrapper">
          <table className="ao-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="ao-empty">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="ao-empty">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="ao-order-id">{order.orderId}</td>

                    <td>
                      <div className="ao-customer">
                        <strong>
                          {order.user?.name ||
                            order.shippingAddress?.fullName ||
                            "Customer"}
                        </strong>
                        <span>{order.user?.email || "No email"}</span>
                      </div>
                    </td>

                    <td>{formatDate(order.createdAt)}</td>

                    <td className="ao-amount">
                      Rs. {Number(order.totalAmount).toLocaleString()}
                    </td>

                    <td>
                      <select
                        className={`ao-status-select ${getStatusClass(
                          order.status
                        )}`}
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        className="ao-view-button"
                        onClick={() => setSelectedOrder(order)}
                        title="View order details"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div
          className="ao-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="ao-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ao-modal-header">
              <div>
                <span>ORDER DETAILS</span>
                <h2>{selectedOrder.orderId}</h2>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="ao-modal-close"
              >
                ×
              </button>
            </div>

            <div className="ao-detail-section">
              <h3>Customer Information</h3>
              <p>
                <strong>Name:</strong>{" "}
                {selectedOrder.shippingAddress?.fullName}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedOrder.user?.email || "Not available"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder.shippingAddress?.phone}
              </p>
            </div>

            <div className="ao-detail-section">
              <h3>Shipping Address</h3>
              <p>
                {selectedOrder.shippingAddress?.addressLine},{" "}
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.state},{" "}
                {selectedOrder.shippingAddress?.postalCode},{" "}
                {selectedOrder.shippingAddress?.country}
              </p>
            </div>

            <div className="ao-detail-section">
              <h3>Ordered Products</h3>

              {selectedOrder.items?.map((item, index) => (
                <div className="ao-order-item" key={index}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      Qty: {item.quantity} × Rs. {item.price}
                    </span>
                  </div>
                  <strong>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>

            <div className="ao-modal-total">
              <span>Total Amount</span>
              <strong>
                Rs. {Number(selectedOrder.totalAmount).toLocaleString()}
              </strong>
            </div>

            <p className="ao-payment">
              Payment Method: {selectedOrder.paymentMethod}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

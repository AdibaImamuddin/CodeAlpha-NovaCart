
import { useEffect, useState } from "react";
import { Search, Users, RefreshCw, Eye, X } from "lucide-react";
import "../styles/adminCustomers.css";

const API = "http://localhost:7000/api/users";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customers.");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const value = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(value) ||
      customer.email?.toLowerCase().includes(value)
    );
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-customers-page">
      <div className="ac-header">
        <div>
          <span className="ac-eyebrow">CUSTOMER MANAGEMENT</span>
          <h1>Customers</h1>
          <p>View and manage your registered customers.</p>
        </div>

        <button className="ac-refresh-button" onClick={fetchCustomers}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="ac-summary-card">
        <div className="ac-summary-icon">
          <Users size={25} />
        </div>

        <div>
          <p>Total Customers</p>
          <h2>{customers.length}</h2>
        </div>

        <div className="ac-summary-decoration"></div>
      </div>

      <div className="ac-toolbar">
        <div className="ac-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="ac-count">
          {filteredCustomers.length} Customers
        </span>
      </div>

      <div className="ac-table-card">
        <div className="ac-table-heading">
          <h2>Customer List</h2>
          <span>Registered Accounts</span>
        </div>

        {loading ? (
          <div className="ac-message">Loading customers...</div>
        ) : error ? (
          <div className="ac-message ac-error">
            {error}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="ac-message">No customers found.</div>
        ) : (
          <div className="ac-table-wrapper">
            <table className="ac-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Verification</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="ac-customer-name">
                        <div className="ac-avatar">
                          {customer.name?.charAt(0)?.toUpperCase() || "C"}
                        </div>
                        <strong>{customer.name || "Customer"}</strong>
                      </div>
                    </td>

                    <td>{customer.email}</td>

                    <td>
                      <span
                        className={`ac-status ${
                          customer.isVerified ? "verified" : "unverified"
                        }`}
                      >
                        {customer.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>

                    <td>{formatDate(customer.createdAt)}</td>

                    <td>
                      <button
                        className="ac-view-button"
                        onClick={() => setSelectedCustomer(customer)}
                        title="View customer"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div
          className="ac-modal-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="ac-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ac-modal-header">
              <div>
                <span className="ac-eyebrow">CUSTOMER DETAILS</span>
                <h2>Customer Profile</h2>
              </div>

              <button
                className="ac-modal-close"
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="ac-profile-avatar">
              {selectedCustomer.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="ac-detail-info">
              <span>Full Name</span>
              <strong>{selectedCustomer.name || "N/A"}</strong>
            </div>

            <div className="ac-detail-info">
              <span>Email Address</span>
              <strong>{selectedCustomer.email || "N/A"}</strong>
            </div>

            <div className="ac-detail-info">
              <span>Account Status</span>
              <strong>
                {selectedCustomer.isVerified ? "Verified" : "Unverified"}
              </strong>
            </div>

            <div className="ac-detail-info">
              <span>Joined Date</span>
              <strong>{formatDate(selectedCustomer.createdAt)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;

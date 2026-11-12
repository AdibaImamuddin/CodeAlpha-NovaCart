
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Save,
} from "lucide-react";
import "../styles/address.css";

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Pakistan",
  isDefault: false,
};

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/addresses");
      setAddresses(response.addresses || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (address) => {
    setForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine: address.addressLine || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "Pakistan",
      isDefault: Boolean(address.isDefault),
    });

    setEditingId(address._id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        await apiRequest(`/addresses/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiRequest("/addresses", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await apiRequest(`/addresses/${id}`, {
        method: "DELETE",
      });

      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="address-page">
      <div className="address-heading">
        <div>
          <p>MY ACCOUNT / ADDRESSES</p>
          <h1>Delivery Addresses</h1>
          <span>Manage your saved delivery locations.</span>
        </div>

        <button className="address-add-btn" onClick={openAddForm}>
          <Plus size={18} />
          Add New Address
        </button>
      </div>

      {error && <div className="address-error">{error}</div>}

      {showForm && (
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="address-form-heading">
            <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
            >
              <X size={21} />
            </button>
          </div>

          <div className="address-form-grid">
            <label>
              Full Name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </label>

            <label className="address-full-width">
              Complete Address
              <input
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              State / Province
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Postal Code
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="address-default-check">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            Set as default delivery address
          </label>

          <div className="address-form-actions">
            <button
              type="button"
              className="address-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="address-save-btn"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      )}

      <section className="address-list-section">
        <h2>Saved Addresses</h2>

        {loading ? (
          <p className="address-message">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="address-empty">
            <MapPin size={42} />
            <h3>No saved addresses</h3>
            <p>Add a delivery address to make checkout easier.</p>
            <button onClick={openAddForm}>Add Your First Address</button>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map((address) => (
              <article className="address-card" key={address._id}>
                <div className="address-card-top">
                  <MapPin size={22} />
                  {address.isDefault && (
                    <span className="address-default-badge">
                      <Star size={13} /> Default
                    </span>
                  )}
                </div>

                <h3>{address.fullName}</h3>
                <p>{address.phone}</p>
                <p>{address.addressLine}</p>
                <p>
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p>{address.country}</p>

                <div className="address-card-actions">
                  <button onClick={() => openEditForm(address)}>
                    <Pencil size={15} /> Edit
                  </button>

                  <button
                    className="address-delete-btn"
                    onClick={() => handleDelete(address._id)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Addresses;

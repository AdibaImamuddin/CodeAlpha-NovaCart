
import { useState } from "react";
import {
  Settings,
  Store,
  UserRound,
  Bell,
  Save,
  RotateCcw,
} from "lucide-react";

import "../styles/adminSettings.css";

function AdminSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("novaAdminSettings");

    return saved
      ? JSON.parse(saved)
      : {
          storeName: "NovaCart",
          storeEmail: "",
          storePhone: "",
          currency: "PKR",
          lowStockLimit: 10,
          emailNotifications: true,
          orderNotifications: true,
        };
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    localStorage.setItem(
      "novaAdminSettings",
      JSON.stringify(settings)
    );

    setMessage("Settings saved successfully.");
  };

  const handleReset = () => {
    const defaultSettings = {
      storeName: "NovaCart",
      storeEmail: "",
      storePhone: "",
      currency: "PKR",
      lowStockLimit: 10,
      emailNotifications: true,
      orderNotifications: true,
    };

    setSettings(defaultSettings);
    localStorage.setItem(
      "novaAdminSettings",
      JSON.stringify(defaultSettings)
    );

    setMessage("Settings restored to defaults.");
  };

  return (
    <section className="admin-settings-page">
      <div className="as-header">
        <div>
          <span className="as-eyebrow">CONTROL CENTER</span>
          <h1>Settings</h1>
          <p>Manage your store information and preferences.</p>
        </div>

        <div className="as-header-icon">
          <Settings size={28} />
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Store Information */}
        <div className="as-card">
          <div className="as-card-heading">
            <div className="as-icon">
              <Store size={21} />
            </div>
            <div>
              <h2>Store Information</h2>
              <p>Update your basic store details.</p>
            </div>
          </div>

          <div className="as-fields-grid">
            <label className="as-field">
              Store Name
              <input
                type="text"
                name="storeName"
                value={settings.storeName}
                onChange={handleChange}
                required
              />
            </label>

            <label className="as-field">
              Store Email
              <input
                type="email"
                name="storeEmail"
                value={settings.storeEmail}
                onChange={handleChange}
                placeholder="store@example.com"
              />
            </label>

            <label className="as-field">
              Store Phone
              <input
                type="tel"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleChange}
                placeholder="03XXXXXXXXX"
              />
            </label>

            <label className="as-field">
              Currency
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </label>
          </div>
        </div>

        {/* Admin Preferences */}
        <div className="as-card">
          <div className="as-card-heading">
            <div className="as-icon">
              <UserRound size={21} />
            </div>
            <div>
              <h2>Store Preferences</h2>
              <p>Configure basic inventory preferences.</p>
            </div>
          </div>

          <label className="as-field as-stock-field">
            Low Stock Alert Limit
            <input
              type="number"
              name="lowStockLimit"
              min="1"
              value={settings.lowStockLimit}
              onChange={handleChange}
              required
            />
            <small>
              Products at or below this quantity can be treated as low stock.
            </small>
          </label>
        </div>

        {/* Notifications */}
        <div className="as-card">
          <div className="as-card-heading">
            <div className="as-icon">
              <Bell size={21} />
            </div>
            <div>
              <h2>Notifications</h2>
              <p>Choose your preferred notification settings.</p>
            </div>
          </div>

          <label className="as-toggle-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Enable email notification preference.</p>
            </div>

            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
            />
          </label>

          <label className="as-toggle-row">
            <div>
              <strong>Order Notifications</strong>
              <p>Enable order notification preference.</p>
            </div>

            <input
              type="checkbox"
              name="orderNotifications"
              checked={settings.orderNotifications}
              onChange={handleChange}
            />
          </label>
        </div>

        {message && (
          <div className="as-success-message">
            {message}
          </div>
        )}

        <div className="as-actions">
          <button
            type="button"
            className="as-reset-button"
            onClick={handleReset}
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button type="submit" className="as-save-button">
            <Save size={17} />
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminSettings;

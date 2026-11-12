
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { apiRequest } from "../services/api";
import "../styles/changePassword.css";
function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      setMessage(response.message || "Password changed successfully.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
          type="button"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="password-icon">
          <LockKeyhole size={28} />
        </div>

        <h2>Change Password</h2>
        <p>Keep your NovaCart account secure.</p>

        <form onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            minLength="8"
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />

          {error && <div className="password-error">{error}</div>}
          {message && <div className="password-success">{message}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;

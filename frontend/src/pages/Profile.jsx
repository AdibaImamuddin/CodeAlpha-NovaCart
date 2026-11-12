
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { User, Mail, Save, LoaderCircle } from "lucide-react";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiRequest("/auth/profile");

        const user = response.user || response.profile;

        if (user) {
          setProfile({
            name: user.name || "",
            email: user.email || "",
          });

          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.name.trim(),
        }),
      });

      const updatedUser = response.user || response.profile;

      if (updatedUser) {
        setProfile({
          name: updatedUser.name || profile.name,
          email: updatedUser.email || profile.email,
        });

        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            name: profile.name.trim(),
          })
        );
      }

      setMessage(response.message || "Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <p>MY ACCOUNT / PROFILE</p>
        <h1>Personal Information</h1>
        <span>Manage your personal account details.</span>
      </div>

      <form className="profile-card" onSubmit={handleSubmit}>
        <div className="profile-avatar">
          <User size={38} />
        </div>

        <h2>Account Details</h2>
        <p className="profile-subtitle">
          Keep your information up to date.
        </p>

        {message && <div className="profile-success">{message}</div>}
        {error && <div className="profile-error">{error}</div>}

        <label htmlFor="profile-name">Full Name</label>
        <div className="profile-input-wrap">
          <User size={18} />
          <input
            id="profile-name"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            minLength={2}
            maxLength={50}
            required
          />
        </div>

        <label htmlFor="profile-email">Email Address</label>
        <div className="profile-input-wrap profile-readonly">
          <Mail size={18} />
          <input
            id="profile-email"
            type="email"
            name="email"
            value={profile.email}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="profile-save-btn"
          disabled={saving}
        >
          {saving ? (
            <LoaderCircle size={18} className="profile-spinner" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}

export default Profile;

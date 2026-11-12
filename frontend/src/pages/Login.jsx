
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:7000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Authentication token not received.");
      }

      if (!data.user) {
        throw new Error("User information not received from server.");
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect according to user role
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">NOVACART</div>

        <p className="auth-eyebrow">WELCOME BACK</p>
        <h1>Sign in to your account</h1>

        <p className="auth-description">
          Welcome back! Enter your details to continue shopping.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>

          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;

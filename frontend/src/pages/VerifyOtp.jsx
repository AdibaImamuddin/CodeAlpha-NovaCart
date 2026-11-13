
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Registration email not found. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://codealphanovacart-one.vercel.app/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }

      alert(data.message || "Email verified successfully!");
      navigate("/login");

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

        <p className="auth-eyebrow">EMAIL VERIFICATION</p>
        <h1>Verify your email</h1>

        <p className="auth-description">
          We have sent a 6-digit verification code to:
          <br />
          <strong>{email || "Your registered email"}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">Enter OTP</label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            maxLength={6}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Email"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-switch">
          Wrong email? <Link to="/register">Register again</Link>
        </p>
      </section>
    </main>
  );
}

export default VerifyOtp;

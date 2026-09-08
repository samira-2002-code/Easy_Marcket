import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de se connecter. Vérifiez vos informations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="brand">
          <span className="brand-mark">E</span>
          <span>Easy Market</span>
        </div>

        <div className="visual-content">
          <span className="eyebrow">YOUR MARKETPLACE</span>

          <h1>
            Discover.
            <br />
            Connect.
            <br />
            <span>Trade.</span>
          </h1>

          <p>
            Find products you love, connect with sellers and make your next
            great deal.
          </p>

          <div className="product-tags">
            <span>📷 Camera</span>
            <span>💻 Laptop</span>
            <span>👟 Sneakers</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <div className="auth-tabs">
            <Link className="active" to="/login">
              Sign in
            </Link>

            <Link to="/register">Create account</Link>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Enter the market.</h2>
            <p>Sign in to continue exploring Easy Market.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Enter Easy Market →"}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">Open your account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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

    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      // Création du compte
      await register(form);

      // Après Register → Login
      navigate("/login", {
        state: {
          message:
            "Compte créé avec succès. Connectez-vous maintenant.",
        },
      });
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        setError(firstError || "Une erreur est survenue.");
      } else {
        setError(
          err.response?.data?.message ||
            "Impossible de créer votre compte."
        );
      }
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
          <span className="eyebrow">JOIN THE MARKET</span>

          <h1>
            Sell.
            <br />
            Discover.
            <br />
            <span>Connect.</span>
          </h1>

          <p>
            Create your account and become part of the Easy Market
            community.
          </p>

          <div className="product-tags">
            <span>✦ Discover</span>
            <span>✦ Sell</span>
            <span>✦ Connect</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <div className="auth-tabs">
            <Link to="/login">Sign in</Link>

            <Link className="active" to="/register">
              Create account
            </Link>
          </div>

          <div className="auth-heading">
            <span className="eyebrow">WELCOME</span>

            <h2>Open your stall.</h2>

            <p>
              Create your Easy Market account in a few seconds.
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password_confirmation">
                Confirm password
              </label>

              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Repeat your password"
                value={form.password_confirmation}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Open my account →"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
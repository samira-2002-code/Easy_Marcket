import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  return (
    <header className="market-navbar">
      <Link to="/" className="market-logo">
        <span className="logo-main">EASY</span>
        <span className="logo-sub">MARKET</span>
      </Link>

      <div className="market-search">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search the marketplace..."
        />
      </div>

      <nav className="market-nav">
        <Link to="/favorites" className="nav-item">
          <span>♡</span>
          <span>Saved</span>
        </Link>

        <Link to="/messages" className="nav-item">
          <span>◌</span>
          <span>Messages</span>
        </Link>

        <Link to="/profile" className="profile-link">
          <span className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>

          <span className="profile-name">
            {user?.name || "User"}
          </span>
        </Link>

        <button
          type="button"
          className="logout-link"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
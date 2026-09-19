import { Heart, LogOut, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <header className="market-navbar">
      <div className="navbar-topline">
        <Link to="/" className="market-logo">
          <span className="logo-mark">+</span>
          <span><strong>EASY</strong><small>MARKET</small></span>
        </Link>

        <nav className="market-nav">
          <Link to="/products" className="nav-item"><span>01</span>Explore</Link>
          <Link to="/categories" className="nav-item"><span>02</span>Categories</Link>
          <Link to="/favorites" className="nav-item"><Heart size={15} /><span>Saved</span></Link>
          <Link to="/messages" className="nav-item"><MessageCircle size={15} /><span>Messages</span></Link>
          <Link to="/profile" className="profile-link"><span className="profile-avatar">{user?.name?.charAt(0).toUpperCase() || "U"}</span><span className="profile-name">{user?.name || "Account"}</span></Link>
          <button type="button" className="logout-link" onClick={handleLogout} aria-label="Log out"><LogOut size={14} /></button>
        </nav>
      </div>

      <div className="navbar-search-row">
        <span className="search-kicker">LOCAL MARKET / 2026</span>
        <form className="market-search" onSubmit={handleSearch}>
          <Search className="search-icon" size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="What are you looking for?" aria-label="Search products" />
          <button type="submit">Search <span>↗</span></button>
        </form>
        <Link className="header-sell-link" to="/products/create">Sell an item <span>+</span></Link>
      </div>
    </header>
  );
}
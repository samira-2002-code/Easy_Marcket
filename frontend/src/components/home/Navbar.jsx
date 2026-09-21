import {
    Heart,
    LogOut,
    Menu,
    MessageCircle,
    Search,
    X,
} from "lucide-react";
import { useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [menuOpen, setMenuOpen] = useState(false);

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

        navigate(
            query
                ? `/products?search=${encodeURIComponent(query)}`
                : "/products"
        );

        setMenuOpen(false);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="market-navbar">
            <div className="navbar-main">
                <Link
                    to="/"
                    className="market-logo"
                    onClick={closeMenu}
                >
                    <span className="logo-mark">+</span>

                    <span className="logo-text">
                        <strong>EASY</strong>
                        <small>MARKET</small>
                    </span>
                </Link>

                <nav className="desktop-nav">
                    <Link to="/products">
                        <span>01</span>
                        Explore
                    </Link>

                    <Link to="/categories">
                        <span>02</span>
                        Categories
                    </Link>

                    <Link to="/favorites" className="nav-icon-link">
                        <Heart size={16} />
                        <span>Saved</span>
                    </Link>

                    <Link to="/messages" className="nav-icon-link">
                        <MessageCircle size={16} />
                        <span>Messages</span>
                    </Link>
                </nav>

                <div className="navbar-account">
                    <Link to="/profile" className="profile-link">
                        <span className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                        </span>

                        <span className="profile-name">
                            {user?.name || "Account"}
                        </span>
                    </Link>

                    <Link to="/dashboard" className="profile-link">
                        Dashboard
                    </Link>

                    {user?.role === "admin" && (
                        <Link to="/admin" className="profile-link">
                            Admin
                        </Link>
                    )}

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                        aria-label="Log out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={
                        menuOpen ? "Close menu" : "Open menu"
                    }
                >
                    {menuOpen ? (
                        <X size={21} />
                    ) : (
                        <Menu size={21} />
                    )}
                </button>
            </div>

            <div className="navbar-action-row">
                <div className="navbar-context">
                    <span className="context-index">LOCAL MARKET</span>
                    <span className="context-year">/ 2026</span>
                </div>

                <form
                    className="market-search"
                    onSubmit={handleSearch}
                >
                    <Search
                        className="search-icon"
                        size={17}
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        type="search"
                        placeholder="Search products, categories..."
                        aria-label="Search products"
                    />

                    <button type="submit">
                        Search
                        <span>↗</span>
                    </button>
                </form>

                <Link
                    className="header-sell-button"
                    to="/products/create"
                >
                    <span>Sell an item</span>
                    <strong>+</strong>
                </Link>
            </div>

            {menuOpen && (
                <div className="mobile-navigation">
                    <Link to="/products" onClick={closeMenu}>
                        <span>01</span>
                        Explore
                    </Link>

                    <Link to="/categories" onClick={closeMenu}>
                        <span>02</span>
                        Categories
                    </Link>

                    <Link to="/favorites" onClick={closeMenu}>
                        <Heart size={17} />
                        Saved items
                    </Link>

                    <Link to="/messages" onClick={closeMenu}>
                        <MessageCircle size={17} />
                        Messages
                    </Link>

                    <Link to="/profile" onClick={closeMenu}>
                        <span className="mobile-profile-avatar">
                            {user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                        </span>

                        {user?.name || "Account"}
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        <LogOut size={17} />
                        Log out
                    </button>
                </div>
            )}
        </header>
    );
}
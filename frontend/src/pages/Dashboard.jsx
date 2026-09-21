import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Pencil, Trash2, UserRound } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/home/Navbar";
import "../components/home/home.css";
import "../components/dashboard/dashboard.css";

export default function Dashboard() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.id) return;

        const loadProducts = async () => {
            try {
                const response = await api.get("/my-products");
                const data = response.data?.data;
                setProducts(Array.isArray(data?.data) ? data.data : data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load your listings.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [user?.id]);

    const removeProduct = async (productId) => {
        if (!window.confirm("Delete this listing?")) return;

        try {
            await api.delete(`/products/${productId}`);
            setProducts((current) => current.filter((product) => product.id !== productId));
        } catch (err) {
            setError(err.response?.data?.message || "Unable to delete this listing.");
        }
    };

    return (
        <div className="market-home">
            <Navbar />
            <main className="dashboard-page">
                <section className="dashboard-intro">
                    <div className="section-topline"><span>04</span><span>YOUR SPACE</span></div>
                    <div className="dashboard-heading">
                        <div>
                            <span className="dashboard-eyebrow">WELCOME BACK, {user?.name?.toUpperCase() || "MEMBER"}</span>
                            <h1>Your<br /><em>dashboard.</em></h1>
                        </div>
                        <p>Manage your listings and keep your marketplace activity close at hand.</p>
                    </div>
                </section>

                <section className="dashboard-content">
                    <div className="dashboard-actions">
                        <Link to="/profile"><UserRound size={17} /> Profile</Link>
                        <Link to="/favorites"><Heart size={17} /> Saved items</Link>
                        <Link to="/messages"><MessageCircle size={17} /> Messages</Link>
                    </div>

                    <div className="dashboard-listings-header">
                        <div><span>01</span><h2>Your listings</h2></div>
                        <Link to="/products/create">Sell an item <span>+</span></Link>
                    </div>

                    {error && <div className="dashboard-error">{error}</div>}
                    {loading && <div className="dashboard-state">Loading your listings...</div>}
                    {!loading && !products.length && <div className="dashboard-state">You have not published a listing yet.</div>}
                    {!loading && products.length > 0 && (
                        <div className="dashboard-listings">
                            {products.map((product) => (
                                <article className="dashboard-listing" key={product.id}>
                                    <div>
                                        <span>{product.category?.name || "Marketplace"}</span>
                                        <h3>{product.title}</h3>
                                        <p>{product.type === "exchange" ? "Exchange" : `${Number(product.price).toLocaleString("fr-FR")} DH`}</p>
                                    </div>
                                    <div className="dashboard-listing-actions">
                                        <Link to={`/products/${product.id}`} aria-label={`View ${product.title}`}><span>View</span></Link>
                                        <Link to={`/products/${product.id}/edit`} aria-label={`Edit ${product.title}`}><Pencil size={16} /></Link>
                                        <button type="button" onClick={() => removeProduct(product.id)} aria-label={`Delete ${product.title}`}><Trash2 size={16} /></button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

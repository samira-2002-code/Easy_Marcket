import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/home/Navbar";
import "../components/home/home.css";
import "../components/dashboard/dashboard.css";

export default function Admin() {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState("");

    const load = async () => {
        try {
            const [statsResponse, usersResponse, productsResponse, reportsResponse] = await Promise.all([
                api.get("/admin/stats"), api.get("/admin/users"), api.get("/admin/products"), api.get("/admin/reports"),
            ]);
            setStats(statsResponse.data?.data || {});
            setUsers(usersResponse.data?.data || []);
            setProducts(productsResponse.data?.data || []);
            setReports(reportsResponse.data?.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load administration data.");
        }
    };

    useEffect(() => { load(); }, []);

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user and their data?")) return;
        try { await api.delete(`/admin/users/${id}`); setUsers((items) => items.filter((item) => item.id !== id)); } catch (err) { setError(err.response?.data?.message || "Unable to delete user."); }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Remove this listing?")) return;
        try { await api.delete(`/admin/products/${id}`); setProducts((items) => items.filter((item) => item.id !== id)); } catch (err) { setError(err.response?.data?.message || "Unable to remove listing."); }
    };

    return <div className="market-home"><Navbar /><main className="dashboard-page"><section className="dashboard-intro"><div className="section-topline"><span>00</span><span>ADMINISTRATION</span></div><div className="dashboard-heading"><div><span className="dashboard-eyebrow">CONTROL ROOM</span><h1>Market<br /><em>admin.</em></h1></div><p>Keep the marketplace healthy with a focused view of its core activity.</p></div></section><section className="dashboard-content">{error && <div className="dashboard-error">{error}</div>}<div className="dashboard-actions">{Object.entries(stats).map(([key, value]) => <span key={key} className="dashboard-actions a"><strong>{value}</strong> {key}</span>)}</div><div className="dashboard-listings-header"><div><span>01</span><h2>Users</h2></div></div><div className="dashboard-listings">{users.map((user) => <article className="dashboard-listing" key={user.id}><div><span>{user.role}</span><h3>{user.name}</h3><p>{user.email}</p></div><div className="dashboard-listing-actions"><button type="button" onClick={() => deleteUser(user.id)} aria-label={`Delete ${user.name}`}><Trash2 size={16} /></button></div></article>)}</div><div className="dashboard-listings-header"><div><span>02</span><h2>Listings</h2></div></div><div className="dashboard-listings">{products.map((product) => <article className="dashboard-listing" key={product.id}><div><span>{product.user?.name || "User"} / {product.category?.name || "Marketplace"}</span><h3>{product.title}</h3><p>{product.type === "exchange" ? "Exchange" : `${Number(product.price).toLocaleString("fr-FR")} DH`}</p></div><div className="dashboard-listing-actions"><Link to={`/products/${product.id}`}>View</Link><button type="button" onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.title}`}><Trash2 size={16} /></button></div></article>)}</div><div className="dashboard-listings-header"><div><span>03</span><h2>Reports</h2></div></div><div className="dashboard-listings">{reports.length ? reports.map((report) => <article className="dashboard-listing" key={report.id}><div><span>{report.status}</span><h3>{report.product?.title || "Removed listing"}</h3><p>{report.reason} / {report.user?.name || "User"}</p></div></article>) : <div className="dashboard-state">No reports.</div>}</div></section></main></div>;
}

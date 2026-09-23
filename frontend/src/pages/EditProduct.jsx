import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/home/Navbar";
import "../components/home/home.css";
import "../components/products/create-product.css";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", price: "", category_id: "", type: "sale" });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const [productResponse, categoriesResponse] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get("/categories"),
                ]);
                const product = productResponse.data?.data || productResponse.data;
                setForm({ title: product.title || "", description: product.description || "", price: product.price || "", category_id: product.category_id || "", type: product.type || "sale" });
                setPreview(product.image ? (product.image.startsWith("http") ? product.image : `http://127.0.0.1:8000/storage/${product.image}`) : "");
                setCategories(categoriesResponse.data?.data || categoriesResponse.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load this listing.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setImage(null);
            setPreview("");
            setError("The image must be smaller than 10 MB.");
            event.target.value = "";
            return;
        }
        setImage(file);
        setError("");
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => formData.append(key, value));
            formData.append("_method", "PUT");
            if (image) formData.append("image", image);
            await api.post(`/products/${id}`, formData);
            navigate("/dashboard");
        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            setError(validationErrors ? Object.values(validationErrors).flat().join(" ") : err.response?.data?.message || "Unable to update this listing.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="market-home"><Navbar /><main className="create-product-page"><div className="create-product-error">Loading listing...</div></main></div>;

    return (
        <div className="market-home">
            <Navbar />
            <main className="create-product-page">
                <div className="create-product-top"><Link to="/dashboard">← Back to dashboard</Link><span>04 / EDIT</span></div>
                <section className="create-product-header"><div><span className="create-eyebrow">KEEP YOUR LISTING CURRENT</span><h1>Edit<br /><em>your item.</em></h1></div><p>Update the details or replace the image of your marketplace listing.</p></section>
                {error && <div className="create-product-error">{error}</div>}
                <form className="create-product-form" onSubmit={handleSubmit}>
                    <div className="create-product-left">
                        <div className="form-section-number"><span>01</span><strong>PRODUCT INFORMATION</strong></div>
                        <div className="create-field"><label htmlFor="title">Product title</label><input id="title" name="title" value={form.title} onChange={handleChange} required /></div>
                        <div className="create-field"><label htmlFor="description">Description</label><textarea id="description" name="description" value={form.description} onChange={handleChange} rows="7" required /></div>
                        <div className="create-form-row">
                            <div className="create-field"><label htmlFor="price">Price (DH)</label><input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required /></div>
                            <div className="create-field"><label htmlFor="category_id">Category</label><select id="category_id" name="category_id" value={form.category_id} onChange={handleChange} required><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                        </div>
                        <div className="create-field"><label htmlFor="type">Listing type</label><select id="type" name="type" value={form.type} onChange={handleChange} required><option value="sale">Sale</option><option value="exchange">Exchange</option></select></div>
                    </div>
                    <div className="create-product-right">
                        <div className="form-section-number"><span>02</span><strong>PRODUCT IMAGE</strong></div>
                        <label htmlFor="image" className={`image-upload ${preview ? "has-image" : ""}`}>{preview ? <img src={preview} alt="Product preview" /> : <div className="image-upload-content"><span className="upload-symbol">+</span><strong>Add product image</strong><small>JPG, PNG or WEBP</small></div>}</label>
                        <input id="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} hidden />
                        <button type="submit" className="publish-product-button" disabled={saving}>{saving ? "Saving..." : "Save changes →"}</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

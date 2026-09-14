import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";

import "../components/home/home.css";
import "../components/products/create-product.css";

export default function CreateProduct() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        category_id: "",
        type: "sale",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");

                const data = response.data;

                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (Array.isArray(data.data)) {
                    setCategories(data.data);
                }
            } catch (err) {
                console.error("Categories error:", err);
                setError("Unable to load categories.");
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("category_id", form.category_id);
            formData.append("type", form.type);

            if (image) {
                formData.append("image", image);
            }

            await api.post("/products", formData);

            navigate("/products");
        } catch (err) {
            console.error("Create product error:", err);

            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0]?.[0];

                setError(
                    firstError || "Please check the information entered."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to create the product."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="market-home">
            <Navbar />

            <main className="create-product-page">

                <div className="create-product-top">
                    <Link to="/products">
                        ← Back to marketplace
                    </Link>

                    <span>05 / SELL</span>
                </div>

                <section className="create-product-header">
                    <div>
                        <span className="create-eyebrow">
                            PUT SOMETHING NEW ON THE MARKET
                        </span>

                        <h1>
                            Sell
                            <br />
                            <em>something.</em>
                        </h1>
                    </div>

                    <p>
                        Give your product a second life.
                        Add the details below and publish
                        your listing on Easy Market.
                    </p>
                </section>

                {error && (
                    <div className="create-product-error">
                        {error}
                    </div>
                )}

                <form
                    className="create-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="create-product-left">

                        <div className="form-section-number">
                            <span>01</span>
                            <strong>PRODUCT INFORMATION</strong>
                        </div>

                        <div className="create-field">
                            <label htmlFor="title">
                                Product title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. iPhone 15"
                                required
                            />
                        </div>

                        <div className="create-field">
                            <label htmlFor="description">
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe your product..."
                                rows="7"
                                required
                            />
                        </div>

                        <div className="create-form-row">

                            <div className="create-field">
                                <label htmlFor="price">
                                    Price (DH)
                                </label>

                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div className="create-field">
                                <label htmlFor="category_id">
                                    Category
                                </label>

                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={form.category_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        {loadingCategories
                                            ? "Loading..."
                                            : "Select category"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="create-field">
                            <label htmlFor="type">
                                Listing type
                            </label>

                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="sale">
                                    Sale
                                </option>

                                <option value="exchange">
                                    Exchange
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="create-product-right">

                        <div className="form-section-number">
                            <span>02</span>
                            <strong>PRODUCT IMAGE</strong>
                        </div>

                        <label
                            htmlFor="image"
                            className={`image-upload ${
                                preview ? "has-image" : ""
                            }`}
                        >

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Product preview"
                                />
                            ) : (
                                <div className="image-upload-content">
                                    <span className="upload-symbol">
                                        +
                                    </span>

                                    <strong>
                                        Add product image
                                    </strong>

                                    <small>
                                        JPG, PNG or WEBP
                                    </small>
                                </div>
                            )}

                        </label>

                        <input
                            id="image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            hidden
                        />

                        <button
                            type="submit"
                            className="publish-product-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Publishing..."
                                : "Publish listing →"}
                        </button>

                        <p className="publish-note">
                            Your listing will be visible on the
                            Easy Market marketplace.
                        </p>

                    </div>

                </form>
            </main>
        </div>
    );
}
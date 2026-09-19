import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";

import "../components/home/home.css";
import "../components/products/products.css";

export default function Categories() {
    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/categories");
                const data = response.data;

                if (Array.isArray(data)) {
                    setCategories(data);
                } else if (Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error("Categories error:", err);

                setError(
                    err.response?.data?.message ||
                        "Unable to load categories."
                );
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const data = {
                name: name.trim(),
                description: description.trim(),
            };

            if (editingId) {
                const response = await api.put(
                    `/categories/${editingId}`,
                    data
                );

                const updatedCategory =
                    response.data.data || response.data;

                setCategories((currentCategories) =>
                    currentCategories.map((category) =>
                        category.id === editingId
                            ? updatedCategory
                            : category
                    )
                );
            } else {
                const response = await api.post(
                    "/categories",
                    data
                );

                const newCategory =
                    response.data.data || response.data;

                setCategories((currentCategories) => [
                    ...currentCategories,
                    newCategory,
                ]);
            }

            resetForm();
        } catch (err) {
            console.error("Save category error:", err);

            const validationErrors =
                err.response?.data?.errors;

            if (validationErrors) {
                const firstError =
                    Object.values(validationErrors)[0]?.[0];

                setError(
                    firstError ||
                        "Please check the category information."
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        "Unable to save category."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setName(category.name || "");
        setDescription(category.description || "");
        setError("");
    };

    const handleDelete = async (categoryId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette catégorie ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.delete(`/categories/${categoryId}`);

            setCategories((currentCategories) =>
                currentCategories.filter(
                    (category) => category.id !== categoryId
                )
            );

            if (editingId === categoryId) {
                resetForm();
            }
        } catch (err) {
            console.error("Delete category error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to delete this category."
            );
        }
    };

    return (
        <div className="market-home">
            <Navbar />

            <main className="products-page">
                <section className="products-intro">
                    <div className="section-topline">
                        <span>04</span>
                        <span>CATEGORIES</span>
                    </div>

                    <div className="products-intro-content">
                        <div>
                            <span className="products-eyebrow">
                                ORGANIZE THE MARKETPLACE
                            </span>

                            <h1>
                                Market
                                <br />
                                <em>categories.</em>
                            </h1>
                        </div>

                        <div className="products-intro-side">
                            <p>
                                Create and organize the categories
                                used by Easy Market listings.
                            </p>

                            <Link to="/products">
                                Back to marketplace →
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="products-content categories-workspace">
                    {error && (
                        <div className="products-error">
                            {error}
                        </div>
                    )}

                    <div className="categories-layout">
                        <form
                            onSubmit={handleSubmit}
                            className="category-editor"
                        >
                            <div className="category-editor-heading">
                                <span>EDITOR / 01</span>

                                <h2>
                                    {editingId
                                        ? "Edit a category"
                                        : "Shape the market"}
                                </h2>

                                <p>
                                    Give people a clear way into the
                                    things they want to find.
                                </p>
                            </div>

                            <div className="create-field">
                                <label htmlFor="category-name">
                                    Category name
                                </label>

                                <input
                                    id="category-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="e.g. Électronique"
                                    required
                                />
                            </div>

                            <div className="create-field">
                                <label htmlFor="category-description">
                                    Description
                                </label>

                                <textarea
                                    id="category-description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe this category..."
                                    rows="4"
                                />
                            </div>

                            <div className="category-form-actions">
                                <button
                                    type="submit"
                                    className="publish-product-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                        ? "Update category →"
                                        : "Add category →"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        {loading ? (
                            <div className="products-empty">
                                <span>...</span>

                                <h3>
                                    Loading categories.
                                </h3>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="products-empty">
                                <span>00</span>

                                <h3>
                                    No categories yet.
                                </h3>

                                <p>
                                    Create your first marketplace
                                    category above.
                                </p>
                            </div>
                        ) : (
                            <div className="categories-list">
                                {categories.map((category) => (
                                    <article
                                        key={category.id}
                                        className="category-item"
                                    >
                                        <div className="product-details">
                                            <div className="category-item-number">
                                                {String(
                                                    category.id
                                                ).padStart(2, "0")}
                                            </div>

                                            <div className="category-item-copy">
                                                <span>
                                                    CATEGORY
                                                </span>

                                                <h3>
                                                    {category.name}
                                                </h3>

                                                <p>
                                                    {category.description ||
                                                        "No description."}
                                                </p>
                                            </div>

                                            <div className="category-item-actions">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            category
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}


import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";

import "../components/home/home.css";
import "../components/products/products.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("latest");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = {};

                if (search.trim()) {
                    params.search = search.trim();
                }

                if (category) {
                    params.category_id = category;
                }

                if (sort) {
                    params.sort = sort;
                }

                const response = await api.get("/products", {
                    params,
                });

                console.log("PRODUCTS RESPONSE:", response.data);

                const data = response.data;

                if (Array.isArray(data?.data?.data)) {
                    setProducts(data.data.data);
                } else if (Array.isArray(data?.data)) {
                    setProducts(data.data);
                } else if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("PRODUCTS ERROR:", err);

                setProducts([]);

                setError(
                    err.response?.data?.message ||
                        "Unable to load products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category, sort]);

    const handleDelete = (productId) => {
        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) => product.id !== productId
            )
        );
    };

    return (
        <div className="market-home">
            <Navbar />

            <main className="products-page">
                <section className="products-intro">
                    <div className="section-topline">
                        <span>02</span>
                        <span>MARKETPLACE</span>
                    </div>

                    <div className="products-intro-content">
                        <div>
                            <span className="products-eyebrow">
                                DISCOVER SOMETHING NEW
                            </span>

                            <h1>
                                The
                                <br />
                                <em>marketplace.</em>
                            </h1>
                        </div>

                        <div className="products-intro-side">
                            <p>
                                Explore everything currently listed
                                on Easy Market.
                            </p>

                            <Link to="/products/create">
                                Sell an item →
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="products-content">
                    <ProductFilters
                        category={category}
                        setCategory={setCategory}
                        sort={sort}
                        setSort={setSort}
                    />

                    <div className="products-result-info">
                        <span>
                            {loading
                                ? "Loading..."
                                : `${products.length} products`}
                        </span>

                        {!loading && (
                            <span>
                                {search
                                    ? `Results for "${search}"`
                                    : "All listings"}
                            </span>
                        )}
                    </div>

                    {loading && (
                        <div className="products-empty">
                            <span>...</span>

                            <h3>
                                Loading marketplace.
                            </h3>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="products-error">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <ProductGrid
                            products={products}
                            onDelete={handleDelete}
                        />
                    )}
                </section>
            </main>
        </div>
    );
}
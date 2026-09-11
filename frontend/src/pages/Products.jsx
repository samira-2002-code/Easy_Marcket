import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";

import "../components/home/home.css";
import "../components/products/products.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("latest");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/products");

                console.log("Products API response:", response.data);

                const data = response.data;

                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (Array.isArray(data.data)) {
                    setProducts(data.data);
                } else if (Array.isArray(data.data?.data)) {
                    setProducts(data.data.data);
                } else {
                    setProducts([]);
                    setError(
                        "The products API did not return a valid list."
                    );
                }
            } catch (err) {
                console.error("Products error:", err);

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
    }, []);

    const handleDelete = (productId) => {
        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) => product.id !== productId
            )
        );
    };

    const filteredProducts = useMemo(() => {
        let result = Array.isArray(products)
            ? [...products]
            : [];

        if (search.trim()) {
            const keyword = search.toLowerCase();

            result = result.filter((product) =>
                product.title?.toLowerCase().includes(keyword)
            );
        }

        if (category) {
            result = result.filter(
                (product) =>
                    String(product.category_id) === String(category) ||
                    String(product.category?.id) === String(category)
            );
        }

        if (sort === "price_asc") {
            result.sort(
                (a, b) =>
                    Number(a.price || 0) -
                    Number(b.price || 0)
            );
        }

        if (sort === "price_desc") {
            result.sort(
                (a, b) =>
                    Number(b.price || 0) -
                    Number(a.price || 0)
            );
        }

        if (sort === "latest") {
            result.sort(
                (a, b) =>
                    new Date(b.created_at || 0) -
                    new Date(a.created_at || 0)
            );
        }

        return result;
    }, [products, search, category, sort]);

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
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        sort={sort}
                        setSort={setSort}
                    />

                    <div className="products-result-info">

                        <span>
                            {loading
                                ? "Loading..."
                                : `${filteredProducts.length} products`}
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
                            products={filteredProducts}
                            onDelete={handleDelete}
                        />
                    )}

                </section>

            </main>
        </div>
    );
}
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/home/Navbar";

import "../components/home/home.css";
import "../components/products/products.css";
import "../components/product-details/product-details.css";

export default function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);

                const data =
                    response.data.data ||
                    response.data.product ||
                    response.data;

                setProduct(data);
            } catch (err) {
                console.error("Product details error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load this product."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const getImageUrl = () => {
        if (!product?.image) {
            return null;
        }

        if (typeof product.image === "string") {
            if (product.image.startsWith("http")) {
                return product.image;
            }

            return `http://127.0.0.1:8000/storage/${product.image}`;
        }

        return null;
    };

    const formatPrice = () => {
        if (!product?.price) {
            return "Exchange";
        }

        return `${Number(product.price).toLocaleString("fr-FR")} DH`;
    };

    if (loading) {
        return (
            <div className="market-home">
                <Navbar />

                <main className="product-details-page">
                    <div className="product-details-loading">
                        Loading product...
                    </div>
                </main>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="market-home">
                <Navbar />

                <main className="product-details-page">
                    <div className="product-details-error">
                        <span>404</span>

                        <h1>Product not found.</h1>

                        <p>
                            {error ||
                                "This product may have been removed."}
                        </p>

                        <Link
                            to="/products"
                            className="product-details-back-button"
                        >
                            <ArrowLeft size={18} />
                            Back to marketplace
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const imageUrl = getImageUrl();

    return (
        <div className="market-home">
            <Navbar />

            <main className="product-details-page">

                <section className="product-details-top">
                    <Link
                        to="/products"
                        className="product-details-back"
                    >
                        <ArrowLeft size={18} />
                        Back to marketplace
                    </Link>

                    <div className="product-details-meta">
                        <span>
                            #{String(product.id).padStart(3, "0")}
                        </span>

                        <span>
                            {product.category?.name ||
                                "Marketplace"}
                        </span>
                    </div>
                </section>

                <section className="product-details-main">

                    <div className="product-details-image">

                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.title}
                            />
                        ) : (
                            <div className="product-details-empty-image">
                                <span>NO IMAGE</span>
                            </div>
                        )}

                        {product.type && (
                            <span className="product-details-badge">
                                {product.type}
                            </span>
                        )}
                    </div>

                    <div className="product-details-info">

                        <span className="product-details-eyebrow">
                            PRODUCT
                        </span>

                        <h1>{product.title}</h1>

                        <div className="product-details-price">
                            {formatPrice()}
                        </div>

                        <div className="product-details-line" />

                        <div className="product-details-description">
                            <span>DESCRIPTION</span>

                            <p>
                                {product.description ||
                                    "No description available for this product."}
                            </p>
                        </div>

                        <div className="product-details-seller">
                            <span>SELLER</span>

                            <div className="seller-info">
                                <div className="seller-avatar">
                                    {product.user?.name
                                        ?.charAt(0)
                                        .toUpperCase() || "U"}
                                </div>

                                <div>
                                    <strong>
                                        {product.user?.name ||
                                            "Unknown seller"}
                                    </strong>

                                    <small>
                                        Easy Market seller
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="product-details-actions">

                            <button
                                type="button"
                                className="product-details-favorite"
                            >
                                <Heart size={19} />
                                Add to favorites
                            </button>

                            <button
                                type="button"
                                className="product-details-contact"
                            >
                                <MessageCircle size={19} />
                                Contact seller
                            </button>

                        </div>

                    </div>
                </section>

                <section className="product-details-bottom">

                    <div>
                        <span>01</span>
                        <strong>Category</strong>
                        <p>
                            {product.category?.name ||
                                "Marketplace"}
                        </p>
                    </div>

                    <div>
                        <span>02</span>
                        <strong>Published</strong>
                        <p>
                            {product.created_at
                                ? new Date(
                                      product.created_at
                                  ).toLocaleDateString(
                                      "fr-FR"
                                  )
                                : "—"}
                        </p>
                    </div>

                    <div>
                        <span>03</span>
                        <strong>Type</strong>
                        <p>
                            {product.type ||
                                "Sale"}
                        </p>
                    </div>

                </section>
            </main>
        </div>
    );
}
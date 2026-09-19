import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Heart,
    X,
    ArrowUpRight,
} from "lucide-react";
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
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [showContact, setShowContact] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageError, setMessageError] = useState("");

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

    const handleContactSeller = () => {
        setShowContact(true);
        setMessage("");
        setMessageSuccess("");
        setMessageError("");
    };

    const closeContact = () => {
        if (sending) {
            return;
        }

        setShowContact(false);
        setMessageError("");
        setMessageSuccess("");
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setMessageError("Write a message before sending.");
            return;
        }

        try {
            setSending(true);
            setMessageError("");
            setMessageSuccess("");

            await api.post("/messages", {
                product_id: product.id,
                message: message.trim(),
            });

            setMessage("");
            setMessageSuccess("Message sent successfully.");
        } catch (err) {
            console.error("Send message error:", err);

            setMessageError(
                err.response?.data?.message ||
                "Unable to send your message."
            );
        } finally {
            setSending(false);
        }

    };
    const handleFavorite = async () => {
        try {
            setFavoriteLoading(true);

            if (isFavorite) {
                await api.delete(`/favorites/${product.id}`);
                setIsFavorite(false);
            } else {
                await api.post("/favorites", {
                    product_id: product.id,
                });
                setIsFavorite(true);
            }
        } catch (err) {
            console.error("Favorite error:", err);

            console.error(
                err.response?.data || err.message
            );
        } finally {
            setFavoriteLoading(false);
        }
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
                                className={`product-details-favorite ${isFavorite ? "active" : ""
                                    }`}
                                onClick={handleFavorite}
                                disabled={favoriteLoading}
                            >
                                <Heart
                                    size={19}
                                    fill={isFavorite ? "currentColor" : "none"}
                                />

                                {favoriteLoading
                                    ? "Loading..."
                                    : isFavorite
                                        ? "Remove from favorites"
                                        : "Add to favorites"}
                            </button>

                            <button
                                type="button"
                                className="product-details-contact"
                                onClick={handleContactSeller}
                            >
                                Contact seller
                                <ArrowUpRight size={18} />
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
                            {product.type || "Sale"}
                        </p>
                    </div>

                </section>

            </main>

            {showContact && (
                <>

                    <div
                        className="contact-overlay"
                        onClick={closeContact}
                    />

                    <aside className="contact-drawer">

                        <div className="contact-drawer-top">

                            <span>
                                EASY MARKET / CONTACT
                            </span>

                            <button
                                type="button"
                                onClick={closeContact}
                                disabled={sending}
                                aria-label="Close contact panel"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        <div className="contact-drawer-heading">

                            <span>MESSAGE 01</span>

                            <h2>
                                Let's
                                <br />
                                <em>talk.</em>
                            </h2>

                            <p>
                                Ask the seller about this
                                listing, its condition,
                                availability or anything else.
                            </p>

                        </div>

                        <div className="contact-product-preview">

                            <div className="contact-product-image">

                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.title}
                                    />
                                ) : (
                                    <span>
                                        NO IMAGE
                                    </span>
                                )}

                            </div>

                            <div>

                                <span>
                                    {product.category?.name ||
                                        "MARKETPLACE"}
                                </span>

                                <strong>
                                    {product.title}
                                </strong>

                                <small>
                                    {formatPrice()}
                                </small>

                            </div>

                        </div>

                        <div className="contact-seller-preview">

                            <span>YOU ARE CONTACTING</span>

                            <strong>
                                {product.user?.name ||
                                    "Unknown seller"}
                            </strong>

                        </div>

                        <form
                            className="contact-drawer-form"
                            onSubmit={handleSendMessage}
                        >

                            <label htmlFor="seller-message">
                                YOUR MESSAGE
                            </label>

                            <textarea
                                id="seller-message"
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Hi, I'm interested in this item..."
                                maxLength="2000"
                                rows="7"
                                autoFocus
                            />

                            <div className="contact-character-count">
                                {message.length} / 2000
                            </div>

                            {messageError && (
                                <div className="contact-form-error">
                                    {messageError}
                                </div>
                            )}

                            {messageSuccess && (
                                <div className="contact-form-success">
                                    <span>✓</span>
                                    {messageSuccess}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="contact-send-button"
                                disabled={sending}
                            >
                                <span>
                                    {sending
                                        ? "Sending..."
                                        : "Send message"}
                                </span>

                                {!sending && (
                                    <ArrowUpRight size={20} />
                                )}
                            </button>

                        </form>

                        <div className="contact-drawer-footer">
                            <span>
                                EASY MARKET
                            </span>

                            <span>
                                BUY / SELL / EXCHANGE
                            </span>
                        </div>

                    </aside>

                </>
            )}

        </div>
    );
}


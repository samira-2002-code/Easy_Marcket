import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/home/Navbar";

import "../components/home/home.css";
import "../components/products/products.css";

export default function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/messages");

                setMessages(response.data.data || []);
            } catch (err) {
                console.error("Messages error:", err);

                setError(
                    err.response?.data?.message ||
                        "Unable to load messages."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    return (
        <div className="market-home">
            <Navbar />

            <main className="products-page">
                <section className="products-intro">
                    <div className="section-topline">
                        <span>06</span>
                        <span>MESSAGES</span>
                    </div>

                    <div className="products-intro-content">
                        <div>
                            <span className="products-eyebrow">
                                YOUR CONVERSATIONS
                            </span>

                            <h1>
                                Your
                                <br />
                                <em>messages.</em>
                            </h1>
                        </div>

                        <div className="products-intro-side">
                            <p>
                                View your conversations with
                                Easy Market sellers and buyers.
                            </p>

                            <Link to="/products">
                                Back to marketplace →
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="products-content">
                    {loading && (
                        <div className="products-empty">
                            <span>...</span>

                            <h3>Loading messages.</h3>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="products-error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        messages.length === 0 && (
                            <div className="products-empty">
                                <span>00</span>

                                <h3>No messages yet.</h3>

                                <p>
                                    Contact a seller from a product
                                    page to start a conversation.
                                </p>
                            </div>
                        )}

                    {!loading &&
                        !error &&
                        messages.length > 0 && (
                            <div className="products-page-grid">
                                {messages.map((message) => (
                                    <article
                                        key={message.id}
                                        className="editorial-product-card"
                                    >
                                        <div className="product-details">
                                            <div className="product-category-line">
                                                <span>
                                                    MESSAGE #
                                                    {String(
                                                        message.id
                                                    ).padStart(
                                                        3,
                                                        "0"
                                                    )}
                                                </span>

                                                <span>
                                                    {message.created_at
                                                        ? new Date(
                                                              message.created_at
                                                          ).toLocaleDateString(
                                                              "fr-FR"
                                                          )
                                                        : ""}
                                                </span>
                                            </div>

                                            <h3>
                                                {message.product?.title ||
                                                    "Product"}
                                            </h3>

                                            <p>
                                                {message.message}
                                            </p>

                                            <div className="product-footer">
                                                <span>
                                                    From:{" "}
                                                    {message.sender
                                                        ?.name ||
                                                        "Unknown"}
                                                </span>

                                                <span>
                                                    To:{" "}
                                                    {message.receiver
                                                        ?.name ||
                                                        "Unknown"}
                                                </span>
                                            </div>
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
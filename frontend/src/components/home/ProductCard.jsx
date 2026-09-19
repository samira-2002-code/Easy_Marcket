import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ProductCard({
    product,
    featured = false,
    onDelete,
}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

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

    const imageUrl = getImageUrl();

    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const response = await api.get("/favorites");

                const favorites = response.data?.data || [];

                const favorite = favorites.find(
                    (item) =>
                        String(item.product_id) ===
                        String(product.id)
                );

                if (favorite) {
                    setIsFavorite(true);
                    setFavoriteId(favorite.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (error) {
                console.error("Check favorite error:", error);
            }
        };

        if (product?.id) {
            checkFavorite();
        }
    }, [product?.id]);

    const handleFavorite = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (favoriteLoading) {
            return;
        }

        try {
            setFavoriteLoading(true);

            if (isFavorite && favoriteId) {
                await api.delete(`/favorites/${favoriteId}`);

                setIsFavorite(false);
                setFavoriteId(null);

                return;
            }

            const response = await api.post("/favorites", {
                product_id: product.id,
            });

            const favorite = response.data?.data;

            setIsFavorite(true);
            setFavoriteId(favorite?.id || null);
        } catch (error) {
            console.error("Favorite error:", error);

            alert(
                error.response?.data?.message ||
                    "Impossible de modifier ce favori."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette annonce ?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/products/${product.id}`);

            if (onDelete) {
                onDelete(product.id);
            }
        } catch (err) {
            console.error("Delete product error:", err);

            alert(
                err.response?.data?.message ||
                    "Impossible de supprimer cette annonce."
            );
        }
    };

    return (
        <article
            className={`editorial-product-card ${
                featured ? "featured-product" : ""
            }`}
        >
            <div className="product-visual">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.title || "Product"}
                    />
                ) : (
                    <div className="product-empty-image">
                        <span>NO IMAGE</span>
                    </div>
                )}

                <button
                    type="button"
                    className={`product-save ${
                        isFavorite ? "is-favorite" : ""
                    }`}
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                    aria-label={
                        isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }
                >
                    <Heart
                        size={18}
                        strokeWidth={1.8}
                        fill={
                            isFavorite
                                ? "currentColor"
                                : "none"
                        }
                    />
                </button>

                {product.type && (
                    <span className="product-badge">
                        {product.type}
                    </span>
                )}

                <span className="product-number">
                    #{String(product.id).padStart(3, "0")}
                </span>
            </div>

            <div className="product-details">
                <div className="product-meta-row">
                    <span className="product-category-line">{product.category?.name || "Marketplace"}</span>
                    <span className="product-price">{product.type === "exchange" ? "Exchange" : product.price ? `${Number(product.price).toLocaleString("fr-FR")} DH` : "Price on request"}</span>
                </div>
                <h3>{product.title}</h3>
                <div className="product-footer">
                    <span className="product-location">LOCAL LISTING / #{String(product.id).padStart(3, "0")}</span>
                    <Link to={`/products/${product.id}`}>View item <span>↗</span></Link>
                    {onDelete && <button type="button" onClick={handleDelete} className="product-delete">Delete</button>}
                </div>
            </div>
        </article>
    );
}
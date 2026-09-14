import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ProductCard({
  product,
  featured = false,
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const getImageUrl = () => {
    if (!product.image) {
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

        const favorites = response.data.data || [];

        const favorite = favorites.find(
          (item) => item.product_id === product.id
        );

        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite.id);
        }
      } catch (error) {
        console.error("Check favorite error:", error);
      }
    };

    checkFavorite();
  }, [product.id]);

  const handleFavorite = async () => {
    if (favoriteLoading) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite && favoriteId) {
        await api.delete(`/favorites/${favoriteId}`);

        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await api.post("/favorites", {
          product_id: product.id,
        });

        const favorite = response.data.data;

        setIsFavorite(true);
        setFavoriteId(favorite.id);
      }
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
          className="product-save"
          onClick={handleFavorite}
          disabled={favoriteLoading}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {isFavorite ? "♥" : "♡"}
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
        <div className="product-category-line">
          <span>
            {product.category?.name || "Marketplace"}
          </span>

          {product.created_at && (
            <span>
              {new Date(product.created_at).toLocaleDateString(
                "fr-FR"
              )}
            </span>
          )}
        </div>

        <h3>{product.title}</h3>

        <div className="product-footer">
          <strong>
            {product.price
              ? `${Number(product.price).toLocaleString(
                  "fr-FR"
                )} DH`
              : "Exchange"}
          </strong>

          <Link to={`/products/${product.id}`}>
            View item →
          </Link>
        </div>
      </div>
    </article>
  );
}

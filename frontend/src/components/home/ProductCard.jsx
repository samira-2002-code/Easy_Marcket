import { Link } from "react-router-dom";
import api from "../../services/api";

export default function ProductCard({ product, featured = false, onDelete }) {
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

  const imageUrl = getImageUrl();

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
          aria-label="Save product"
        >
          ♡
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

          <button
            type="button"
            onClick={handleDelete}
            className="product-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
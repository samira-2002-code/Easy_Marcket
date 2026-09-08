import { Link } from "react-router-dom";

export default function ProductCard({ product, featured = false }) {
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
        </div>
      </div>
    </article>
  );
}
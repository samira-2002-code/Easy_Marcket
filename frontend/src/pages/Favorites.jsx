import { useEffect, useState } from "react";
import { ArrowUpRight, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await api.get("/favorites");

        console.log("FAVORITES:", response.data);

        setFavorites(response.data.data || []);
      } catch (error) {
        console.error("FAVORITES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);

      setFavorites((current) =>
        current.filter((favorite) => favorite.id !== favoriteId)
      );
    } catch (error) {
      console.error("REMOVE FAVORITE ERROR:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ed] flex items-center justify-center">
        <p className="text-gray-600">Chargement des favoris...</p>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="saved-shell">

        {/* Header */}
        <div className="saved-header">
          <Link to="/" className="saved-back">← Back to market</Link>
          <div className="saved-heading"><span>05 — YOUR COLLECTION</span><h1>SAVED<br /><em>FOR LATER.</em></h1></div>
          <p className="saved-count">You saved {favorites.length} product{favorites.length === 1 ? "" : "s"}</p>
        </div>

        {/* Empty */}
        {favorites.length === 0 ? (
          <div className="saved-empty">
            <Heart size={28} />
            <span className="empty-index">00 / 00</span>
            <h2>YOUR SAVED<br /><em>FINDS ARE WAITING.</em></h2>
            <p>Start exploring the marketplace and keep the pieces that feel like you.</p>
            <Link to="/products">Explore products <ArrowUpRight size={16} /></Link>
          </div>
        ) : (
          /* Products */
          <div className="saved-grid">
            {favorites.map((favorite) => {
              const product = favorite.product;

              return (
                <article key={favorite.id} className="saved-product">
                  <div className="saved-product-visual">
                    {product?.image ? (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `http://127.0.0.1:8000/storage/${product.image}`
                        }
                        alt={product.title}
                        className="saved-product-image"
                      />
                    ) : (
                      <div className="saved-no-image">
                        No image
                      </div>
                    )}

                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="saved-remove"
                      title="Retirer des favoris"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>

                  <div className="saved-product-info">
                    <p className="saved-category">
                      {product?.category?.name || "Marketplace"}
                    </p>

                    <h2>
                      {product?.title || "Produit"}
                    </h2>

                    <p className="saved-price">
                      {product?.price
                        ? `${Number(product.price).toLocaleString("fr-FR")} DH`
                        : "Prix sur demande"}
                    </p>

                    <Link
                      to={`/products/${product?.id}`}
                      className="saved-view"
                    >
                      Voir le produit
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
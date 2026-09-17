import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        setFavorites(response.data.data || []);
      } catch (error) {
        console.error("FAVORITES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return <p>Chargement des favoris...</p>;
  }

  return (
    <div>
      <h1>
        <Heart size={24} />
        Mes favoris
      </h1>

      {favorites.length === 0 ? (
        <p>Vous n'avez aucun favori.</p>
      ) : (
        <div>
          {favorites.map((favorite) => (
            <div key={favorite.id}>
              <h2>{favorite.product?.title}</h2>
              <p>{favorite.product?.price} DH</p>
              <p>{favorite.product?.category?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
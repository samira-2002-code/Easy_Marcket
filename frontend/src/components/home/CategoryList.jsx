import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");

        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des catégories :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="categories-section">
      <div className="section-topline">
        <span>02</span>
        <span>EXPLORE</span>
      </div>

      <div className="categories-header">
        <h2>
          Browse by
          <br />
          <em>category.</em>
        </h2>

        <p>
          Explore products by category and discover
          something unexpected.
        </p>
      </div>

      {loading ? (
        <div className="category-loading">
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="category-loading">
          No categories available.
        </div>
      ) : (
        <div className="category-list">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              className="category-row"
            >
              <span className="category-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="category-name">
                {category.name}
              </span>

              <span className="category-description">
                Discover products
              </span>

              <span className="category-arrow">↗</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
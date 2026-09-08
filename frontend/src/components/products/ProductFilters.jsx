import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data || response.data);
      } catch (error) {
        console.error("Erreur catégories :", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="product-filters">
      <div className="products-search">
        <span>⌕</span>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All categories</option>

        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ProductFilters({
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    type,
    setType,
    sort,
    setSort,
}) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categories");

                setCategories(
                    response.data?.data || response.data || []
                );
            } catch (error) {
                console.error(
                    "Erreur catégories :",
                    error
                );
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="product-filters">
            <div className="filter-heading"><span>FILTER / 01</span><strong>Refine your view</strong></div>
            <label>Category
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
            </label>
            <label>Sort by
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="latest">Latest arrivals</option>
                    <option value="oldest">Oldest arrivals</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                </select>
            </label>
            <label>Type
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All listing types</option>
                    <option value="sale">Sale</option>
                    <option value="exchange">Exchange</option>
                </select>
            </label>
            <div className="filter-price-row">
                <label>Min price<input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" /></label>
                <label>Max price<input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Any" /></label>
            </div>
        </div>
    );
}
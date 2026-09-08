import ProductCard from "../home/ProductCard";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="products-empty">
        <span>00</span>

        <h3>No products found.</h3>

        <p>
          Try another search or explore a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="products-page-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
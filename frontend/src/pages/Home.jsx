import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import CategoryList from "../components/home/CategoryList";
import ProductCard from "../components/home/ProductCard";

import "../components/home/home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");

        setProducts(response.data.data || response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="market-home">
      <Navbar />

      <main>
        <Hero />

        <CategoryList />

        <section className="latest-section" id="latest">
          <div className="section-topline">
            <span>03</span>
            <span>JUST LISTED</span>
          </div>

          <div className="latest-header">
            <div>
              <h2>
                Latest
                <br />
                <em>finds.</em>
              </h2>
            </div>

            <a href="/products" className="view-all-products">
              View all products →
            </a>
          </div>

          {loading && (
            <div className="products-state">
              <span>Loading marketplace...</span>
            </div>
          )}

          {error && (
            <div className="products-state error-state">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="products-state empty-state">
              <span className="empty-number">00</span>

              <h3>No products yet.</h3>

              <p>
                Be the first person to put something
                interesting on the market.
              </p>

              <a href="/products/create">
                Sell your first item →
              </a>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="editorial-products-grid">
              {products.slice(0, 8).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  featured={index === 0}
                />
              ))}
            </div>
          )}
        </section>

        <section className="sell-banner">
          <div className="sell-number">04</div>

          <div className="sell-content">
            <span>GOT SOMETHING TO SELL?</span>

            <h2>
              Give it
              <br />
              <em>a new life.</em>
            </h2>
          </div>

          <a href="/products/create" className="sell-button">
            Start selling
            <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="market-footer">
        <div>
          <span className="footer-logo">EASY MARKET</span>
          <p>Find. Connect. Trade.</p>
        </div>

        <span>© {new Date().getFullYear()} Easy Market</span>
      </footer>
    </div>
  );
}
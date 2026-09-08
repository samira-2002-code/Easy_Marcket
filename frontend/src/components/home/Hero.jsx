import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="editorial-hero">
      <div className="hero-copy">
        <div className="hero-meta">
          <span>01</span>
          <span>THE EASY MARKETPLACE</span>
        </div>

        <h1>
          Find things
          <br />
          <em>worth keeping.</em>
        </h1>

        <p>
          Discover unique products, great deals and second-hand
          treasures from people around you.
        </p>

        <div className="hero-buttons">
          <a href="#latest" className="hero-primary">
            Explore marketplace
            <span>↗</span>
          </a>

          <Link to="/products/create" className="hero-secondary">
            Sell something
          </Link>
        </div>
      </div>

      <div className="hero-product">
        <div className="hero-product-number">
          <span>FEATURED</span>
          <strong>01 / 04</strong>
        </div>

        <div className="hero-image-placeholder">
          <span>PRODUCT</span>
          <strong>OF THE DAY</strong>
        </div>

        <div className="hero-product-info">
          <div>
            <span>EDITOR'S PICK</span>
            <h3>Something worth finding.</h3>
          </div>

          <span className="hero-arrow">↗</span>
        </div>
      </div>

      <div className="hero-circle">
        <span>SCROLL</span>
        <span>↓</span>
      </div>
    </section>
  );
}
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function getImageUrl(image) {
	if (!image) return null;
	return image.startsWith("http")
		? image
		: `http://127.0.0.1:8000/storage/${image}`;
}

export default function Hero({ product, loading }) {
	const imageUrl = getImageUrl(product?.image);

	return (
		<section className="editorial-hero">
			<div className="hero-copy">
				<div className="hero-meta"><span>01</span><span>THE EASY MARKETPLACE</span></div>
				<h1>FIND<br />WHAT&apos;S<br /><em>WORTH</em><br />KEEPING.</h1>
				<p>Objects with a past, a purpose, and a place in your next chapter. Discover local finds worth holding onto.</p>
				<div className="hero-buttons">
					<Link to="/products" className="hero-primary">Explore marketplace <ArrowUpRight size={16} /></Link>
					<Link to="/products/create" className="hero-secondary">Sell something <span>+</span></Link>
				</div>
			</div>

			<div className="hero-product-wrap">
				<div className="hero-stamp"><Sparkles size={13} /><span>CURATED<br />NEAR YOU</span></div>
				<article className="hero-product">
					<div className="hero-product-number"><span>FEATURED FIND</span><strong>{product ? `#${String(product.id).padStart(3, "0")}` : "#---"}</strong></div>
					<div className="hero-image-placeholder">
						{imageUrl ? <img src={imageUrl} alt={product.title} /> : <span>{loading ? "LOADING A LOCAL FIND" : "NO FEATURED IMAGE"}</span>}
					</div>
					<div className="hero-product-info">
						<div>
							<span>{product?.category?.name || "THE MARKETPLACE"}</span>
							<h3>{product?.title || (loading ? "Finding something good..." : "Your next good find")}</h3>
						</div>
						<strong>{product?.price ? `${Number(product.price).toLocaleString("fr-FR")} DH` : product?.type === "exchange" ? "EXCHANGE" : "—"}</strong>
					</div>
				</article>
				<span className="hero-orbit orbit-one" />
				<span className="hero-orbit orbit-two" />
			</div>
		</section>
	);
}
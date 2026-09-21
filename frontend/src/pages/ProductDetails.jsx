import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Lock,
    MessageCircle,
    Send,
    UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../components/product-details/product-details.css";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const [activeImage, setActiveImage] = useState(0);

    const [message, setMessage] = useState("");
    const [messageLoading, setMessageLoading] = useState(false);

    /*
     * ---------------------------------------------------------
     * GET PRODUCT
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);

                const data = response.data?.data ?? response.data;

                setProduct(data);
            } catch (err) {
                console.error("Product details error:", err);

                setError(
                    err.response?.data?.message ||
                        "Impossible de charger cette annonce."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    /*
     * ---------------------------------------------------------
     * CHECK FAVORITE
     * ---------------------------------------------------------
     */
    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const response = await api.get("/favorites");

                const favorites = response.data?.data ?? response.data ?? [];

                const favorite = Array.isArray(favorites)
                    ? favorites.find(
                          (item) =>
                              String(item.product_id) === String(id)
                      )
                    : null;

                if (favorite) {
                    setIsFavorite(true);
                    setFavoriteId(favorite.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (err) {
                /*
                 * L'utilisateur peut ne pas être connecté.
                 * On ne bloque pas l'affichage de la page.
                 */
                setIsFavorite(false);
                setFavoriteId(null);

                console.log("Favorite check skipped.");
            }
        };

        if (id) {
            checkFavorite();
        }
    }, [id]);

    /*
     * ---------------------------------------------------------
     * IMAGES
     * ---------------------------------------------------------
     */
    const images = useMemo(() => {
        if (!product) {
            return [];
        }

        const result = [];

        if (product.image) {
            result.push(product.image);
        }

        if (Array.isArray(product.images)) {
            product.images.forEach((item) => {
                const image =
                    typeof item === "string"
                        ? item
                        : item?.image;

                if (image && !result.includes(image)) {
                    result.push(image);
                }
            });
        }

        return result;
    }, [product]);

    /*
     * Évite que activeImage pointe vers une image inexistante
     * après un changement de produit.
     */
    useEffect(() => {
        if (activeImage >= images.length && images.length > 0) {
            setActiveImage(0);
        }
    }, [images, activeImage]);

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            typeof image === "string" &&
            image.startsWith("http")
        ) {
            return image;
        }

        return `http://localhost:8000/storage/${image}`;
    };

    /*
     * ---------------------------------------------------------
     * SELLER
     * ---------------------------------------------------------
     */
    const seller = product?.user || product?.seller;

    const sellerName =
        seller?.name ||
        seller?.username ||
        seller?.email ||
        "Easy Market user";

    const sellerLocation =
        seller?.location ||
        seller?.city ||
        "Local seller";

    const sellerId =
        product?.user_id ||
        product?.user?.id ||
        product?.seller_id ||
        product?.seller?.id ||
        null;

    /*
     * ---------------------------------------------------------
     * PRODUCT INFO
     * ---------------------------------------------------------
     */
    const categoryName =
        product?.category?.name ||
        product?.category_name ||
        "Marketplace";

    const productType = product?.type || "Sale";

    const price =
        product?.price !== null &&
        product?.price !== undefined &&
        product?.price !== ""
            ? `${Number(product.price).toLocaleString(
                  "fr-FR"
              )} DH`
            : "Price on request";

    const currentImage =
        images.length > 0
            ? getImageUrl(images[activeImage])
            : null;

    /*
     * ---------------------------------------------------------
     * IMAGE NAVIGATION
     * ---------------------------------------------------------
     */
    const nextImage = () => {
        if (images.length < 2) {
            return;
        }

        setActiveImage((current) =>
            current === images.length - 1 ? 0 : current + 1
        );
    };

    const previousImage = () => {
        if (images.length < 2) {
            return;
        }

        setActiveImage((current) =>
            current === 0 ? images.length - 1 : current - 1
        );
    };

    /*
     * ---------------------------------------------------------
     * FAVORITES
     * ---------------------------------------------------------
     */
    const handleFavorite = async () => {
        if (favoriteLoading || !product) {
            return;
        }

        try {
            setFavoriteLoading(true);

            if (isFavorite && favoriteId) {
                await api.delete(`/favorites/${favoriteId}`);

                setIsFavorite(false);
                setFavoriteId(null);
            } else {
                const response = await api.post("/favorites", {
                    product_id: product.id,
                });

                const favorite =
                    response.data?.data ?? response.data;

                setIsFavorite(true);
                setFavoriteId(favorite?.id || null);
            }
        } catch (err) {
            console.error("Favorite error:", err);

            alert(
                err.response?.data?.message ||
                    "Impossible de modifier ce favori. Vérifiez que vous êtes connecté."
            );
        } finally {
            setFavoriteLoading(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * SEND MESSAGE
     * ---------------------------------------------------------
     */
    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!message.trim() || messageLoading) {
            return;
        }

        if (!sellerId) {
            alert(
                "Impossible de contacter le vendeur : son identifiant est introuvable."
            );
            return;
        }

        try {
            setMessageLoading(true);

            await api.post("/messages", {
                product_id: product.id,
                receiver_id: sellerId,
                content: message.trim(),
            });

            setMessage("");

            alert("Message envoyé.");
        } catch (err) {
            console.error("Send message error:", err);

            alert(
                err.response?.data?.message ||
                    "Impossible d'envoyer le message."
            );
        } finally {
            setMessageLoading(false);
        }
    };

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */
    if (loading) {
        return (
            <main className="product-details-page">
                <div className="product-details-state">
                    <span>LOADING</span>
                    <h1>Loading product...</h1>
                </div>
            </main>
        );
    }

    /*
     * ---------------------------------------------------------
     * ERROR
     * ---------------------------------------------------------
     */
    if (error || !product) {
        return (
            <main className="product-details-page">
                <div className="product-details-state">
                    <span>404 / PRODUCT</span>

                    <h1>
                        {error || "Product not found."}
                    </h1>

                    <Link
                        to="/products"
                        className="product-details-back-button"
                    >
                        <ArrowLeft size={16} />
                        Back to marketplace
                    </Link>
                </div>
            </main>
        );
    }

    /*
     * ---------------------------------------------------------
     * PAGE
     * ---------------------------------------------------------
     */
    return (
        <main className="product-details-page">
            <div className="product-details-container">
                {/* MOBILE HEADER */}
                <div className="product-details-mobile-header">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <span>PRODUCT DETAILS</span>

                    <button
                        type="button"
                        onClick={handleFavorite}
                        className={
                            isFavorite ? "is-active" : ""
                        }
                        aria-label="Favorite"
                        disabled={favoriteLoading}
                    >
                        <Heart
                            size={19}
                            fill={
                                isFavorite
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>
                </div>

                {/* TOP BAR */}
                <div className="product-details-topbar">
                    <Link to="/products">
                        <ArrowLeft size={15} />
                        BACK TO MARKETPLACE
                    </Link>

                    <div className="product-details-archive">
                        <span>
                            #
                            {String(product.id).padStart(
                                3,
                                "0"
                            )}{" "}
                            / ARCHIVE
                        </span>

                        <span>•</span>

                        <span>{categoryName}</span>
                    </div>

                    <div className="product-details-status">
                        <span>
                            LISTING ID: EM-{product.id}
                        </span>

                        <span>● ACTIVE</span>
                    </div>
                </div>

                {/* MAIN */}
                <section className="product-details-main">
                    {/* LEFT / IMAGE */}
                    <div className="product-details-visual-column">
                        <div className="product-details-image-frame">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={product.title}
                                />
                            ) : (
                                <div className="product-details-no-image">
                                    <span>NO IMAGE</span>
                                </div>
                            )}

                            <div className="product-details-image-top">
                                <span>
                                    PLATE{" "}
                                    {String(
                                        activeImage + 1
                                    ).padStart(2, "0")}
                                </span>

                                <span>
                                    ● LOCAL LISTING
                                </span>
                            </div>

                            <div className="product-details-image-bottom">
                                <span>
                                    {productType.toUpperCase()} • #
                                    {String(
                                        product.id
                                    ).padStart(3, "0")}
                                </span>

                                {images.length > 1 && (
                                    <div className="product-gallery-controls">
                                        <button
                                            type="button"
                                            onClick={
                                                previousImage
                                            }
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft
                                                size={17}
                                            />
                                        </button>

                                        <span>
                                            {String(
                                                activeImage + 1
                                            ).padStart(2, "0")}{" "}
                                            /{" "}
                                            {String(
                                                images.length
                                            ).padStart(2, "0")}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            aria-label="Next image"
                                        >
                                            <ChevronRight
                                                size={17}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="product-details-thumbnails">
                                {images.map(
                                    (image, index) => (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            className={
                                                activeImage ===
                                                index
                                                    ? "is-active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveImage(
                                                    index
                                                )
                                            }
                                        >
                                            <img
                                                src={getImageUrl(
                                                    image
                                                )}
                                                alt={`${product.title} ${
                                                    index + 1
                                                }`}
                                            />

                                            <span>
                                                PLATE{" "}
                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                        </button>
                                    )
                                )}
                            </div>
                        )}

                        <div className="product-details-inspection">
                            <div className="inspection-icon">
                                ✓
                            </div>

                            <div>
                                <div className="inspection-heading">
                                    LISTING INFORMATION
                                    <span>VERIFIED</span>
                                </div>

                                <p>
                                    This listing is published
                                    through the Easy Market
                                    marketplace.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT / INFO */}
                    <div className="product-details-info">
                        <div className="product-details-eyebrow">
                            <span>
                                01 // PRODUCT SPECIFICATION
                            </span>

                            <span>
                                REF. EM-
                                {String(
                                    product.id
                                ).padStart(4, "0")}
                            </span>
                        </div>

                        <h1>{product.title}</h1>

                        <div className="product-details-price-row">
                            <strong>{price}</strong>

                            <span className="product-details-stock">
                                ● {productType.toUpperCase()}
                            </span>
                        </div>

                        <div className="product-details-description">
                            {product.description ? (
                                <p>{product.description}</p>
                            ) : (
                                <p>
                                    No description was provided
                                    for this listing.
                                </p>
                            )}
                        </div>

                        <div className="product-details-specs">
                            <div>
                                <span>CATEGORY</span>
                                <strong>
                                    {categoryName}
                                </strong>
                            </div>

                            <div>
                                <span>TYPE</span>
                                <strong>
                                    {productType}
                                </strong>
                            </div>

                            <div>
                                <span>REFERENCE</span>
                                <strong>
                                    #
                                    {String(
                                        product.id
                                    ).padStart(3, "0")}
                                </strong>
                            </div>

                            <div>
                                <span>PRICE</span>
                                <strong>{price}</strong>
                            </div>
                        </div>

                        {/* SELLER */}
                        <div className="product-details-seller">
                            <div className="seller-heading">
                                <span>
                                    SELLER / CONSIGNOR
                                </span>

                                <span>MARKETPLACE</span>
                            </div>

                            <div className="seller-content">
                                <div className="seller-avatar">
                                    <UserRound size={22} />
                                </div>

                                <div className="seller-info">
                                    <strong>
                                        {sellerName}
                                    </strong>

                                    <span>
                                        ✓ Easy Market seller
                                    </span>

                                    <small>
                                        {sellerLocation}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="product-details-actions">
                            <button
                                type="button"
                                className="product-details-primary"
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "product-enquiry"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                            >
                                <MessageCircle size={17} />
                                CONTACT SELLER
                                <span>↗</span>
                            </button>

                            <button
                                type="button"
                                className={`product-details-secondary ${
                                    isFavorite
                                        ? "is-active"
                                        : ""
                                }`}
                                onClick={handleFavorite}
                                disabled={favoriteLoading}
                            >
                                <Heart
                                    size={17}
                                    fill={
                                        isFavorite
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                                {isFavorite
                                    ? "REMOVE FROM FAVORITES"
                                    : "ADD TO FAVORITES"}
                            </button>
                        </div>

                        <div className="product-details-trust">
                            <Lock size={14} />

                            <span>
                                Communicate safely through Easy
                                Market messaging.
                            </span>
                        </div>
                    </div>
                </section>

                {/* MESSAGE */}
                <section
                    id="product-enquiry"
                    className="product-details-enquiry"
                >
                    <div className="enquiry-heading">
                        <span>02 // DIRECT ENQUIRY</span>

                        <h2>Let&apos;s talk.</h2>
                    </div>

                    <div className="enquiry-product">
                        <div className="enquiry-thumb">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={product.title}
                                />
                            ) : (
                                <span>NO IMAGE</span>
                            )}
                        </div>

                        <div>
                            <strong>{product.title}</strong>
                            <span>{price}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSendMessage}>
                        <textarea
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            maxLength={2000}
                            placeholder="Ask the seller about this listing..."
                        />

                        <div className="enquiry-footer">
                            <span>
                                READY TO SEND {message.length}/2000
                            </span>

                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    messageLoading
                                }
                            >
                                <Send size={15} />

                                {messageLoading
                                    ? "SENDING..."
                                    : "SEND MESSAGE"}
                            </button>
                        </div>
                    </form>
                </section>

                {/* METADATA */}
                <section className="product-details-metadata">
                    <div>
                        <span>01 CATEGORY</span>
                        <strong>{categoryName}</strong>
                    </div>

                    <div>
                        <span>02 PRODUCT ID</span>
                        <strong>
                            #
                            {String(product.id).padStart(
                                3,
                                "0"
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>03 TYPE</span>
                        <strong>{productType}</strong>
                    </div>
                </section>

                <div className="product-details-footer-stamp">
                    EASY MARKET • MARKETPLACE LISTING • #
                    {String(product.id).padStart(3, "0")}
                </div>
            </div>
        </main>
    );
}





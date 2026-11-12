
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <main className="wishlist-page container">

      <section className="wishlist-heading">
        <span className="wishlist-eyebrow">YOUR PERSONAL COLLECTION</span>
        <h1>My Wishlist</h1>
        <p>
          Your favourite finds, all in one place.
        </p>
        <span className="wishlist-count">
          {wishlistItems.length} saved products
        </span>
      </section>

      {wishlistItems.length > 0 ? (

        <div className="wishlist-grid">

          {wishlistItems.map((product) => (
            <article className="wishlist-card" key={product.id}>

              <div className="wishlist-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>

                <button
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="wishlist-info">

                <span>{product.category}</span>

                <h3>
                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                <strong>
                  Rs. {product.price.toLocaleString("en-PK")}
                </strong>

                <button
                  className="add-to-bag-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag size={17} />
                  Add to Bag
                </button>

              </div>

            </article>
          ))}

        </div>

      ) : (

        <section className="wishlist-empty">
          <div className="wishlist-empty-icon">
            <Heart size={38} />
          </div>

          <h2>Your Wishlist is Empty</h2>

          <p>
            You haven't saved any products yet.
            Explore our collection and save your favourites.
          </p>

          <Link to="/shop" className="wishlist-shop-btn">
            Explore Products
            <ArrowRight size={18} />
          </Link>
        </section>

      )}

    </main>
  );
}

export default Wishlist;

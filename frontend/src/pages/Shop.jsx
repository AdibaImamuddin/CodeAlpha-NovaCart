
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Heart,
  ShoppingBag,
} from "lucide-react";

import "../styles/shop.css";

const API = "https://codealphanovacart-one.vercel.app/api/products";

function Shop() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );

  const [sort, setSort] = useState("default");
  const [addedProducts, setAddedProducts] = useState([]);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load products.");
        }

        const formattedProducts = (data.products || []).map((product) => ({
          ...product,
          id: product._id,
          oldPrice: product.price,
          tag: "NEW",
          image:
            product.image ||
            "https://placehold.co/600x750?text=No+Image",
        }));

        setProducts(formattedProducts);
      } catch (err) {
        setError(err.message || "Server connection failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sync search and category with URL parameters
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  // Generate categories from database products
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(products.map((product) => product.category)),
    ];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort]);

  const handleAddToBag = (product) => {
    addToCart(product, 1);

    setAddedProducts((previous) =>
      previous.includes(product.id)
        ? previous
        : [...previous, product.id]
    );
  };

  const handleWishlist = (product) => {
    toggleWishlist(product);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

  return (
    <main className="shop-page">
      <section className="shop-heading">
        <span className="shop-eyebrow">
          THE NOVACART COLLECTION
        </span>

        <h1>Find Your Next Favourite.</h1>

        <p>
          Explore thoughtfully selected pieces that bring style,
          comfort and personality into your everyday life.
        </p>
      </section>

      <section className="shop-toolbar">
        <div className="shop-search">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shop-sort">
          <ArrowUpDown size={18} />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">Default Sorting</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </section>

      <section className="shop-content">
        <aside className="shop-sidebar">
          <h3>
            <SlidersHorizontal size={18} />
            Categories
          </h3>

          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <div className="shop-products-area">
          <div className="products-heading">
            <div>
              <span>CURATED FOR YOU</span>
              <h2>
                {category === "All" ? "All Products" : category}
              </h2>
            </div>

            <p>{filteredProducts.length} products found</p>
          </div>

          {loading ? (
            <div className="no-products">
              <h3>Loading Products...</h3>
              <p>Please wait while we load your collection.</p>
            </div>
          ) : error ? (
            <div className="no-products">
              <h3>Unable to Load Products</h3>
              <p>{error}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="shop-product-grid">
              {filteredProducts.map((product) => {
                const wishlisted = isWishlisted(product.id);

                return (
                  <article
                    className="shop-product-card"
                    key={product.id}
                  >
                    <div className="shop-product-image">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      </Link>

                      <span className="product-tag">
                        {product.tag}
                      </span>

                      <button
                        type="button"
                        className={`wishlist-btn ${
                          wishlisted ? "active" : ""
                        }`}
                        onClick={() => handleWishlist(product)}
                        aria-label={
                          wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        aria-pressed={wishlisted}
                      >
                        <Heart
                          size={18}
                          fill={wishlisted ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="shop-product-info">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>
                        <Link to={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>

                      <div className="product-prices">
                        <strong>
                          Rs. {product.price.toLocaleString("en-PK")}
                        </strong>
                      </div>

                      <button
                        className="add-to-bag-btn"
                        onClick={() => handleAddToBag(product)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag size={17} />

                        {product.stock <= 0
                          ? "Out of Stock"
                          : addedProducts.includes(product.id)
                          ? "Added to Bag"
                          : "Add to Bag"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="no-products">
              <h3>No products found</h3>

              <p>
                Try another search or select a different category.
              </p>

              <button onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Shop;

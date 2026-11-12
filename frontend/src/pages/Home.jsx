import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Headset,
  Heart,
  ShoppingBag,
  Sparkles,
  Mail
} from "lucide-react";

// CATEGORIES
const categories = [
  {
    name: "Fashion",
    subtitle: "Express your style",
    image: "photo-1490481651871-ab68de25d43d"
  },
  {
    name: "Electronics",
    subtitle: "Technology made simple",
    image: "photo-1505740420928-5e560c06d30e"
  },
  {
    name: "Accessories",
    subtitle: "Details that matter",
    image: "photo-1523275335684-37898b6baf30"
  },
  {
    name: "Home & Living",
    subtitle: "Make space beautiful",
    image: "photo-1600210492486-724fe5c67fb0"
  }
];

// FEATURED PRODUCTS
const products = [
  {
    id: 1,
    name: "Classic Everyday Bag",
    category: "Fashion",
    price: 3500,
    oldPrice: 4200,
    badge: "BESTSELLER",
    image: "photo-1548036328-c9fa89d128fa"
  },
  {
    id: 2,
    name: "Minimal Wrist Watch",
    category: "Accessories",
    price: 4200,
    oldPrice: null,
    badge: "NEW",
    image: "photo-1523275335684-37898b6baf30"
  },
  {
    id: 3,
    name: "Premium Headphones",
    category: "Electronics",
    price: 5500,
    oldPrice: null,
    badge: "",
    image: "photo-1505740420928-5e560c06d30e"
  },
  {
    id: 4,
    name: "Modern Home Vase",
    category: "Home & Living",
    price: 2000,
    oldPrice: 2500,
    badge: "SALE",
    image: "photo-1578500494198-246f612d3b3d"
  }
];

// NEW ARRIVALS
const newArrivals = [
  {
    id: 5,
    name: "Elegant Summer Outfit",
    category: "Fashion",
    price: 4800,
    image: "photo-1483985988355-763728e1935b"
  },
  {
    id: 6,
    name: "Premium Sunglasses",
    category: "Accessories",
    price: 1800,
    image: "photo-1511499767150-a48a237f0083"
  },
  {
    id: 7,
    name: "Modern Table Lamp",
    category: "Home & Living",
    price: 3200,
    image: "photo-1507473885765-e6ed057f782c"
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    category: "Electronics",
    price: 3900,
    image: "photo-1606220945770-b5b6c2c55bf1"
  }
];

// PRODUCT CARD COMPONENT
const ProductCard = ({ product }) => (
  <article className="product-card">

    <div className="product-image">
      <img
        src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=85`}
        alt={product.name}
        loading="lazy"
      />

      {product.badge && (
        <span className="product-badge">
          {product.badge}
        </span>
      )}

      <button
        className="product-wishlist"
        aria-label="Add to wishlist"
      >
        <Heart size={18} />
      </button>

      <Link to="/shop" className="quick-view">
        Explore Product <ArrowUpRight size={16} />
      </Link>
    </div>

    <div className="product-info">
      <span className="product-category">
        {product.category}
      </span>

      <h3>{product.name}</h3>

      <div className="product-price">
        <strong>
          Rs. {product.price.toLocaleString("en-PK")}
        </strong>

        {product.oldPrice && (
          <del>
            Rs. {product.oldPrice.toLocaleString("en-PK")}
          </del>
        )}
      </div>
    </div>

  </article>
);

// HOME PAGE
const Home = () => {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section container">

        <div className="hero-content">

          <span className="hero-eyebrow">
            <Sparkles size={14} />
            THE ART OF EVERYDAY SHOPPING
          </span>

          <h1>
            Find What
            <br />
            Feels <span>Like You.</span>
          </h1>

          <p className="hero-description">
            A thoughtfully curated shopping experience.
            Discover beautiful finds, explore new favourites
            and make every purchase meaningful.
          </p>

          <div className="hero-actions">

            <Link to="/shop" className="hero-shop-btn">
              Explore Collection
              <ArrowUpRight size={18} />
            </Link>

            <Link to="/about" className="hero-story-btn">
              Discover Our Story
            </Link>

          </div>

          <div className="hero-bottom-note">
            <span className="note-line"></span>
            <p>CURATED WITH CARE · CREATED FOR YOU</p>
          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-image-wrapper">

            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
              alt="NovaCart curated collection"
            />

            <div className="hero-image-caption">
              <span>THE NOVA EDIT</span>
              <h3>Little things. Lovely finds.</h3>
            </div>

          </div>

          <div className="hero-floating-card">
            <Sparkles size={25} />

            <div>
              <strong>Curated collections</strong>
              <p>Something worth discovering</p>
            </div>
          </div>

          <div className="hero-number">01</div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="category-section section-spacing">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                EXPLORE OUR WORLD
              </span>

              <h2>
                Shop by <span>Category.</span>
              </h2>
            </div>

            <Link to="/shop" className="section-link">
              View All <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <Link
                to="/shop"
                className="category-card"
                key={category.name}
              >

                <img
                  src={`https://images.unsplash.com/${category.image}?auto=format&fit=crop&w=700&q=85`}
                  alt={category.name}
                  loading="lazy"
                />

                <div className="category-overlay">

                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.subtitle}</p>
                  </div>

                  <span>
                    <ArrowUpRight size={20} />
                  </span>

                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section className="featured-section section-spacing">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                HANDPICKED FOR YOU
              </span>

              <h2>
                Featured <span>Finds.</span>
              </h2>
            </div>

            <Link to="/shop" className="section-link">
              Shop All Products
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="product-grid">

            {products.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
              />
            ))}

          </div>

        </div>

      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="promo-section container">

        <div className="promo-content">

          <span className="section-eyebrow">
            A LITTLE SOMETHING SPECIAL
          </span>

          <h2>
            Make Room for
            <br />
            <span>Lovely Things.</span>
          </h2>

          <p>
            Explore thoughtfully selected pieces and discover
            something that feels just right for you.
          </p>

          <Link to="/shop" className="promo-btn">
            Discover More
            <ArrowUpRight size={18} />
          </Link>

        </div>

        <div className="promo-image">

          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85"
            alt="NovaCart shopping collection"
            loading="lazy"
          />

        </div>

      </section>

      {/* NEW ARRIVALS */}
      <section className="new-arrivals-section section-spacing">

        <div className="container">

          <div className="section-heading">

            <div>
              <span className="section-eyebrow">
                JUST LANDED
              </span>

              <h2>
                New <span>Arrivals.</span>
              </h2>
            </div>

            <Link to="/shop" className="section-link">
              Explore New Finds
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="product-grid">

            {newArrivals.map((product) => (
              <ProductCard
                product={product}
                key={product.id}
              />
            ))}

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="benefits-section section-spacing">

        <div className="container">

          <div className="benefits-heading">

            <span className="section-eyebrow">
              THE NOVACART PROMISE
            </span>

            <h2>
              Shopping Made <span>Thoughtful.</span>
            </h2>

          </div>

          <div className="benefits-grid">

            <div className="benefit-card">
              <Truck size={30} />
              <h3>Easy Delivery</h3>
              <p>
                Convenient delivery for your favourite finds.
              </p>
            </div>

            <div className="benefit-card">
              <ShieldCheck size={30} />
              <h3>Secure Shopping</h3>
              <p>
                Your account and shopping information matter.
              </p>
            </div>

            <div className="benefit-card">
              <RefreshCcw size={30} />
              <h3>Easy Returns</h3>
              <p>
                A simple and clear return experience.
              </p>
            </div>

            <div className="benefit-card">
              <Headset size={30} />
              <h3>Customer Support</h3>
              <p>
                We're here to help with your shopping queries.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section container">

        <div className="newsletter-content">

          <span className="section-eyebrow">
            STAY IN THE LOOP
          </span>

          <h2>
            A little note from <span>NovaCart.</span>
          </h2>

          <p>
            Discover new arrivals, collections and special updates.
          </p>

        </div>

        <form
          className="newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >

          <div className="newsletter-input">

            <Mail size={18} />

            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              required
            />

          </div>

          <button type="submit">
            Subscribe
            <ArrowUpRight size={17} />
          </button>

        </form>

      </section>

      {/* FOOTER */}
      <footer className="site-footer">

        <div className="container">

          <div className="footer-main">

            <div className="footer-brand">

              <Link to="/" className="footer-logo">
                NOVA<span>CART.</span>
              </Link>

              <p>
                Discover more. Shop better.
                A thoughtfully curated shopping experience.
              </p>

              <div className="footer-socials">

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>

              </div>

            </div>

            <div className="footer-links">

              <h3>Explore</h3>

              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/collections">Collections</Link>
              <Link to="/about">About Us</Link>

            </div>

            <div className="footer-links">

              <h3>Customer Care</h3>

              <Link to="/contact">Contact Us</Link>
              <Link to="/faq">FAQs</Link>
              <Link to="/shipping">Shipping Policy</Link>
              <Link to="/returns">Return Policy</Link>

            </div>

            <div className="footer-contact">

              <h3>Get in Touch</h3>

              <p>
                Have a question? We'd love to hear from you.
              </p>

              <a href="mailto:hello@novacart.com">
                hello@novacart.com
              </a>

            </div>

          </div>

          <div className="footer-bottom">

            <p>© 2026 NovaCart. All rights reserved.</p>
            <p>Designed with care.</p>

          </div>

        </div>

      </footer>

    </main>
  );
};

export default Home;
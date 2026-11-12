
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shirt,
  Laptop,
  Gem,
  House
} from "lucide-react";

const collections = [
  {
    id: 1,
    title: "Fashion",
    subtitle: "Style that speaks for you",
    description: "Explore clothing and everyday fashion essentials.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900",
    icon: Shirt,
    category: "Fashion"
  },
  {
    id: 2,
    title: "Electronics",
    subtitle: "Technology meets lifestyle",
    description: "Discover gadgets and smart everyday essentials.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900",
    icon: Laptop,
    category: "Electronics"
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Details make the difference",
    description: "Find the finishing touches for your personal style.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900",
    icon: Gem,
    category: "Accessories"
  },
  {
    id: 4,
    title: "Home & Living",
    subtitle: "Make your space feel special",
    description: "Thoughtful pieces to make your home more welcoming.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900",
    icon: House,
    category: "Home & Living"
  }
];

function Collections() {
  return (
    <main className="collections-page">

      <section className="collections-hero">
        <span>THE NOVACART EDIT</span>
        <h1>Explore Our Collections.</h1>
        <p>
          Discover thoughtfully selected collections
          designed to complement your everyday lifestyle.
        </p>
      </section>

      <section className="collections-content container">

        <div className="collections-intro">
          <div>
            <span>SHOP BY CATEGORY</span>
            <h2>Find Your Style</h2>
          </div>
          <p>Four collections. Endless possibilities.</p>
        </div>

        <div className="collections-grid">

          {collections.map((item) => {
            const Icon = item.icon;

            return (
              <article className="collection-card" key={item.id}>

                <Link
                  to={`/shop?category=${encodeURIComponent(item.category)}`}
                  className="collection-image"
                >
                  <img src={item.image} alt={item.title} />

                  <span className="collection-overlay"></span>

                  <div className="collection-icon">
                    <Icon size={22} />
                  </div>

                  <div className="collection-card-content">
                    <span>{item.subtitle}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <span className="collection-explore">
                      Explore Collection <ArrowRight size={17} />
                    </span>
                  </div>
                </Link>

              </article>
            );
          })}

        </div>

        <section className="collection-bottom-banner">
          <span>YOUR NEXT FAVOURITE IS WAITING</span>
          <h2>A little something for every lifestyle.</h2>
          <Link to="/shop">
            Explore All Products <ArrowRight size={18} />
          </Link>
        </section>

      </section>
    </main>
  );
}

export default Collections;

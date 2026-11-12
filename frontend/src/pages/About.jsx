
import { Link } from "react-router-dom";
import {
  Heart,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowRight,
  Sparkles
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Curated With Care",
    description:
      "We bring together thoughtfully selected products for your everyday lifestyle."
  },
  {
    icon: ShieldCheck,
    title: "Shopping You Can Trust",
    description:
      "We focus on a simple, secure and reliable shopping experience."
  },
  {
    icon: Truck,
    title: "Convenient Delivery",
    description:
      "Enjoy a convenient way to discover and shop your favourite products."
  },
  {
    icon: Headphones,
    title: "Customer Support",
    description:
      "We aim to make every step of your shopping journey easier."
  }
];

function About() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span>GET TO KNOW NOVACART</span>
          <h1>More Than Shopping.<br />A Lifestyle Experience.</h1>
          <p>
            Discover a thoughtfully curated shopping experience
            where style, quality and everyday convenience come together.
          </p>

          <Link to="/shop" className="about-primary-btn">
            Explore Our Store <ArrowRight size={18} />
          </Link>
        </div>

        <div className="about-hero-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
            alt="Modern retail shopping environment"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story container">
        <div className="about-story-image">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000"
            alt="Fashion and lifestyle collection"
          />
        </div>

        <div className="about-story-content">
          <span>OUR STORY</span>
          <h2>Created Around Your Everyday Needs.</h2>

          <p>
            NovaCart is an online shopping concept designed to
            bring different product categories together in one place.
            From fashion and accessories to electronics and home
            essentials, our goal is to make product discovery simple.
          </p>

          <p>
            We believe shopping should feel convenient, enjoyable
            and easy to explore.
          </p>

          <Link to="/collections" className="about-text-link">
            Explore Collections <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="container">
          <Sparkles size={30} />

          <span>OUR MISSION</span>

          <h2>
            Making Everyday Shopping
            <br />
            Simple, Thoughtful and Convenient.
          </h2>

          <p>
            Our aim is to create a welcoming online destination
            where customers can explore products and enjoy a
            straightforward shopping journey.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="about-benefits container">

        <div className="about-section-heading">
          <span>THE NOVACART DIFFERENCE</span>
          <h2>What Makes Us Different?</h2>
          <p>We focus on the details that make shopping easier.</p>
        </div>

        <div className="about-benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <article className="about-benefit-card" key={index}>
                <div className="about-benefit-icon">
                  <Icon size={25} />
                </div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            );
          })}
        </div>

      </section>

      {/* Call to Action */}
      <section className="about-cta container">
        <span>YOUR NEXT DISCOVERY STARTS HERE</span>
        <h2>Find Something You'll Love.</h2>

        <Link to="/shop">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </section>

    </main>
  );
}

export default About;


import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle, Search } from "lucide-react";

const faqData = [
  {
    category: "Orders & Shopping",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our shop, select your favourite product, add it to your cart and proceed to checkout. Complete the required details to place your order."
      },
      {
        question: "Can I change my order after placing it?",
        answer:
          "Order changes depend on the order status. Please contact our support team as soon as possible."
      },
      {
        question: "How can I track my order?",
        answer:
          "Once order tracking is connected to our backend, you will be able to track your order through your account."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        question: "Do you offer home delivery?",
        answer:
          "Yes, NovaCart is designed to provide convenient home delivery. Delivery availability and charges will be confirmed during checkout."
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery time depends on your location and product availability. Estimated delivery information will be provided when the delivery service is configured."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        question: "Which payment methods are available?",
        answer:
          "Cash on Delivery is included in the current demo checkout. Online payment methods can be integrated in a future update."
      },
      {
        question: "Is my payment information secure?",
        answer:
          "NovaCart is designed with customer security in mind. Secure payment processing must be configured before accepting real online payments."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    questions: [
      {
        question: "Can I return a product?",
        answer:
          "Return requests and eligibility will depend on the final store return policy, which will be published once configured."
      },
      {
        question: "How can I request a refund?",
        answer:
          "Please contact our support team with your order details. Refund processing will be subject to the store's final refund policy."
      }
    ]
  },
  {
    category: "Account & Wishlist",
    questions: [
      {
        question: "How can I create an account?",
        answer:
          "Click on Create Account in the navigation menu and complete the registration form."
      },
      {
        question: "Can I save products for later?",
        answer:
          "Yes! Click the heart icon on a product to add it to your wishlist."
      }
    ]
  }
];

function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openQuestion, setOpenQuestion] = useState(null);
  const [search, setSearch] = useState("");

  const categories = ["All", ...faqData.map(item => item.category)];

  const filteredFAQs = faqData
    .filter(group =>
      activeCategory === "All" || group.category === activeCategory
    )
    .map(group => ({
      ...group,
      questions: group.questions.filter(item =>
        `${item.question} ${item.answer}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }))
    .filter(group => group.questions.length > 0);

  const toggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <main className="faq-page">

      <section className="faq-hero">
        <span className="faq-eyebrow">WE ARE HERE TO HELP</span>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers to common questions about shopping,
          orders, payments and more.
        </p>

        <div className="faq-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="faq-content">

        <div className="faq-heading">
          <span>HELP CENTER</span>
          <h2>How can we help you?</h2>
          <p>Explore our frequently asked questions below.</p>
        </div>

        <div className="faq-categories">
          {categories.map(category => (
            <button
              key={category}
              className={
                activeCategory === category ? "active" : ""
              }
              onClick={() => {
                setActiveCategory(category);
                setOpenQuestion(null);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(group => (
              <div className="faq-group" key={group.category}>
                <h3>{group.category}</h3>

                {group.questions.map((item, index) => {
                  const id = `${group.category}-${index}`;
                  const isOpen = openQuestion === id;

                  return (
                    <div
                      className={`faq-item ${isOpen ? "open" : ""}`}
                      key={id}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleQuestion(id)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          size={20}
                          className="faq-chevron"
                        />
                      </button>

                      {isOpen && (
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className="faq-empty">
              <h3>No questions found</h3>
              <p>Try searching with another keyword.</p>
            </div>
          )}
        </div>

      </section>

      <section className="faq-contact">
        <div className="faq-contact-icon">
          <MessageCircle size={28} />
        </div>

        <h2>Still have questions?</h2>
        <p>
          Our support team is ready to help you with your queries.
        </p>

        <Link to="/contact" className="faq-contact-btn">
          Contact Us
        </Link>
      </section>

    </main>
  );
}

export default FAQ;

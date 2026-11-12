import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been received.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <span>GET IN TOUCH</span>
        <h1>We'd Love to Hear From You</h1>
        <p>
          Have a question or need assistance? Our team is here to help
          make your shopping experience better.
        </p>
      </section>

      <section className="contact-container">
        <div className="contact-info">
          <span>CONTACT INFORMATION</span>
          <h2>Let's Start a Conversation</h2>
          <p>
            Reach out to us for any questions, feedback or support.
          </p>

          <div className="contact-info-item">
            <Mail />
            <div>
              <h3>Email Us</h3>
              <p>support@novacart.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <Phone />
            <div>
              <h3>Call Us</h3>
              <p>+92 300 1234567</p>
            </div>
          </div>

          <div className="contact-info-item">
            <MapPin />
            <div>
              <h3>Our Location</h3>
              <p>Hyderabad, Pakistan</p>
            </div>
          </div>

          <div className="contact-info-item">
            <Clock />
            <div>
              <h3>Working Hours</h3>
              <p>Monday – Saturday, 9 AM – 6 PM</p>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send Us a Message</h2>
          <p>Fill out the form below and we'll get back to you.</p>

          <form onSubmit={handleSubmit}>
            <label>Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="What is your message about?"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <label>Your Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Send Message <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Contact;
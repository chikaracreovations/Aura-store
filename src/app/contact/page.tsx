"use client";

import { useState } from "react";
import styles from "./page.module.css";

const FAQS = [
  {
    question: "What is your standard shipping timeframe?",
    answer: "Standard shipping typically takes 3-5 business days for domestic orders. Premium express shipping options are available at checkout for guaranteed 1-2 day delivery."
  },
  {
    question: "Can I return or exchange my product?",
    answer: "Yes! We offer a 30-day hassle-free return policy on all items in new, unworn condition with original tags attached. Refunds are processed back to your original payment method within 5-7 business days."
  },
  {
    question: "Are your products covered by a warranty?",
    answer: "All premium physical goods carry a 1-year manufacturer warranty covering craftsmanship defects. If your item arrives defective, we will replace it free of charge immediately."
  },
  {
    question: "Do you ship internationally?",
    answer: "Absolutely! We ship to over 50 countries globally. International rates and delivery times vary by destination and are calculated dynamically during checkout."
  },
  {
    question: "How do I track my active order?",
    answer: "Once shipped, you will receive an email containing your tracking number and a link to the carrier portal. You can also view order status by checking your email confirmation or reaching out to support."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple UX demo response
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <span className={styles.badge}>Get in touch</span>
        <h1>We'd love to hear from you</h1>
        <p>Whether you have a question about features, pricing, need a demo, or anything else, our team is ready to answer all your questions.</p>
      </header>

      {/* Main Contact Area: Form and Panel */}
      <div className={styles.contactMain}>
        {/* Left Column: Modern Styled Form */}
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <h2>Send us a message</h2>
            <p style={{ opacity: 0.6, marginBottom: "2rem", fontSize: "0.95rem" }}>Fill out the form below and we'll get back to you within 24 hours.</p>
            
            {submitted && (
              <div className={styles.successMessage}>
                ✓ Message sent successfully! Our team will contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className={styles.input}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="First and last name" 
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    required 
                    className={styles.input}
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com" 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required 
                  className={styles.input}
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help you today?" 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  required 
                  rows={6} 
                  className={styles.input}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Include all relevant details..." 
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Unified Sidebar Details Panel */}
        <div className={styles.infoSidebar}>
          <div className={styles.sidebarInner}>
            <h2>Contact Information</h2>
            <p style={{ opacity: 0.8, marginBottom: "2.5rem" }}>Reach out via phone, email, or visit our central Manhattan headquarters.</p>
            
            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>✉️</div>
              <div>
                <h4>Email Support</h4>
                <p className={styles.infoVal}>support@aura.com</p>
                <p className={styles.infoDesc}>Direct assistance under 2 hours</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>📍</div>
              <div>
                <h4>Our Headquarters</h4>
                <p className={styles.infoVal}>121 Madison Avenue</p>
                <p className={styles.infoDesc}>New York, NY 10016, United States</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>📞</div>
              <div>
                <h4>Call Center</h4>
                <p className={styles.infoVal}>+1 (800) 123-4567</p>
                <p className={styles.infoDesc}>Mon to Fri — 9:00 AM to 6:00 PM EST</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>💼</div>
              <div>
                <h4>Business Operations</h4>
                <p className={styles.infoVal}>partners@aura.com</p>
                <p className={styles.infoDesc}>For retail and investment inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Full-width dedicated FAQs Section */}
      <section className={styles.faqContainerSection}>
        <div className={styles.faqHeader}>
          <span className={styles.badge}>FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Can't find what you're looking for? Take a look at our most commonly answered questions below.</p>
        </div>

        <div className={styles.faqAccordionWrapper}>
          <div className={styles.accordion}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ""}`}>
                  <button 
                    className={styles.accordionHeader} 
                    onClick={() => toggleFaq(idx)}
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <span className={`${styles.arrow} ${isOpen ? styles.arrowActive : ""}`}>
                      +
                    </span>
                  </button>
                  <div className={`${styles.accordionContent} ${isOpen ? styles.accordionContentOpen : ""}`}>
                    <div className={styles.accordionContentInner}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

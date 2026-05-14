"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.grid}>
          {/* A. Brand Metadata */}
          <div className={styles.brandCol}>
            <h2 className={styles.logo}>AURA<span>.</span></h2>
            <p className={styles.tagline}>
              Curating premium essentials for the modern discerning collector.
            </p>
            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem', lineHeight: '1.6' }}>
              <strong>Chikara Renovations</strong><br />
              Sector 58, Gurugram, Haryana, India<br />
              Email: chikara.ansh15@gmail.com
            </div>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}>📷</a>
              <a href="#" aria-label="Twitter" className={styles.socialIcon}>🐦</a>
            </div>
          </div>

          {/* B. Navigator Matrices */}
          <div>
            <h3 className={styles.colTitle}>Shop</h3>
            <ul className={styles.linkList}>
              <li><Link href="/products" className={styles.link}>All Products</Link></li>
              <li><Link href="/collections" className={styles.link}>Collections</Link></li>
              <li><Link href="/orders" className={styles.link}>Track Order</Link></li>
            </ul>
          </div>

          {/* C. Legal & Support */}
          <div>
            <h3 className={styles.colTitle}>Legal</h3>
            <ul className={styles.linkList}>
              <li><Link href="/terms" className={styles.link}>Terms & Conditions</Link></li>
              <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
              <li><Link href="/shipping" className={styles.link}>Shipping Policy</Link></li>
              <li><Link href="/refund" className={styles.link}>Refund & Cancellation</Link></li>
              <li><Link href="/contact" className={styles.link}>Contact Us</Link></li>
            </ul>
          </div>

          {/* D. Dispatch Grid (Newsletter) */}
          <div className={styles.newsCol}>
            <h3 className={styles.colTitle}>Newsletter</h3>
            <p className={styles.newsDesc}>
              Subscribe for exclusive drops and limited release alerts.
            </p>
            
            {subscribed ? (
              <div style={{ padding: "0.75rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", color: "#60a5fa", fontSize: "0.85rem", fontWeight: 600 }}>
                ✓ Subscription Active
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.form}>
                <input 
                  type="email" 
                  required 
                  className={styles.input} 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={styles.submitBtn}>JOIN</button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Horizontal Band */}
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Aura Store. All rights reserved.
          </div>
          
          <div className={styles.payments}>
            <span className={styles.payIcon} title="Razorpay Secure">💳 Secure Checkout via Razorpay</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

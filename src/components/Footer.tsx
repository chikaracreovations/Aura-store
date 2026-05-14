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
              Curating premium physical masterpieces and sophisticated tech consumables for modern discerning collectors across the globe.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}>📷</a>
              <a href="#" aria-label="Twitter" className={styles.socialIcon}>🐦</a>
              <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>💼</a>
            </div>
          </div>

          {/* B. Navigator Matrices */}
          <div>
            <h3 className={styles.colTitle}>Explore Portal</h3>
            <ul className={styles.linkList}>
              <li><Link href="/" className={styles.link}>Homepage Matrix</Link></li>
              <li><Link href="/products" className={styles.link}>Catalog Grid</Link></li>
              <li><Link href="/collections" className={styles.link}>Visual Collections</Link></li>
            </ul>
          </div>

          {/* C. Logistics & Assist */}
          <div>
            <h3 className={styles.colTitle}>Client Assistance</h3>
            <ul className={styles.linkList}>
              <li><Link href="/orders" className={styles.link}>Track Package</Link></li>
              <li><Link href="/contact" className={styles.link}>Concierge Desk</Link></li>
              <li><a href="#" className={styles.link}>Shipping Protocol</a></li>
              <li><a href="#" className={styles.link}>Refund Protocol</a></li>
            </ul>
          </div>

          {/* D. Dispatch Grid (Newsletter) */}
          <div className={styles.newsCol}>
            <h3 className={styles.colTitle}>Aura Transmission</h3>
            <p className={styles.newsDesc}>
              Subscribe to receive exclusive visual product drops, collection releases, and limited-run asset alerts.
            </p>
            
            {subscribed ? (
              <div style={{ padding: "0.75rem", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "8px", color: "#60a5fa", fontSize: "0.85rem", fontWeight: 600 }}>
                ✓ Transmission Activated. Welcome.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.form}>
                <input 
                  type="email" 
                  required 
                  className={styles.input} 
                  placeholder="yourname@domain.com"
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
            &copy; {new Date().getFullYear()} Aura Frontline Retail Node. All engineering assets protected.
          </div>
          
          <div className={styles.payments}>
            <span className={styles.payIcon} title="Visa Payment Active">💳</span>
            <span className={styles.payIcon} title="Mastercard Payment Active">🪙</span>
            <span className={styles.payIcon} title="Bank Wire Active">🏦</span>
            <span className={styles.payIcon} title="Cash on Delivery Standard">💵</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

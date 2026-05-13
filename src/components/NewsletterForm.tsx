"use client";

import React from "react";
import styles from "../app/page.module.css";

export default function NewsletterForm() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✨ Welcome to the inner circle! We will email you shortly!");
  };

  return (
    <form onSubmit={handleSubscribe} className={styles.newsForm}>
      <input 
        type="email" 
        required 
        placeholder="Enter your email address..." 
        className={styles.newsInput} 
      />
      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ padding: "1rem 2rem", whiteSpace: "nowrap", fontWeight: 700 }}
      >
        Subscribe
      </button>
    </form>
  );
}

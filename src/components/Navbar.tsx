"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { cartCount } = useCart();
  const { data: session } = useSession();
  
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>AURA.</Link>
      
      {/* Core Middle Layout Links */}
      <div className={styles.navLinks}>
        <Link href="/products" className={styles.navLinkItem}>Shop</Link>
        <Link href="/collections" className={styles.navLinkItem}>Collections</Link>
        <Link href="/about" className={styles.navLinkItem}>About</Link>
        <Link href="/orders" className={styles.navLinkItem}>Orders</Link>
        <Link href="/contact" className={styles.navLinkItem}>Contact</Link>
      </div>
      
      {/* Right Layout Panel Widgets */}
      <div className={styles.navLinks}>
        <Link href="/cart" className={styles.navLinkItem} style={{ position: 'relative', marginRight: '0.5rem' }}>
          🛒 Cart ({cartCount})
        </Link>
        
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', opacity: 0.75, fontWeight: 600 }}>Hi, {session.user?.name?.split(' ')[0]}</span>
            <button 
              onClick={() => signOut()} 
              className="btn btn-primary" 
              style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: '8px' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            href="/login" 
            className="btn btn-primary" 
            style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: '8px' }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}


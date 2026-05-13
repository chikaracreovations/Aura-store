"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import styles from "./page.module.css";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  // Standard Calculations
  const taxEstimate = cartTotal * 0.05; // GST 5% for visual clarity
  const grandTotal = cartTotal; 

  if (cart.length === 0) {
    return (
      <main style={{ background: "var(--background)", minHeight: "80vh" }}>
        <div className={styles.cartContainer}>
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>🛒</div>
            <h2>Your cart is empty</h2>
            <p style={{ marginTop: "0.5rem", marginBottom: "2.5rem", opacity: 0.6, fontSize: "0.95rem" }}>
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/products" className={styles.checkoutBtn} style={{ maxWidth: "250px", margin: "0 auto" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--background)", minHeight: "85vh" }}>
      <div className={styles.cartContainer}>
        
        <span className={styles.badge}>Secure Checkout</span>
        <h1 className={styles.cartTitle}>Shopping Cart</h1>

        <div className={styles.cartContent}>
          
          {/* 🎁 Left Col: Cart Items Stack */}
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <article key={item.id} className={styles.cartItem}>
                
                {/* 🖼️ Image Wrapper & Linked Frame */}
                <Link href={`/products/${item.id}`} className={styles.itemImageWrapper} style={{ width: '90px', height: '115px', flexShrink: 0, display: 'block', overflow: 'hidden', borderRadius: '16px' }}>
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className={styles.itemImage} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", fontWeight: 700 }}>
                      No Image
                    </div>
                  )}
                </Link>

                {/* 🏷️ Name and Info Details */}
                <div className={styles.itemInfo}>
                  <Link href={`/products/${item.id}`} className={styles.itemName}>
                    {item.name}
                  </Link>
                  <div className={styles.itemStockStatus}>
                    <span className={styles.stockDot}></span> In Stock
                  </div>
                  <div className={styles.itemUnitPrice}>
                    ₹{item.price.toLocaleString("en-IN")} each
                  </div>
                </div>

                {/* 🎛️ Pricing and Interactive Modifiers Row */}
                <div className={styles.itemRightSection}>
                  <div className={styles.quantityControlsGroup}>
                    
                    {/* Glassmorphic Capsule Controller */}
                    <div className={styles.quantitySelectorCapsule}>
                      <button
                        className={styles.qtyModifierBtn}
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        —
                      </button>
                      <span className={styles.qtyDisplay}>{item.quantity}</span>
                      <button
                        className={styles.qtyModifierBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        ＋
                      </button>
                    </div>

                    {/* Premium Remove Button */}
                    <button
                      className={styles.modernRemoveBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Line Price */}
                  <div className={styles.itemTotalCost}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>

              </article>
            ))}
          </div>

          {/* 💎 Right Col: Order Summary Widget */}
          <aside className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>GST (5%)</span>
              <span>₹{taxEstimate.toLocaleString("en-IN")}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span style={{ color: "#10b981", fontWeight: 800, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                Free
              </span>
            </div>

            {/* Total Row */}
            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalVal}>₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
            
            <button 
              className={styles.checkoutBtn} 
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>

            {/* 🔒 Trust Badges */}
            <div className={styles.safeBadgeTag}>
              <svg className={styles.safeLockIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              100% Secure Payment
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}

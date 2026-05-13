"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<{ name: string; visible: boolean }>({
    name: "",
    visible: false,
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Save to local storage when cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });

    // Trigger Global Elegant Toast Notification
    setNotification({ name: item.name, visible: true });
    
    // Auto-dismiss after 3.2 seconds
    const timer = setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3200);

    return () => clearTimeout(timer);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}

      {/* Global Modern Toast Portal */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 999999,
          transform: notification.visible ? "translateY(0)" : "translateY(150%)",
          opacity: notification.visible ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: notification.visible ? "auto" : "none",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          padding: "1rem 1.5rem",
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          maxWidth: "380px",
        }}
      >
        {/* Animated Pulse Check Indicator */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#10b981",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            fontWeight: "bold",
            flexShrink: 0,
          }}
        >
          ✓
        </div>
        
        {/* Text Message Content */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.1rem" }}>
            Added to Bag
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "250px" }}>
            {notification.name}
          </div>
        </div>

        {/* Close Shortcut */}
        <button
          onClick={() => setNotification((prev) => ({ ...prev, visible: false }))}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            opacity: 0.5,
            cursor: "pointer",
            fontSize: "1rem",
            padding: "0.25rem",
            marginLeft: "0.5rem"
          }}
        >
          ✕
        </button>
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

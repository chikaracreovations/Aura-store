"use client";

import { useCart } from "../../../context/CartContext";
import { useRouter } from "next/navigation";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
  disabled: boolean;
};

export default function AddToCartButton({ product, disabled }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      imageUrl: product.imageUrl || undefined, 
      quantity: 1 
    });
  };

  const handleBuyNow = () => {
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      imageUrl: product.imageUrl || undefined, 
      quantity: 1 
    });
    router.push("/cart");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <button 
        className="btn" 
        onClick={handleAdd}
        disabled={disabled}
        style={{ 
          width: "100%", 
          padding: "1rem", 
          fontSize: "1.05rem", 
          fontWeight: "600",
          borderRadius: "12px", 
          background: disabled ? "var(--border)" : "transparent", 
          color: disabled ? "var(--muted)" : "var(--foreground)", 
          border: disabled ? "none" : "2px solid var(--foreground)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem"
        }}
      >
        {disabled ? "Out of Stock" : "🛒 Add to Cart"}
      </button>
      <button 
        className="btn" 
        onClick={handleBuyNow}
        disabled={disabled}
        style={{ 
          width: "100%", 
          padding: "1rem", 
          fontSize: "1.05rem", 
          fontWeight: "700",
          borderRadius: "12px", 
          background: disabled ? "var(--border)" : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", 
          color: "white", 
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: disabled ? "none" : "0 4px 14px 0 rgba(124, 58, 237, 0.4)",
          transition: "all 0.2s ease"
        }}
      >
        {disabled ? "Currently Unavailable" : "⚡ Buy Now"}
      </button>
    </div>
  );
}

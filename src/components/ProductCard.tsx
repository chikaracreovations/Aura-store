"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import styles from "../app/page.module.css";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
    formattedPrice: string;
    imageUrl?: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the product page when clicking add to cart
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || undefined,
    });
  };

  return (
    <Link href={`/products/${product.id}`} className={styles.productCard} style={{ textDecoration: 'none', color: 'inherit' }}>
      {product.imageUrl ? (
        <div style={{ width: '100%', height: '250px', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      ) : (
        <div className={styles.productImagePlaceholder} style={{ width: '100%', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card)' }}>
          <span style={{ opacity: 0.5 }}>No Image</span>
        </div>
      )}
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{product.category}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productBottom} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span className={styles.productPrice} style={{ fontWeight: 600, fontSize: '1.2rem' }}>{product.formattedPrice}</span>
          <button 
            className="btn btn-primary"
            onClick={handleAddToCart}
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
}

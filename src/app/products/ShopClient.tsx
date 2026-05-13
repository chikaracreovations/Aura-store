"use client";

import { useState, useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import styles from "./Shop.module.css";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  imageUrl: string | null;
  createdAt?: string | Date;
};

type Props = {
  initialProducts: Product[];
};

const CATEGORIES = ["All", "Apparel", "Footwear", "Tech", "Accessories", "Uncategorized"];

export default function ShopClient({ initialProducts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // ✨ Ultra-Efficient Client-Side Filter/Sort Pipeline
  const processedProducts = useMemo(() => {
    let results = [...initialProducts];

    // 1. Apply Search Query Filter
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      results = results.filter((p) => 
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
      );
    }

    // 2. Apply Category Filter
    if (selectedCategory !== "All") {
      results = results.filter((p) => {
        const cat = p.category || "Uncategorized";
        return cat.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // 3. Apply Sorting logic
    results.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      // Default: newest (descending createdAt if available, or stable reverse)
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    return results;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
  };

  return (
    <div style={{ minHeight: "60vh", paddingBottom: "5rem" }}>
      {/* 🎨 Premium Control Hub: Filters, Search, and Sort */}
      <div className={styles.controlsSection}>
        
        {/* 🏷️ Category Chip Selector */}
        <div className={styles.filterContainer}>
          {CATEGORIES.map((cat) => {
            // Check if this category has any products to prevent ghost selections
            const hasProducts = cat === "All" || initialProducts.some(p => (p.category || "Uncategorized").toLowerCase() === cat.toLowerCase());
            if (!hasProducts && cat !== "All") return null; // Only show categories that exist in the catalog!

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.filterChip} ${selectedCategory === cat ? styles.activeChip : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 🔍 Search Input + Dynamic Sorter */}
        <div className={styles.searchSortBar}>
          <div className={styles.searchWrapper}>
            <svg 
              className={styles.searchIcon} 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Discover garments, silhouettes, accessories..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className={styles.clearButton} onClick={() => setSearchQuery("")} title="Clear search">
                ✕
              </button>
            )}
          </div>

          <select 
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest Releases</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 📊 Results Summary */}
      {(searchQuery || selectedCategory !== "All") && (
        <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "2rem", opacity: 0.8, textAlign: "left", letterSpacing: "0.02em" }}>
          Found {processedProducts.length} exquisite artifact{processedProducts.length !== 1 ? "s" : ""} matching selection
        </div>
      )}

      {/* 📦 Grid Presentation Area */}
      {processedProducts.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>🔎</div>
          <h3 className={styles.emptyTitle}>Silhouette Not Found</h3>
          <p className={styles.emptyText}>
            We could not locate any garments fitting those specific dimensions. Try adjusting your filters or reset to reveal the full range.
          </p>
          <button className={styles.resetButton} onClick={handleResetFilters}>
            Reset Canvas Filters
          </button>
        </div>
      ) : (
        <div className={styles.shopGrid}>
          {processedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                name: product.name,
                category: product.category || "Uncategorized",
                price: product.price,
                formattedPrice: `₹${product.price.toLocaleString("en-IN")}`, // Elegant Indian localization!
                imageUrl: product.imageUrl
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

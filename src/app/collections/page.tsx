import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { prisma } from "../../lib/prisma";
import styles from "./Collections.module.css";

export const metadata = {
  title: "Curated Collections | AURA.",
  description: "Explore our designer edits structured by utility and silhouette classifications."
};

export default async function CollectionsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Group products by category
  const collections = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <main style={{ background: "var(--background)", minHeight: "80vh" }}>
      <div className="container">
        
        {/* ✨ Premium Cinematic Collections Header */}
        <header className={styles.collectionsHeader}>
          <span className={styles.badge}>Curated Edits</span>
          <h1 className={styles.pageTitle}>The Core Categories</h1>
          <p className={styles.pageSubtitle}>
            Explore our catalog stratified by functional utility, designed to help you build cohesive, modular, and structural ecosystems.
          </p>
        </header>

        {/* 📦 Layered Groupings Loop */}
        {Object.keys(collections).length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>No collections loaded</h3>
            <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>Visit the Operator Console to generate your initial catalog.</p>
          </div>
        ) : (
          Object.entries(collections).map(([category, items]) => (
            <section key={category} className={styles.collectionSection}>
              
              {/* 🏷️ Group Title Header Row */}
              <div className={styles.collectionHeaderRow}>
                <div>
                  <h2 className={styles.categoryTitle}>
                    {category}
                  </h2>
                  <span className={styles.categoryCount}>
                    {items.length} Artifact{items.length !== 1 ? "s" : ""} Released
                  </span>
                </div>

                <Link href={`/products?category=${category}`} className={styles.viewAllLink}>
                  Explore Collection ➔
                </Link>
              </div>

              {/* 🎨 The Boutique Grid Container */}
              <div className={styles.collectionGrid}>
                {items.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      category: product.category || "Uncategorized",
                      price: product.price,
                      formattedPrice: `₹${product.price.toLocaleString("en-IN")}`, // High-End Localization
                      imageUrl: product.imageUrl
                    }} 
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}

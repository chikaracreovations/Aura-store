import { prisma } from "../../lib/prisma";
import ShopClient from "./ShopClient";
import styles from "./Shop.module.css";

export const metadata = {
  title: "The Catalog | AURA.",
  description: "Explore our carefully curated collection of luxury garments and modern silhouettes."
};

export default async function ShopPage() {
  // Retrieve all products sorted newest first
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Transform serialized dates if any for next hydration safely
  const serializedProducts = products.map(product => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  }));

  return (
    <main style={{ background: "var(--background)" }}>
      <div className="container">
        {/* ✨ Header Artistry Section */}
        <header className={styles.shopHeader}>
          <span className={styles.badge}>Ready to Wear</span>
          <div className={styles.titleWrapper}>
            <h1 className={styles.shopTitle}>The Aura Collection</h1>
          </div>
          <p className={styles.shopSubtitle}>
            Discover an impeccably curated assembly of high-density premium fabrics, 
            tailored architectural silhouettes, and modular essentials designed for modern endurance.
          </p>
        </header>

        {/* 🎁 Product Client Engine & Filters */}
        {serializedProducts.length === 0 ? (
          <div className={styles.emptyContainer} style={{ marginTop: "2rem", marginBottom: "6rem" }}>
            <div className={styles.emptyIcon}>📦</div>
            <h3 className={styles.emptyTitle}>Inventory Empty</h3>
            <p className={styles.emptyText}>
              Our master curators are currently gathering the next collection. Please check back shortly or visit the Operator Console to add initial silhouettes.
            </p>
          </div>
        ) : (
          <ShopClient initialProducts={serializedProducts} />
        )}
      </div>
    </main>
  );
}

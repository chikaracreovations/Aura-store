import Link from "next/link";
import styles from "./page.module.css";
import ProductCard from "../components/ProductCard";
import NewsletterForm from "../components/NewsletterForm";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 8, // Clean up to max 8 for aesthetic balance
  });

  return (
    <main style={{ overflowX: "hidden" }}>
      
      {/* 1. Animated High-End Hero Section */}
      <section className={styles.hero}>
        {/* Ambient dynamic blurs */}
        <div className={styles.heroGlow1}></div>
        <div className={styles.heroGlow2}></div>
        
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>New Modern Standard</span>
          <h1 className={styles.heroTitle}>
            The Art of <br />Refined Living
          </h1>
          <p className={styles.heroSubtitle}>
            Discover an impeccably curated collection of premium essentials designed to flow effortlessly into your dynamic modern life.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn btn-accent" style={{ padding: "1rem 2.5rem", fontWeight: 700 }}>
              Explore Catalog
            </Link>
            <Link href="/collections" className="btn btn-primary" style={{ padding: "1rem 2.2rem", fontWeight: 700 }}>
              Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. High-Fidelity Trust Ribbon */}
      <div className={styles.trustBanner}>
        <div className={styles.trustGrid}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>📦</span>
            <div>
              <h4 className={styles.trustTitle}>Express Indian Delivery</h4>
              <p className={styles.trustDesc}>Premium insured shipping direct to your doorstep across all states.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🛡️</span>
            <div>
              <h4 className={styles.trustTitle}>Lifetime Quality Bond</h4>
              <p className={styles.trustDesc}>Handpicked authentic raw materials guaranteeing multi-year utility.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <div>
              <h4 className={styles.trustTitle}>256-bit Secure Trade</h4>
              <p className={styles.trustDesc}>Bank-grade SSL architectures protecting your payments instantly.</p>
            </div>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>💬</span>
            <div>
              <h4 className={styles.trustTitle}>Elite 24/7 Support</h4>
              <p className={styles.trustDesc}>Dedicated product experts standing by via WhatsApp or active chat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Shop by Visual Categories */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Curated Lines</span>
          <h2 className={styles.sectionTitle}>Explore Our Universes</h2>
        </div>
        
        <div className={styles.categoryGrid}>
          {/* Category A */}
          <Link href="/collections" className={styles.categoryCard}>
            <img 
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80" 
              alt="Apparel Collection" 
              className={styles.categoryImg} 
            />
            <div className={styles.categoryOverlay}>
              <h3 className={styles.categoryName}>Premium Apparel</h3>
              <span className={styles.categoryLink}>Shop Apparel →</span>
            </div>
          </Link>

          {/* Category B */}
          <Link href="/collections" className={styles.categoryCard}>
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80" 
              alt="Tech Essentials" 
              className={styles.categoryImg} 
            />
            <div className={styles.categoryOverlay}>
              <h3 className={styles.categoryName}>Modern Tech</h3>
              <span className={styles.categoryLink}>Shop Gadgets →</span>
            </div>
          </Link>

          {/* Category C */}
          <Link href="/collections" className={styles.categoryCard}>
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" 
              alt="Footwear Gear" 
              className={styles.categoryImg} 
            />
            <div className={styles.categoryOverlay}>
              <h3 className={styles.categoryName}>Urban Footwear</h3>
              <span className={styles.categoryLink}>Shop Footwear →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Split Editorial Narrative Panel */}
      <section className={styles.editorialBanner}>
        <div className={styles.editorialLayout}>
          <div className={styles.editorialImgWrapper}>
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80" 
              alt="Premium Craftsmanship Studio" 
              className={styles.editorialImg}
            />
          </div>
          <div className={styles.editorialContent}>
            <span className={styles.sectionTag} style={{ margin: 0 }}>Our Craft</span>
            <h2 className={styles.editorialTitle}>Conceived in Detail, Built to Endure</h2>
            <p className={styles.editorialText}>
              We believe true luxury is not about excess, but about editing. We spend months perfecting the smallest details of every line—sourcing organic fibers, certifying premium alloys, and stress-testing each prototype so you only get the finest output.
            </p>
            <Link href="/contact" className="btn btn-primary" style={{ padding: "0.9rem 2rem", fontWeight: 600 }}>
              Learn Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Featured Products Dynamic Grid */}
      <section className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Recent Releases</span>
          <h2 className={styles.sectionTitle}>Featured Masterpieces</h2>
        </div>
        
        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "24px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>No products listed yet</h3>
            <p style={{ opacity: 0.7 }}>Our collection is currently undergoing curation. Check back shortly.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  id: product.id,
                  name: product.name,
                  category: product.category || "Uncategorized",
                  price: product.price,
                  formattedPrice: `₹${product.price.toFixed(2)}`,
                  imageUrl: product.imageUrl
                }} 
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Elegant CTA & Newsletter Module */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterCard}>
          <h2 className={styles.newsTitle}>Join The Circle</h2>
          <p className={styles.newsDesc}>
            Unlock VIP access to limited inventory drops, members-only flash releases, and insightful editorial design logs.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </main>
  );
}


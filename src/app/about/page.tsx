import Link from "next/link";
import styles from "./About.module.css";

export const metadata = {
  title: "The Ethos | AURA.",
  description: "Our design philosophy, master fabrication standards, and sustainability manifests."
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--background)" }}>
      <div className="container">
        <div className={styles.aboutContainer}>
          
          {/* 🌟 Part 1: Hero Split Editorial Narrative */}
          <section className={styles.heroSection}>
            <div>
              <span className={styles.badge}>Our Philosophy</span>
              <h1 className={styles.heroTitle}>Engineered for Elevation.</h1>
              <p className={styles.heroText}>
                At AURA, we believe everyday carry items, apparel, and domestic assets shouldn't just be owned—they should be experienced. 
              </p>
              <p className={styles.heroText} style={{ opacity: 0.65, fontSize: "1.05rem" }}>
                Born out of a persistent demand for material integrity, our studio strips away the superfluous to cultivate silhouettes that endure. We harmonize high-density technical textiles, modular utilities, and structural grace into a single architectural uniform designed for the modern vanguard.
              </p>
            </div>
            
            <div className={styles.heroImageContainer}>
              <img 
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800" 
                alt="Premium high-density fabric craftsmanship detail" 
                className={styles.heroImage}
              />
            </div>
          </section>

          {/* 🎯 Part 2: The 3 Core Strategic Pillars */}
          <section className={styles.pillarsSection}>
            <h2 className={styles.pillarsTitle}>Foundational Ideologies</h2>
            
            <div className={styles.gridPillars}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>🧶</div>
                <h3 className={styles.pillarName}>Material Rigor</h3>
                <p className={styles.pillarDesc}>
                  We source certified Grade-A cashmere, long-staple organic cottons, and weatherproof composites from world-class heritage mills. No compromises, no filler.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>📐</div>
                <h3 className={styles.pillarName}>Architectural Fit</h3>
                <p className={styles.pillarDesc}>
                  Our patterns are plotted with extreme precision, resulting in a structural, relaxed drape that contours perfectly while offering complete freedom of kinetic movement.
                </p>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIcon}>🌱</div>
                <h3 className={styles.pillarName}>Modular Longevity</h3>
                <p className={styles.pillarDesc}>
                  True sustainability means building artifacts that defy the seasonal cycle. Every AURA release is stress-tested to retain its pristine, structured form through infinite life cycles.
                </p>
              </div>
            </div>
          </section>

          {/* 🚀 Part 3: Cinematic Final Call to Action */}
          <section className={styles.ctaBanner}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Enter The Aura Universe</h2>
              <p className={styles.ctaText}>
                Step into the next era of physical existence. Experience clothing and essential artifacts optimized for modern high-frequency environments.
              </p>
              <Link href="/products" className={styles.ctaButton}>
                Begin Exploration
              </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

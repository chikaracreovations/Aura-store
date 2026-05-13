import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import ProductGallery from "./ProductGallery";
import ReviewForm from "./ReviewForm";
import AddToCartButton from "./AddToCartButton";
import ProductCard from "../../../components/ProductCard";
import styles from "./page.module.css";
import globalStyles from "../../page.module.css";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id }
    },
    take: 4 // Max 4 related products
  });

  const featuresList = product.features 
    ? product.features.split('\n').filter(f => f.trim().length > 0)
    : [];

  const totalReviews = product.reviews.length;
  const avgRating = totalReviews > 0 
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "No ratings yet";

  // Calculate rating breakdown
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  product.reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating as keyof typeof ratingCounts]++;
    }
  });

  return (
    <main className={styles.productPage}>
      <div className={styles.topSection}>
        {/* Left Column: Image Gallery */}
        <div className={styles.leftColumn}>
          <ProductGallery images={product.images} fallbackUrl={product.imageUrl} />
        </div>

        {/* Right Column: Product Details & Buy Box */}
        <div className={styles.rightColumn}>
          <span className={styles.productCategory}>{product.category}</span>
          <h1 className={styles.productTitle}>{product.name}</h1>
          
          <div className={styles.ratingOverview}>
            <span className={styles.ratingStars}>★ {avgRating}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ opacity: 0.7, fontSize: "0.95rem" }}>{totalReviews} customer reviews</span>
          </div>

          <div className={styles.buyBox}>
            <div className={styles.price}>₹{product.price.toLocaleString("en-IN")}</div>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <div className={`${styles.stockStatus} ${product.stock > 0 ? styles.inStock : styles.outOfStock}`} style={{ marginBottom: 0 }}>
                {product.stock > 0 ? `In Stock (${product.stock} items)` : "Out of Stock"}
              </div>
            </div>

            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              }} 
              disabled={product.stock === 0}
            />
          </div>

          <div className={styles.aboutSection}>
            <h3>About this item</h3>
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}
            
            {featuresList.length > 0 && (
              <ul className={styles.featuresList}>
                {featuresList.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "4rem", marginBottom: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--border)" }}>
          <h2 style={{ marginBottom: "2rem", fontSize: "1.8rem" }}>You Might Also Like</h2>
          <div className={globalStyles.grid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
            {relatedProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={{
                  id: p.id,
                  name: p.name,
                  category: p.category || "Uncategorized",
                  price: p.price,
                  formattedPrice: `₹${p.price.toLocaleString("en-IN")}`,
                  imageUrl: p.imageUrl
                }} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section: Reviews */}
      <div className={styles.reviewsSection}>
        <h2>Customer Reviews</h2>
        
        <div className={styles.reviewsGrid}>
          <div className={styles.reviewsSidebar}>
            {/* Rating Breakdown Card */}
            <div className={styles.ratingBreakdown}>
              <div className={styles.ratingSummaryHeader}>
                <div className={styles.bigRating}>{avgRating}</div>
                <div className={styles.ratingSubInfo}>
                  <div className={styles.ratingStars} style={{ fontSize: "1.25rem" }}>
                    {"★".repeat(Math.round(Number(avgRating) || 0))}{"☆".repeat(5 - Math.round(Number(avgRating) || 0))}
                  </div>
                  <div style={{ opacity: 0.6, fontSize: "0.9rem" }}>out of 5 stars</div>
                  <div style={{ opacity: 0.8, fontSize: "0.9rem", fontWeight: "600", marginTop: "0.25rem" }}>{totalReviews} ratings</div>
                </div>
              </div>

              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star as keyof typeof ratingCounts];
                  const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                  
                  return (
                    <div key={star} className={styles.breakdownRow}>
                      <span className={styles.breakdownLabel}>{star} star</span>
                      <div className={styles.breakdownBarContainer}>
                        <div className={styles.breakdownBarFill} style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className={styles.breakdownPercentage}>{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {session ? (
              <ReviewForm productId={product.id} />
            ) : (
              <div style={{ padding: "2rem", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                <h4 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>Review this product</h4>
                <p style={{ marginBottom: "1.5rem", opacity: 0.7, fontSize: "0.9rem" }}>Share your thoughts with other customers</p>
                <a href="/login" className="btn btn-primary" style={{ display: "inline-block", width: "100%", padding: "0.75rem" }}>Sign in to write a review</a>
              </div>
            )}
          </div>

          <div className={styles.reviewsList}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
              Top reviews from the community
            </h3>
            {product.reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 0", opacity: 0.6 }}>
                <span style={{ fontSize: "3rem" }}>💬</span>
                <p style={{ marginTop: "1rem" }}>No reviews yet. Be the first to write a review!</p>
              </div>
            ) : (
              product.reviews.map(review => {
                const initial = review.user.name ? review.user.name.charAt(0).toUpperCase() : "A";
                return (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div className={styles.avatar}>
                          {initial}
                        </div>
                        <div>
                          <div className={styles.reviewerName}>{review.user.name || "Anonymous User"}</div>
                          <div className={styles.reviewMeta}>
                            <span className={styles.verifiedBadge}>Verified Buyer</span>
                            <span style={{ margin: "0 0.5rem", opacity: 0.3 }}>•</span>
                            <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "1rem 0 0.5rem 0" }}>
                      <div style={{ color: "#fbbf24", fontSize: "0.95rem", letterSpacing: "1px" }}>
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                      <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>
                        {review.rating >= 4 ? "Highly recommended" : review.rating === 3 ? "Average quality" : "Disappointing"}
                      </span>
                    </div>

                    {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                    
                    {review.imageUrl && (
                      <div className={styles.reviewImageContainer}>
                        <img src={review.imageUrl} alt="Customer uploaded image" className={styles.reviewImage} />
                      </div>
                    )}

                    <div className={styles.reviewFooter}>
                      <button className={styles.helpfulBtn}>
                        <span>👍</span> Helpful
                      </button>
                      <span style={{ opacity: 0.5, fontSize: "0.85rem" }}>|</span>
                      <button className={styles.reportBtn}>Report</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

import styles from "../admin/page.module.css";

export default function RefundPage() {
  return (
    <div className={styles.adminContainer} style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 className={styles.title}>Refund & Cancellation</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Effective Date: May 14, 2026</p>

      <div style={{ lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>1. Cancellation Policy</h2>
          <p>Orders can only be cancelled within 24 hours of placement. Once an order has been processed or shipped, cancellation is not possible.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>2. Return Policy</h2>
          <p>We offer a 7-day return policy for unused and unwashed items in their original packaging with all tags intact. Items that are damaged or show signs of wear will not be accepted.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>3. Refund Process</h2>
          <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within **5-7 business days**.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>4. Non-Refundable Items</h2>
          <p>Certain types of goods are exempt from being returned, such as intimate apparel, masks, or personalized items.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>5. Contact for Support</h2>
          <p>For any refund-related queries, please email us at chikara.ansh15@gmail.com with your Order ID.</p>
        </section>
      </div>
    </div>
  );
}

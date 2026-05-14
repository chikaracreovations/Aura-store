import styles from "../admin/page.module.css";

export default function ShippingPage() {
  return (
    <div className={styles.adminContainer} style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 className={styles.title}>Shipping Policy</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Effective Date: May 14, 2026</p>

      <div style={{ lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>1. Shipping Locations</h2>
          <p>We ship to all states within India. International shipping is currently unavailable.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>2. Shipping Timelines</h2>
          <p>Most orders are processed and shipped within 1-2 business days. Delivery usually takes **3-5 business days** depending on your location.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>3. Shipping Costs</h2>
          <p>Shipping costs are calculated at checkout based on weight and destination. We offer free shipping on orders above ₹4,999.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>4. Tracking</h2>
          <p>Once your order has shipped, you will receive an email with a tracking number and a link to track your package live.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>5. Undelivered Items</h2>
          <p>If an item is undelivered due to an incorrect address provided by the customer, reshipping charges will be applicable.</p>
        </section>
      </div>
    </div>
  );
}

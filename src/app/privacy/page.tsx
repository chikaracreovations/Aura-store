import styles from "../admin/page.module.css";

export default function PrivacyPage() {
  return (
    <div className={styles.adminContainer} style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Last Updated: May 14, 2026</p>

      <div style={{ lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, and shipping address.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>2. How We Use Your Information</h2>
          <p>We use the information we collect to process your orders, communicate with you about your account and purchases, and improve our services. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>3. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>4. Cookies</h2>
          <p>We use cookies to help us remember and process the items in your shopping cart and understand and save your preferences for future visits.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us at chikara.ansh15@gmail.com.</p>
        </section>
      </div>
    </div>
  );
}

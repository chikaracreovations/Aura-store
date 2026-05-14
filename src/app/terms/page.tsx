import styles from "../admin/page.module.css";

export default function TermsPage() {
  return (
    <div className={styles.adminContainer} style={{ maxWidth: "800px", margin: "4rem auto", padding: "2rem" }}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Last Updated: May 14, 2026</p>

      <div style={{ lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>1. Acceptance of Terms</h2>
          <p>By accessing and using Aura Store (chikaracreovations/Aura-store), you agree to be bound by these Terms and Conditions and all applicable laws and regulations in India.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on Aura's website for personal, non-commercial transitory viewing only.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>3. Disclaimer</h2>
          <p>The materials on Aura's website are provided on an 'as is' basis. Aura makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>4. Limitations</h2>
          <p>In no event shall Aura or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Aura's website.</p>
        </section>

        <section>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </section>
      </div>
    </div>
  );
}

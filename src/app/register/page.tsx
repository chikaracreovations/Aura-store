"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../admin/page.module.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data?.message || `Failed to register (Status ${res.status})`);
      }
    } catch (e: any) {
      setError(e?.message || "An error occurred connecting to the server");
    }
  };

  return (
    <div className={styles.adminContainer} style={{ maxWidth: "400px" }}>
      <h1 className={styles.title} style={{ textAlign: "center" }}>Create Account</h1>
      
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius)",
          background: "var(--secondary)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          fontWeight: 500,
          fontSize: "0.95rem",
          cursor: "pointer",
          transition: "var(--transition)",
          marginBottom: "1.25rem",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Sign up with Google
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "1.25rem 0",
          color: "#71717a",
          fontSize: "0.8rem",
          letterSpacing: "0.05em",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ padding: "0 0.75rem", textTransform: "uppercase" }}>or register with email</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            required
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            required
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            required
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
          Register
        </button>
      </form>

      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <Link href="/login" style={{ color: "var(--accent)" }}>Log in</Link>
      </p>
    </div>
  );
}

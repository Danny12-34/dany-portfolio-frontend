import React, { useState, useEffect } from "react";
import { db } from "../analytics/firebaseConfig"; 
import { doc, onSnapshot } from "firebase/firestore";

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [livePulse, setLivePulse] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "analytics", "global_metrics");
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMetrics(docSnap.data());
        // Trigger a visual pulse effect when data updates
        setLivePulse(false);
        setTimeout(() => setLivePulse(true), 300);
      } else {
        console.warn("No analytics document found in Firestore.");
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to Firestore updates: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={{ marginTop: "16px", color: "#64748b", fontWeight: "500" }}>Connecting to live data stream...</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h3 style={{ color: "#0f172a", marginBottom: "8px" }}>Analytics System Uninitialized</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Please ensure the document path <code style={styles.code}>analytics/global_metrics</code> is correctly provisioned in your Firestore instance.
          </p>
        </div>
      </div>
    );
  }

  const total = metrics.totalVisitors || 1;

  return (
    <div style={styles.container}>
      {/* Top Professional Navbar/Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>System Analytics</h1>
          <p style={styles.subtitle}>
            Real-time platform metrics for{" "}
            <a href="https://dannyportfolio.gkminvest.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              dannyportfolio.gkminvest.com
            </a>
          </p>
        </div>
        
        {/* Real-time Heartbeat Badge */}
        <div style={styles.badge}>
          <span style={{ ...styles.pulseDot, opacity: livePulse ? 1 : 0.4 }}></span>
          <span style={styles.badgeText}>Live Feed Active</span>
        </div>
      </header>

      {/* Main Stats Overview Grid */}
      <section style={styles.heroSection}>
        <div style={styles.heroCard}>
          <div style={styles.heroMeta}>
            <p style={styles.heroLabel}>Total Accumulated Traffic</p>
            <svg style={styles.heroIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 style={styles.heroNumber}>{total.toLocaleString()}</h2>
          <p style={styles.heroSubtext}>Unique sessions recorded across all endpoints</p>
        </div>
      </section>

      {/* Breakdown Metrics Grid */}
      <div style={styles.grid}>
        {/* Device Segmentation Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>📱 Device Segmentation</h3>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.deviceRow}>
              <div style={styles.deviceInfo}>
                <span style={styles.deviceLabel}>Desktop</span>
                <span style={styles.deviceCount}>{metrics.devices?.desktop || 0}</span>
              </div>
              <div style={styles.progressBg}>
                <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.desktop || 0) / total) * 100)}%` }}></div>
              </div>
            </div>

            <div style={styles.deviceRow}>
              <div style={styles.deviceInfo}>
                <span style={styles.deviceLabel}>Mobile</span>
                <span style={styles.deviceCount}>{metrics.devices?.mobile || 0}</span>
              </div>
              <div style={styles.progressBg}>
                <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.mobile || 0) / total) * 100)}%` }}></div>
              </div>
            </div>

            <div style={styles.deviceRow}>
              <div style={styles.deviceInfo}>
                <span style={styles.deviceLabel}>Tablet</span>
                <span style={styles.deviceCount}>{metrics.devices?.tablet || 0}</span>
              </div>
              <div style={styles.progressBg}>
                <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.tablet || 0) / total) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Console Redirection Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>🌐 Deep Demographics & Behavior</h3>
          </div>
          <div style={styles.cardBodyContainer}>
            <p style={styles.cardDescription}>
              Advanced user path mapping, regional geolocation indexes, real-time conversion rates, and session durations are securely routed through your enterprise GA4 instance.
            </p>
            <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" style={styles.button}>
              Launch Google Analytics Console
              <svg style={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🏢 Modern Premium CSS-in-JS Architecture Style Specifications
const styles = {
  container: {
    maxWidth: "1140px",
    margin: "0 auto",
    padding: "40px 24px",
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "Inter, system-ui, sans-serif"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #4f46e5",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
    flexWrap: "wrap",
    gap: "16px"
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.02em",
    margin: "0 0 6px 0"
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    margin: 0
  },
  link: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "500",
    borderBottom: "1px solid transparent",
    transition: "border-color 0.2s ease"
  },
  badge: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "8px 14px",
    borderRadius: "9999px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
    marginRight: "8px",
    display: "inline-block",
    boxShadow: "0 0 8px #10b981",
    transition: "opacity 0.2s ease"
  },
  badgeText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#334155"
  },
  heroSection: {
    marginBottom: "24px"
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)"
  },
  heroMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  heroLabel: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0
  },
  heroIcon: {
    width: "20px",
    height: "20px",
    color: "#94a3b8"
  },
  heroNumber: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.03em"
  },
  heroSubtext: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    margin: "8px 0 0 0"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "24px"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
    overflow: "hidden"
  },
  cardHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9"
  },
  cardTitle: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0
  },
  cardBody: {
    padding: "24px"
  },
  cardBodyContainer: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "calc(100% - 72px)",
    boxSizing: "border-box"
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: "1.6",
    margin: "0 0 24px 0"
  },
  deviceRow: {
    marginBottom: "20px",
  },
  deviceInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "0.9rem"
  },
  deviceLabel: {
    color: "#475569",
    fontWeight: "500"
  },
  deviceCount: {
    color: "#0f172a",
    fontWeight: "600"
  },
  progressBg: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: "9999px",
    height: "8px"
  },
  progressFill: {
    backgroundColor: "#4f46e5",
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.5s ease-out"
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    textDecoration: "none",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "background-color 0.15s ease",
    gap: "8px",
    border: "none",
    cursor: "pointer"
  },
  btnIcon: {
    width: "16px",
    height: "16px"
  },
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "24px"
  },
  errorCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "32px",
    borderRadius: "16px",
    maxWidth: "500px",
    textAlign: "center"
  },
  code: {
    backgroundColor: "#f1f5f9",
    color: "#e11d48",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.9em"
  }
};
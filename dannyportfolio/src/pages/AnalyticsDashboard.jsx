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
        <p style={{ marginTop: "16px", color: "#94a3b8", fontWeight: "500", fontSize: "0.95rem" }}>
          Establishing secure stream...
        </p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h3 style={{ color: "#0f172a", marginBottom: "12px", fontWeight: "600" }}>Analytics Stream Offline</h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
            Ensure the document path <code style={styles.code}>analytics/global_metrics</code> is initialized in your Firestore panel.
          </p>
        </div>
      </div>
    );
  }

  const total = metrics.totalVisitors || 1;

  return (
    <div style={styles.pageWrapper}>
      {/* Premium Dark Top Section */}
      <div style={styles.topHeroSection}>
        <div style={styles.internalContainer}>
          <header style={styles.header}>
            <div>
              <h1 style={styles.title}>System Analytics</h1>
              <p style={styles.subtitle}>
                Real-time performance tracking for{" "}
                <a href="https://dannyportfolio.gkminvest.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
                  dannyportfolio.gkminvest.com
                </a>
              </p>
            </div>
            
            <div style={styles.badge}>
              <span style={{ ...styles.pulseDot, opacity: livePulse ? 1 : 0.3 }}></span>
              <span style={styles.badgeText}>Live Sync Active</span>
            </div>
          </header>

          {/* Overlapping Main Counter Row */}
          <div style={styles.heroCard}>
            <div style={styles.heroMeta}>
              <span style={styles.heroLabel}>Total Unique Visitors</span>
              <div style={styles.iconCircle}>
                <svg style={styles.heroIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <h2 style={styles.heroNumber}>{total.toLocaleString()}</h2>
            <div style={styles.heroFooter}>
              <span style={styles.trendIndicator}>⚡ Live updates</span>
              <span style={styles.heroSubtext}>Sessions recorded from client components</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div style={styles.bottomWorkspace}>
        <div style={styles.internalContainer}>
          <div style={styles.grid}>
            
            {/* Segmentation Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Device Segmentation</h3>
                <p style={styles.cardMeta}>Platform traffic distribution layout</p>
              </div>
              <div style={styles.cardBody}>
                {/* Desktop Row */}
                <div style={styles.deviceRow}>
                  <div style={styles.deviceInfo}>
                    <span style={styles.deviceLabel}>💻 Desktop Platform</span>
                    <span style={styles.deviceCount}>
                      {metrics.devices?.desktop || 0}{" "}
                      <span style={styles.pctText}>({Math.round(((metrics.devices?.desktop || 0) / total) * 100)}%)</span>
                    </span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.desktop || 0) / total) * 100)}%` }}></div>
                  </div>
                </div>

                {/* Mobile Row */}
                <div style={styles.deviceRow}>
                  <div style={styles.deviceInfo}>
                    <span style={styles.deviceLabel}>📱 Mobile Devices</span>
                    <span style={styles.deviceCount}>
                      {metrics.devices?.mobile || 0}{" "}
                      <span style={styles.pctText}>({Math.round(((metrics.devices?.mobile || 0) / total) * 100)}%)</span>
                    </span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.mobile || 0) / total) * 100)}%` }}></div>
                  </div>
                </div>

                {/* Tablet Row */}
                <div style={styles.deviceRow}>
                  <div style={styles.deviceInfo}>
                    <span style={styles.deviceLabel}>📟 Tablet Endpoints</span>
                    <span style={styles.deviceCount}>
                      {metrics.devices?.tablet || 0}{" "}
                      <span style={styles.pctText}>({Math.round(((metrics.devices?.tablet || 0) / total) * 100)}%)</span>
                    </span>
                  </div>
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${Math.round(((metrics.devices?.tablet || 0) / total) * 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Demographics Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Demographics & Behaviors</h3>
                <p style={styles.cardMeta}>Advanced server telemetry metrics</p>
              </div>
              <div style={styles.cardBodyFlex}>
                <p style={styles.cardDescription}>
                  Granular country routing charts, user acquisition mediums, dynamic retention grids, and bounce logs are aggregated securely inside your central Google Analytics architecture.
                </p>
                <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" style={styles.button}>
                  Launch Analytics Console
                  <svg style={styles.btnIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// 🏢 High-Fidelity UI Styling Specification 
const styles = {
  pageWrapper: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  topHeroSection: {
    backgroundColor: "#0f172a",
    padding: "60px 0 120px 0",
    color: "#ffffff",
  },
  bottomWorkspace: {
    marginTop: "-80px",
    paddingBottom: "60px",
  },
  internalContainer: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#0f172a",
    fontFamily: "'Inter', system-ui, sans-serif"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #1e293b",
    borderTop: "3px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px"
  },
  title: {
    fontSize: "2rem",
    fontWeight: "800",
    letterSpacing: "-0.025em",
    margin: "0 0 8px 0",
    color: "#ffffff"
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#94a3b8",
    margin: 0
  },
  link: {
    color: "#38bdf8",
    textDecoration: "none",
    fontWeight: "500",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "8px 16px",
    borderRadius: "9999px",
    backdropFilter: "blur(4px)"
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#34d399",
    borderRadius: "50%",
    marginRight: "10px",
    display: "inline-block",
    boxShadow: "0 0 12px #34d399",
    transition: "opacity 0.2s ease"
  },
  badgeText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#cbd5e1",
    letterSpacing: "0.02em"
  },
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
    color: "#0f172a"
  },
  heroMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px"
  },
  heroLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  iconCircle: {
    backgroundColor: "#f0fdf4",
    padding: "10px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  heroIcon: {
    width: "22px",
    height: "22px",
    color: "#16a34a"
  },
  heroNumber: {
    fontSize: "4rem",
    fontWeight: "800",
    margin: "0 0 12px 0",
    letterSpacing: "-0.04em",
    color: "#0f172a",
    lineHeight: 1
  },
  heroFooter: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px"
  },
  trendIndicator: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#16a34a",
    backgroundColor: "#dcfce7",
    padding: "2px 8px",
    borderRadius: "4px"
  },
  heroSubtext: {
    fontSize: "0.85rem",
    color: "#94a3b8"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "28px"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  cardHeader: {
    padding: "24px 28px 0 28px",
  },
  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 4px 0"
  },
  cardMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#94a3b8"
  },
  cardBody: {
    padding: "28px",
    flexGrow: 1
  },
  cardBodyFlex: {
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1
  },
  cardDescription: {
    fontSize: "0.95rem",
    color: "#64748b",
    lineHeight: "1.6",
    margin: "0 0 32px 0"
  },
  deviceRow: {
    marginBottom: "24px",
  },
  deviceInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "0.9rem"
  },
  deviceLabel: {
    color: "#334155",
    fontWeight: "600"
  },
  deviceCount: {
    color: "#0f172a",
    fontWeight: "700"
  },
  pctText: {
    color: "#64748b",
    fontWeight: "400",
    fontSize: "0.85rem"
  },
  progressBg: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: "9999px",
    height: "10px"
  },
  progressFill: {
    backgroundColor: "#3b82f6",
    height: "100%",
    borderRadius: "9999px",
    transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    textDecoration: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "all 0.15s ease",
    gap: "10px",
    border: "none",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box"
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
    backgroundColor: "#f8fafc"
  },
  errorCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "460px",
    textAlign: "center",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)"
  },
  code: {
    backgroundColor: "#f1f5f9",
    color: "#ef4444",
    padding: "3px 6px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "0.9em"
  }
};
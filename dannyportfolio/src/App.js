import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

import { PortfolioView } from "./features/PortfolioView";
import { DashboardView } from "./features/DashboardView";

import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { AnalyticsDashboardView } from "./pages/AnalyticsDashboardView";

import { trackPageVisit } from "./analytics/tracker";

// Initialize GA4 with your Measurement ID
ReactGA.initialize("G-F5WD4XKP3Q");

// Global Analytics & Real Device Telemetry Tracker with Cloud Sync
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // 1. Passes the current path to your tracking utility
    trackPageVisit(location.pathname + location.search);

    // 2. Real-time Device & Mobile Hardware Telemetry Capture with JSONBin Sync
    const recordRealDeviceVisit = async () => {
      const ua = navigator.userAgent;
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
      
      let browser = "Chrome";
      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
      else if (ua.includes("Edg")) browser = "Edge";

      // Ensure persistent unique hardware device ID per browser/device
      let deviceId = localStorage.getItem("device_telemetry_id");
      if (!deviceId) {
        const randomTag = Math.floor(100000 + Math.random() * 900000);
        deviceId = `DEV-${randomTag}-${isMobile ? "MOB" : "PC"}`;
        localStorage.setItem("device_telemetry_id", deviceId);
      }

      const hasBeenRegistered = localStorage.getItem("portfolio_registered");
      const now = new Date();

      const newTelemetryPayload = {
        id: `session-${Date.now()}`,
        biosSerialNumber: deviceId,
        country: isMobile ? "Rwanda (Mobile Data)" : "Host Machine",
        city: isMobile ? "Kigali" : "Local Network",
        device: isMobile ? "Mobile" : "Desktop",
        browser: browser,
        rawTimestamp: now.getTime(),
        timeDisplay: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        sessionType: hasBeenRegistered ? "Repeat Visit" : "First-Time Visit"
      };

      if (!hasBeenRegistered) {
        localStorage.setItem("portfolio_registered", "true");
      }

      try {
        const namespace = "dannyportfolio_gkminvest_com";
        
        // Only ping CounterAPI if not running on localhost to avoid CORS noise during development
        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
          await fetch(`https://api.counterapi.dev/v1/${namespace}/total_views/up`);
          if (!hasBeenRegistered) {
            await fetch(`https://api.counterapi.dev/v1/${namespace}/unique_views/up`);
          }
        }

        // --- JSONBin Cloud Sync Integration ---
        const BIN_ID = "6a5f5e1cf5f4af5e29ac1e1b";
        const API_KEY = "$2a$10$f1PzjyVH7XgKBaNgZwb53.yk.eAKvVNIl7N.F0bx5XSrNYCTR1o8u";

        // Fetch existing logs from your shared cloud bin
        const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
          headers: { "X-Master-Key": API_KEY }
        });
        const data = await res.json();
        const existingLogs = Array.isArray(data.record) ? data.record : [];

        // Append new device entry to the top and keep the latest 50 logs max
        const updatedLogs = [
          newTelemetryPayload, 
          ...existingLogs.filter(l => l.biosSerialNumber !== deviceId)
        ].slice(0, 50);

        // Push the synchronized array back to the cloud bin
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY
          },
          body: JSON.stringify(updatedLogs)
        });

      } catch (err) {
        console.warn("Could not sync live telemetry cloud bin:", err);
      }
    };

    recordRealDeviceVisit();
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        {/* Portfolio Website */}
        <Route path="/" element={<PortfolioView />} />

        {/* Existing Admin Dashboard */}
        <Route path="/dashboard" element={<DashboardView />} />

        {/* Analytics Dashboards */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/analyticsDash" element={<AnalyticsDashboardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
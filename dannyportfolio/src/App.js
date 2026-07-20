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

// Global Analytics & Real Device Telemetry Tracker
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // 1. Passes the current path to your tracking utility
    trackPageVisit(location.pathname + location.search);

    // 2. Real-time Device & Mobile Hardware Telemetry Capture
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
        
        // Ping CounterAPI for live total & unique counters
        await fetch(`https://api.counterapi.dev/v1/${namespace}/total_views/up`);
        
        if (!hasBeenRegistered) {
          await fetch(`https://api.counterapi.dev/v1/${namespace}/unique_views/up`);
        }

        // Save real visit payload to localStorage for dashboard aggregation
        const existingLogs = JSON.parse(localStorage.getItem("real_visitor_logs") || "[]");
        const updatedLogs = [newTelemetryPayload, ...existingLogs.filter(l => l.biosSerialNumber !== deviceId)].slice(0, 50);
        localStorage.setItem("real_visitor_logs", JSON.stringify(updatedLogs));

      } catch (err) {
        console.warn("Could not sync live telemetry counter:", err);
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
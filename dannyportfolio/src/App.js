import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactGA from "react-ga4"; // 1. Import ReactGA

import { PortfolioView } from "./features/PortfolioView";
import { DashboardView } from "./features/DashboardView";

import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { trackPageVisit } from "./analytics/tracker";

// 2. Initialize GA4 with your Measurement ID
ReactGA.initialize("G-F5WD4XKP3Q");

// Tracks every page visit
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // Passes the current path to your tracking utility
    trackPageVisit(location.pathname + location.search);
  }, [location.pathname, location.search]); // Listens to both path and query changes

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

        {/* Analytics Dashboard */}
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
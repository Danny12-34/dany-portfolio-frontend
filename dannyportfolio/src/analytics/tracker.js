// src/analytics/tracker.js
import ReactGA from "react-ga4";

// Optional helper to check device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return "Mobile";
  return "Desktop";
};

export const trackPageVisit = async (path = window.location.pathname) => {
  // 1. Send to Google Analytics (working!)
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });

  // 2. Increment counts in your database
  try {
    const payload = {
      path,
      device: getDeviceType(),
      timestamp: new Date().toISOString(),
      // In production, your backend or serverless functions can parse 
      // the request IP to find the country.
    };
    
    // Example: Replace with your Supabase / Firebase / Custom API call
    // await db.collection("visits").add(payload);
    console.log("Logged DB visit event:", payload);
  } catch (err) {
    console.error("Failed to update database tracker", err);
  }
};
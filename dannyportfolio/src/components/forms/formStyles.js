// src/components/forms/formStyles.js

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  maxWidth: "500px",
  margin: "2rem auto",
  padding: "2.5rem",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05), 0 5px 10px rgba(0, 0, 0, 0.02)",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  boxSizing: "border-box",
};

// Optional: Add global layout helpers if your inline fields ever need a clean layout
export const formRowGroupStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
};
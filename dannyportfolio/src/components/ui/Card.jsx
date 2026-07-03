import React from "react";

export const Card = ({ title, subtitle, badge, children, onDelete }) => (
  <div style={{ padding: "16px", border: "1px solid #eaeaea", borderRadius: "8px", margin: "10px 0", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", color: "#222" }}>{title}</h3>
        {subtitle && <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {badge && <span style={{ background: "#f0f0f0", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>{badge}</span>}
        {onDelete && <button onClick={onDelete} style={{ background: "#ff4d4f", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>}
      </div>
    </div>
    <div style={{ marginTop: "12px" }}>{children}</div>
  </div>
);
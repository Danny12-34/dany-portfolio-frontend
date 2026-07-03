import React, { useState } from "react";
import { PortfolioView } from "./features/PortfolioView";
import { DashboardView } from "./features/DashboardView";

function App() {
  const [view, setView] = useState("portfolio");

  return (
    <div>
      <nav style={{ background: "#111", padding: "15px", display: "flex", gap: "20px", justifyContent: "center" }}>
        <button onClick={() => setView("portfolio")} style={{ background: "transparent", color: view === "portfolio" ? "#1a73e8" : "#fff", border: "none", font: "inherit", cursor: "pointer", fontWeight: "bold" }}>Portfolio App</button>
        <button onClick={() => setView("dashboard")} style={{ background: "transparent", color: view === "dashboard" ? "#1a73e8" : "#fff", border: "none", font: "inherit", cursor: "pointer", fontWeight: "bold" }}>Admin Engine Dashboard</button>
      </nav>
      {view === "portfolio" ? <PortfolioView /> : <DashboardView />}
    </div>
  );
}

export default App;
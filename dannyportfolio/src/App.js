import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioView } from "./features/PortfolioView";
import { DashboardView } from "./features/DashboardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shows the portfolio view when visiting http://localhost:5173/ */}
        <Route path="/" element={<PortfolioView />} />
        
        {/* Shows the administrative dashboard when visiting http://localhost:5173/dashboard */}
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
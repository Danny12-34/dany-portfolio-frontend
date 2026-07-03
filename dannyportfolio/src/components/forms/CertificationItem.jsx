import React from "react";

export const CertificationItem = ({ cert }) => {
  
  const handleViewDocument = () => {
    // If it's a standard web link, open it directly
    if (cert.certificate_url && typeof cert.certificate_url === "string" && cert.certificate_url.startsWith("http")) {
      window.open(cert.certificate_url, "_blank", "noopener,noreferrer");
    } 
    // If a file was uploaded, point the new tab directly to the backend view route
    else if (cert._id || cert.id) {
      const id = cert._id || cert.id;
      window.open(`http://localhost:5000/api/certifications/${id}/view`, "_blank");
    } else {
      alert("No document or verification link available.");
    }
  };

  return (
    <div className="certification-card">
      <h3>{cert.title}</h3>
      <p><strong>Issued by:</strong> {cert.organization}</p>
      
      <button type="button" onClick={handleViewDocument} className="view-doc-btn">
        View Document
      </button>
    </div>
  );
};
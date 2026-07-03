import React, { useState } from "react";
import "./CertificationForm.css"; // 1. Import your new external CSS file here

export const CertificationForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    organization: initialData.organization || "",
    certificate_url: initialData.certificate_url || "", 
    files: [] 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const plainPayload = {
      title: form.title,
      organization: form.organization,
      certificate_url: form.files.length > 0 ? form.files : (form.certificate_url || null)
    };
    onSubmit(plainPayload);
  };

  return (
    /* 2. Changed style={formStyle} to className="certification-form" */
    <form onSubmit={handleSubmit} className="certification-form">
      <input 
        type="text" 
        placeholder="Certification Title (e.g., AWS Developer)" 
        value={form.title} 
        onChange={e => setForm({...form, title: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Issuing Organization (e.g., Amazon)" 
        value={form.organization} 
        onChange={e => setForm({...form, organization: e.target.value})} 
        required 
      />
      
      <input 
        type="url" 
        placeholder="Credential Verification Web Link (Optional)" 
        value={form.certificate_url} 
        onChange={e => setForm({...form, certificate_url: e.target.value})} 
        disabled={form.files.length > 0} 
      />

      {/* 3. Changed inline styles to a clean className */}
      <div className="form-divider">
        Or upload certificate file (PDF or Image):
      </div>

      <input 
        type="file" 
        multiple 
        accept="application/pdf, image/*" 
        onChange={e => setForm({...form, files: Array.from(e.target.files)})} 
      />

      <button type="submit">Save Certification</button>
    </form>
  );
};
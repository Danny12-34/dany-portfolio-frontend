import React, { useState } from "react";
import "./ExperienceForm.css"; // Import your shared external CSS file here

export const ExperienceForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    position: initialData.position || "", 
    organization: initialData.organization || "",
    period: initialData.period || "", 
    description: initialData.description || ""
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
      className="experience-form"
    >
      <input 
        type="text" 
        placeholder="Job Position (e.g., Senior Full Stack Developer)" 
        value={form.position} 
        onChange={e => setForm({...form, position: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Organization / Company Name" 
        value={form.organization} 
        onChange={e => setForm({...form, organization: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Period (e.g., 2024 - Present, Jan 2022 - Dec 2023)" 
        value={form.period} 
        onChange={e => setForm({...form, period: e.target.value})} 
        required 
      />
      
      <textarea 
        placeholder="Job Description & Key Responsibilities..." 
        value={form.description} 
        onChange={e => setForm({...form, description: e.target.value})} 
        required 
      />
      
      <button type="submit">Save Experience</button>
    </form>
  );
};
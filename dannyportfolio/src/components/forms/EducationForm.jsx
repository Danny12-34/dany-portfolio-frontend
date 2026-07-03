import React, { useState } from "react";
import "./EducationForm.css"; // Import your external CSS file here

export const EducationForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    institution: initialData.institution || "", 
    qualification: initialData.qualification || "",
    start_year: initialData.start_year || "", 
    end_year: initialData.end_year || ""
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
      className="education-form"
    >
      <input 
        type="text" 
        placeholder="Institution Name" 
        value={form.institution} 
        onChange={e => setForm({...form, institution: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Qualification (e.g., Bachelor of Software Engineering)" 
        value={form.qualification} 
        onChange={e => setForm({...form, qualification: e.target.value})} 
        required 
      />
      
      {/* Container row to align years side-by-side cleanly */}
      <div className="form-row-group">
        <input 
          type="number" 
          placeholder="Start Year" 
          value={form.start_year} 
          onChange={e => setForm({...form, start_year: e.target.value})} 
          required 
        />
        
        <input 
          type="number" 
          placeholder="End Year (or Expected)" 
          value={form.end_year} 
          onChange={e => setForm({...form, end_year: e.target.value})} 
        />
      </div>
      
      <button type="submit">Save Education</button>
    </form>
  );
};
import React, { useState } from "react";
import "./SkillForm.css"; // Import your external CSS file here

export const SkillForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({ 
    category: initialData.category || "", 
    skill_name: initialData.skill_name || "" 
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
      className="skill-form"
    >
      <input 
        type="text" 
        placeholder="Category (e.g., Frontend, Backend, DevOps)" 
        value={form.category} 
        onChange={e => setForm({...form, category: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Skill Name (e.g., React, PostgreSQL, Flutter)" 
        value={form.skill_name} 
        onChange={e => setForm({...form, skill_name: e.target.value})} 
        required 
      />
      
      <button type="submit">Save Skill</button>
    </form>
  );
};
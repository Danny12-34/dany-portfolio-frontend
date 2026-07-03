import React, { useState } from "react";
import "./LanguageForm.css"; // Import your shared external CSS file here

export const LanguageForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({ 
    language: initialData.language || "", 
    proficiency: initialData.proficiency || "" 
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
      className="language-form"
    >
      <input 
        type="text" 
        placeholder="Language (e.g., English, English, French)" 
        value={form.language} 
        onChange={e => setForm({...form, language: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Proficiency (e.g., Native, Full Professional, Working Knowledge)" 
        value={form.proficiency} 
        onChange={e => setForm({...form, proficiency: e.target.value})} 
        required 
      />
      
      <button type="submit">Save Language</button>
    </form>
  );
};
import React, { useState } from "react";
import "./ReferenceForm.css"; // Import your shared external CSS file here

export const ReferenceForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({ 
    names: initialData.names || "", 
    position: initialData.position || "", 
    phone: initialData.phone || "" 
  });

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} 
      className="reference-form"
    >
      <input 
        type="text" 
        placeholder="Reference Full Name(s)" 
        value={form.names} 
        onChange={e => setForm({...form, names: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Position / Company (e.g., Head Teacher, Senior Engineer)" 
        value={form.position} 
        onChange={e => setForm({...form, position: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Phone Contact (e.g., +250 788 000 000)" 
        value={form.phone} 
        onChange={e => setForm({...form, phone: e.target.value})} 
        required 
      />
      
      <button type="submit">Save Reference</button>
    </form>
  );
};
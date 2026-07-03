import React, { useState } from "react";
import "./projectForm.css"; // Import your shared external CSS file here

export const ProjectForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    title: initialData.title || "",
    technologies: initialData.technologies || "",
    description: initialData.description || "",
    github_url: initialData.github_url || "",
    live_url: initialData.live_url || "",
    files: [] 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const plainPayload = {
      title: form.title,
      technologies: form.technologies,
      description: form.description,
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      files: form.files 
    };
    onSubmit(plainPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <input 
        type="text" 
        placeholder="Project Title" 
        value={form.title} 
        onChange={e => setForm({...form, title: e.target.value})} 
        required 
      />
      
      <input 
        type="text" 
        placeholder="Technologies (e.g., React, Node.js, PostgreSQL)" 
        value={form.technologies} 
        onChange={e => setForm({...form, technologies: e.target.value})} 
      />
      
      <textarea 
        placeholder="Project Description..." 
        value={form.description} 
        onChange={e => setForm({...form, description: e.target.value})} 
        required 
      />
      
      {/* Container row to dynamically pair up development links */}
      <div className="form-link-group">
        <input 
          type="url" 
          placeholder="GitHub Link" 
          value={form.github_url} 
          onChange={e => setForm({...form, github_url: e.target.value})} 
        />
        <input 
          type="url" 
          placeholder="Live Demo Link" 
          value={form.live_url} 
          onChange={e => setForm({...form, live_url: e.target.value})} 
        />
      </div>
      
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={e => setForm({...form, files: Array.from(e.target.files)})} 
      />
      
      <button type="submit">Save Project</button>
    </form>
  );
};
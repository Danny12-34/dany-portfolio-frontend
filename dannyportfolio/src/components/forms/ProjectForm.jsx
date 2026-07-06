import React, { useState } from "react";
import "./projectForm.css"; // Import your shared external CSS file here

export const ProjectForm = ({ onSubmit, initialData = {} }) => {
  // If initialData.technologies is an array from the backend, join it back into a string for the input field.
  const initialTechs = Array.isArray(initialData.technologies)
    ? initialData.technologies.join(", ")
    : initialData.technologies || "";

  const [form, setForm] = useState({
    title: initialData.title || "",
    technologies: initialTechs,
    description: initialData.description || "",
    github_url: initialData.github_url || "",
    live_url: initialData.live_url || "",
    files: [] 
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Convert the comma-separated string into an array of strings
    // 2. Trim whitespace from each technology so you don't get empty spaces like " React"
    const techArray = form.technologies
      ? form.technologies.split(",").map(tech => tech.trim()).filter(tech => tech !== "")
      : [];

    const plainPayload = {
      title: form.title,
      technologies: techArray, // Now safely passed as an Array to prevent mapping errors
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
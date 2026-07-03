import React, { useState } from "react";
import "./ProfileForm.css";

import {
  FaUser,
  FaBriefcase,
  FaHeading,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaCamera,
  FaSave,
} from "react-icons/fa";

export const ProfileForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    name: initialData.name || "",
    title: initialData.title || "",
    headline: initialData.headline || "",
    bio: initialData.bio || "",
    objective: initialData.objective || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    location: initialData.location || "",
    github: initialData.github || "",
    linkedin: initialData.linkedin || "",
    image: null, 
  });

  const [preview, setPreview] = useState(
    initialData.profileImage || null
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      
      <h2 className="form-title">Portfolio Profile</h2>

      {/* Styled upload section with small circular avatar layout */}
      <div className="image-upload">
        <div className="image-preview">
          {preview ? (
            <img src={preview} alt="Profile Preview" />
          ) : (
            <FaUser size={45} />
          )}
        </div>

        <label className="upload-btn">
          <FaCamera />
          Choose Profile Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Safely hides default ugly input element
          />
        </label>
      </div>

      <div className="input-group">
        <FaUser className="icon" />
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaBriefcase className="icon" />
        <input
          type="text"
          name="title"
          placeholder="Professional Title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="input-group">
        <FaHeading className="icon" />
        <input
          type="text"
          name="headline"
          placeholder="Headline"
          value={form.headline}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaEnvelope className="icon" />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaPhone className="icon" />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaGithub className="icon" />
        <input
          type="url"
          name="github"
          placeholder="GitHub URL"
          value={form.github}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <FaLinkedin className="icon" />
        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn URL"
          value={form.linkedin}
          onChange={handleChange}
        />
      </div>

      <div className="textarea-group">
        <textarea
          name="bio"
          placeholder="Professional Bio"
          rows="5"
          value={form.bio}
          onChange={handleChange}
        />
      </div>

      <div className="textarea-group">
        <textarea
          name="objective"
          placeholder="Career Objective"
          rows="5"
          value={form.objective}
          onChange={handleChange}
        />
      </div>

      <button className="save-btn" type="submit">
        <FaSave />
        Save Portfolio Profile
      </button>

    </form>
  );
};
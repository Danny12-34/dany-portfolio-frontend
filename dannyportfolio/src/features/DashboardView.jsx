import React, { useEffect, useState } from "react";
import * as API from "../api/services";
import { ProfileForm } from "../components/forms/ProfileForm";
import { ProjectForm } from "../components/forms/ProjectForm";
import { SkillForm } from "../components/forms/SkillForm";
import { EducationForm } from "../components/forms/EducationForm";
import { ExperienceForm } from "../components/forms/ExperienceForm";
import { CertificationForm } from "../components/forms/CertificationForm";
import { LanguageForm } from "../components/forms/LanguageForm";
import { ReferenceForm } from "../components/forms/ReferenceForm";
import { OtherDocumentForm } from "../components/forms/OtherDocumentForm";
import { Link } from "react-router-dom";

import { 
  FaUser, 
  FaBriefcase, 
  FaHeading, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedin, 
  FaFileAlt 
} from "react-icons/fa";

import "./DashboardView.css"; 

export const DashboardView = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);

  const getService = () => {
    const serviceMap = {
      profile: API.ProfileService,
      skills: API.SkillsService,
      education: API.EducationService,
      experience: API.ExperienceService,
      projects: API.ProjectsService,
      certifications: API.CertificationsService,
      languages: API.LanguagesService,
      references: API.ReferencesService,
      otherdocuments: API.OtherDocumentsService,
    };
    return serviceMap[activeTab];
  };

  const loadActiveRecords = async () => {
    try {
      const service = getService();
      if (service) {
        const data = await service.getAll();
        setRecords(data || []);
      }
    } catch (e) {
      console.error("Error synchronizing database records:", e);
    }
  };

  useEffect(() => {
    setEditingRecord(null);
    loadActiveRecords();
  }, [activeTab]);

  const handleFormSubmit = async (formData) => {
    const service = getService();
    try {
      if (editingRecord) {
        await service.update(editingRecord.id, formData);
        setEditingRecord(null);
      } else {
        await service.create(formData);
      }
      loadActiveRecords();
    } catch (e) {
      console.error("Error processing form submission:", e);
    }
  };

  const handleDeletion = async (id) => {
    if (!window.confirm("Permanently erase record?")) return;
    try {
      const service = getService();
      await service.delete(id);
      if (editingRecord?.id === id) setEditingRecord(null);
      loadActiveRecords();
    } catch (e) {
      console.error("Error deleting record:", e);
    }
  };

  const handleViewDocument = (rec) => {
    // Shared fallback logic for both Certifications and Other Documents
    const documentUrl = rec.certificate_url || rec.document_url || rec.file_url;
    
    if (documentUrl && typeof documentUrl === "string" && documentUrl.startsWith("http")) {
      window.open(documentUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (rec.image_urls && Array.isArray(rec.image_urls) && rec.image_urls.length > 0) {
      window.open(rec.image_urls[0], "_blank", "noopener,noreferrer");
      return;
    }
    alert("No document file or external verification link available for this record.");
  };

  const renderRecordDetails = (rec) => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="profile-display-card">
            <div className="profile-card-top">
              <div className="profile-avatar-wrapper">
                {rec.profile_image_url ? (
                  <img src={rec.profile_image_url} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <FaUser className="profile-avatar-fallback" />
                )}
              </div>
              <div className="profile-meta-block">
                <h3 className="profile-meta-name">{rec.name}</h3>
                {rec.title && (
                  <p className="profile-meta-title">
                    <FaBriefcase className="inline-icon" /> {rec.title}
                  </p>
                )}
                {rec.headline && (
                  <p className="profile-meta-headline">
                    <FaHeading className="inline-icon" /> {rec.headline}
                  </p>
                )}
              </div>
            </div>
            
            <div className="profile-contact-grid">
              <span className="contact-item">
                <FaEnvelope className="inline-icon" /> {rec.email || "N/A"}
              </span>
              <span className="contact-item">
                <FaPhone className="inline-icon" /> {rec.phone || "N/A"}
              </span>
              <span className="contact-item">
                <FaMapMarkerAlt className="inline-icon" /> {rec.location || "N/A"}
              </span>
            </div>

            <div className="profile-social-row">
              {rec.github && (
                <a href={rec.github} target="_blank" rel="noreferrer" className="social-tag github">
                  <FaGithub /> GitHub
                </a>
              )}
              {rec.linkedin && (
                <a href={rec.linkedin} target="_blank" rel="noreferrer" className="social-tag linkedin">
                  <FaLinkedin /> LinkedIn
                </a>
              )}
            </div>

            {rec.bio && (
              <div className="profile-block-text">
                <span className="block-label">Professional Bio</span>
                <p>{rec.bio}</p>
              </div>
            )}

            {rec.objective && (
              <div className="profile-block-text">
                <span className="block-label">Career Objective</span>
                <p>{rec.objective}</p>
              </div>
            )}
          </div>
        );
      case "skills":
        return (
          <>
            <span className="badge">{rec.category}</span>
            <strong>{rec.skill_name}</strong>
          </>
        );
      case "education":
        return (
          <>
            <strong>{rec.institution}</strong>
            <p>{rec.qualification}</p>
            <p className="detail-sub">{rec.start_year} — {rec.end_year || "Present"}</p>
          </>
        );
      case "experience":
        return (
          <>
            <strong>{rec.position}</strong> at <span>{rec.organization}</span>
            <p className="detail-sub-date">{rec.period}</p>
            <p className="detail-sub">{rec.description}</p>
          </>
        );
      case "projects":
        return (
          <>
            <strong>{rec.title}</strong>
            <p className="detail-sub">{rec.description}</p>
            <p className="tech-stack">⚙️ {rec.technologies}</p>
            <div className="card-links">
              {rec.github_url && <a href={rec.github_url} target="_blank" rel="noreferrer">GitHub</a>}
              {rec.live_url && <a href={rec.live_url} target="_blank" rel="noreferrer">Live Demo</a>}
            </div>
          </>
        );
      case "certifications":
        return (
          <>
            <strong>{rec.title}</strong>
            <p>{rec.organization}</p>
            <button 
              type="button" 
              className="action-btn view-doc-btn" 
              onClick={() => handleViewDocument(rec)}
            >
              <FaFileAlt style={{ marginRight: '6px' }} /> View Document
            </button>
          </>
        );
      case "languages":
        return (
          <>
            <strong>{rec.language}</strong>
            <p className="detail-sub">Proficiency: {rec.proficiency}</p>
          </>
        );
      case "references":
        return (
          <>
            <strong>{rec.names}</strong>
            <p>{rec.position}</p>
            <p className="detail-sub">📞 {rec.phone}</p>
          </>
        );
      case "otherdocuments":
        return (
          <>
            <strong>{rec.document_name || rec.title || "Untitled Document"}</strong>
            {rec.description && <p>{rec.description}</p>}
            <button 
              type="button" 
              className="action-btn view-doc-btn" 
              onClick={() => handleViewDocument(rec)}
            >
              <FaFileAlt style={{ marginRight: '6px' }} /> View Document
            </button>
          </>
        );
      default:
        return null;
    }
  };

  // Added "otherdocuments" to the list so it updates dynamically in the navigation panel
  const tabsList = [
    "profile", 
    "skills", 
    "education", 
    "experience", 
    "projects", 
    "certifications", 
    "languages", 
    "references",
    "otherdocuments"
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h3>Control Console</h3>
        </div> 
        <Link to="/analytics">
  Dashboard
</Link>
        <nav className="sidebar-nav">
          {tabsList.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`sidebar-tab-btn ${activeTab === tab ? "active" : ""}`}
            >
              {/* Fallback styling check for clean formatting of long strings like "otherdocuments" */}
              {tab === "otherdocuments" ? "Other Documents" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="main-header">
          <h2>
            Manage {activeTab === "otherdocuments" ? "Other Documents" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Records
          </h2>
        </div>
        
        <div className="dashboard-section form-section">
          <div className="section-header">
            <h4>{editingRecord ? "⚠️ Edit Entry Mode" : "Append New Entry"}</h4>
            {editingRecord && (
              <button className="cancel-edit-btn" onClick={() => setEditingRecord(null)}>
                Cancel Editing
              </button>
            )}
          </div>

          {activeTab === "profile" && <ProfileForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "skills" && <SkillForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "education" && <EducationForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "experience" && <ExperienceForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "projects" && <ProjectForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "certifications" && <CertificationForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "languages" && <LanguageForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "references" && <ReferenceForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
          {activeTab === "otherdocuments" && <OtherDocumentForm key={editingRecord?.id || "new"} initialData={editingRecord || {}} onSubmit={handleFormSubmit} />}
        </div>

        <div className="dashboard-section records-section">
          <h4>Current Infrastructure Records</h4>
          <div className="data-records-list">
            {records.length === 0 ? (
              <p className="no-records">No records found for this category.</p>
            ) : (
              records.map(rec => (
                <div key={rec.id} className={`custom-data-row ${editingRecord?.id === rec.id ? "is-editing" : ""}`}>
                  <div className="row-content">
                    {renderRecordDetails(rec)}
                  </div>
                  <div className="row-actions">
                    <button className="action-btn edit-btn" onClick={() => setEditingRecord(rec)}>
                      Edit
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeletion(rec.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
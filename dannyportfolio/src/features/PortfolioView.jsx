import React, { useEffect, useState } from "react";
import * as API from "../api/services";
import { Card } from "../components/ui/Card";

const safeParseUrls = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  try {
    if (typeof data === 'string' && data.trim().startsWith('[')) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Error parsing JSON assets inside safeParseUrls:", e);
  }
  
  return typeof data === 'string' ? [data] : [];
};

export const PortfolioView = () => {
  const [store, setStore] = useState({ 
    profile: [], 
    skills: [], 
    education: [], 
    experience: [], 
    projects: [], 
    certifications: [], 
    languages: [], 
    references: [] 
  });
  const [loading, setLoading] = useState(true);
  
  // State for image lightbox preview modal
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  useEffect(() => {
    const collectAllData = async () => {
      try {
        const [profile, skills, education, experience, projects, certifications, languages, references] = await Promise.all([
          API.ProfileService.getAll(), 
          API.SkillsService.getAll(), 
          API.EducationService.getAll(),
          API.ExperienceService.getAll(), 
          API.ProjectsService.getAll(), 
          API.CertificationsService.getAll(),
          API.LanguagesService.getAll(), 
          API.ReferencesService.getAll()
        ]);
        setStore({ profile, skills, education, experience, projects, certifications, languages, references });
      } catch (e) {
        console.error("Failed fetching live profile portfolio parameters.", e);
      } finally {
        setLoading(false);
      }
    };
    collectAllData();
  }, []);

  // Handler function extracted from DashboardView logic to open external links/documents securely
  const handleViewDocument = (rec) => {
    if (rec.certificate_url && typeof rec.certificate_url === "string" && rec.certificate_url.startsWith("http")) {
      window.open(rec.certificate_url, "_blank", "noopener,noreferrer");
      return;
    }
    const parsedImages = safeParseUrls(rec.image_urls);
    if (parsedImages && parsedImages.length > 0) {
      window.open(parsedImages[0], "_blank", "noopener,noreferrer");
      return;
    }
    alert("No document file or external verification link available for this certification.");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <div style={styles.loadingText}>Assembling Workspace...</div>
      </div>
    );
  }
  
  const user = store.profile[0] || {};

  return (
    <>
      {/* Light Mode Global Injector */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        body {
          background-color: #f8fafc !important;
        }

        .portfolio-canvas * {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Premium White Card Styles Overriding standard layouts */
        .custom-card-wrapper {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 20px !important;
          padding: 24px !important;
          box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.08) !important;
        }

        .custom-card-wrapper:hover {
          transform: translateY(-5px);
          border-color: #3b82f6 !important;
          box-shadow: 0 20px 35px -10px rgba(59, 130, 246, 0.12) !important;
        }

        /* Card Text Color Fixes inside ui/Card if needed */
        .custom-card-wrapper h3, .custom-card-wrapper h4 {
          color: #0f172a !important;
        }

        .skill-badge:hover {
          background: #3b82f6 !important;
          color: #ffffff !important;
          border-color: transparent !important;
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
        }

        .skill-badge:hover .category-span {
          color: rgba(255, 255, 255, 0.8) !important;
          background: rgba(255, 255, 255, 0.15) !important;
        }

        .hyperlink-element:hover {
          background: #3b82f6 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }

        .gallery-image:hover, .doc-preview-image:hover {
          transform: scale(1.05);
          border-color: #3b82f6 !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .inline-view-btn:hover {
          background: #2563eb !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }
      `}</style>

      <div className="portfolio-canvas" style={styles.canvas}>
        
        {/* 1. HERO HEADER BLOCK */}
        <div style={styles.headerRegion}>
          {user.profile_image_url && (
            <img 
              src={user.profile_image_url} 
              alt="Profile" 
              style={styles.avatarFrame}
            />
          )}
          <div style={styles.metaIdentityBlock}>
            <h1 style={styles.profileName}>{user.name || "Anonymous Developer"}</h1>
            <h3 style={styles.profileTitle}>{user.title}</h3>
            {user.headline && <p style={styles.headlineQuote}>“{user.headline}”</p>}
            
            <div style={styles.metaMetricsRow}>
              {user.email && <span style={styles.metricItem}>📧 {user.email}</span>}
              {user.phone && <span style={styles.metricItem}>📞 {user.phone}</span>}
              {user.location && <span style={styles.metricItem}>📍 {user.location}</span>}
            </div>
            
            <div style={styles.hyperlinksRow}>
              {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="hyperlink-element" style={styles.hyperlink}>GitHub</a>}
              {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="hyperlink-element" style={styles.hyperlink}>LinkedIn</a>}
            </div>
          </div>
        </div>

        {/* 2. EXECUTIVE SUMMARY & BIO */}
        {(user.bio || user.objective) && (
          <section style={styles.section}>
            {user.bio && <p style={styles.introSummary}>{user.bio}</p>}
            {user.objective && (
              <div style={styles.objectiveCallout}>
                <strong style={styles.objectiveLabel}>Career Objective</strong>
                <p style={styles.objectiveText}>{user.objective}</p>
              </div>
            )}
          </section>
        )}

        {/* 3. SKILLS MATRIX */}
        {store.skills.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Skills Matrix</h2>
            <div style={styles.skillsMatrixFlex}>
              {store.skills.map(sk => (
                <span key={sk.id} className="skill-badge" style={styles.skillBadge}>
                  {sk.skill_name} <span className="category-span" style={styles.opacitySub}>{sk.category}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 4. WORK EXPERIENCE */}
        {store.experience.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Professional Experience</h2>
            <div style={styles.timelineStack}>
              {store.experience.map(exp => (
                <div key={exp.id} className="custom-card-wrapper">
                  <Card title={exp.position} subtitle={`${exp.organization} — ${exp.period}`}>
                    <p style={styles.cardBodyText}>{exp.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. FEATURED PROJECTS */}
        {store.projects.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Featured Projects</h2>
            <div style={styles.projectGrid}>
              {store.projects.map(proj => (
                <div key={proj.id} className="custom-card-wrapper">
                  <Card title={proj.title} subtitle={`Tech Stack: ${proj.technologies}`}>
                    <p style={{ ...styles.cardBodyText, marginBottom: "16px" }}>{proj.description}</p>
                    {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer">GitHub</a>}
                    {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer">Live Demo</a>}
                    
                    <div style={styles.projectGalleryRow}>
                      {safeParseUrls(proj.image_urls).map((url, idx) => (
                        <img 
                          key={idx} 
                          src={url} 
                          alt="Project Showcase Asset" 
                          className="gallery-image"
                          style={styles.showcaseAssetCard}
                          onClick={() => setActiveLightboxImg(url)}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. QUALIFICATIONS GROUP (EDUCATION & CERTIFICATIONS WITH IMAGE SUPPORT) */}
        <div style={styles.qualificationsSplitRow}>
          {store.education.length > 0 && (
            <div style={styles.splitColumn}>
              <h2 style={styles.sectionTitle}>Education</h2>
              <div style={styles.verticalStack}>
                {store.education.map(edu => (
                  <div key={edu.id} style={styles.compactCard}>
                    <strong style={styles.cardHeading}>{edu.qualification}</strong>
                    <p style={styles.cardSubheading}>{edu.institution}</p>
                    <span style={styles.cardTimeline}>{edu.start_year} — {edu.end_year || "Present"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {store.certifications.length > 0 && (
            <div style={styles.splitColumn}>
              <h2 style={styles.sectionTitle}>Certifications & Documents</h2>
              <div style={styles.verticalStack}>
                {store.certifications.map(cert => (
                  <div key={cert.id} style={styles.compactCard}>
                    <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <strong style={styles.cardHeading}>{cert.title}</strong>
                        <span style={styles.cardSubheading}>{cert.organization}</span>
                      </div>
                      
                      {/* Interactive Premium Light Button to review verifying document / external resource links directly */}
                      <button 
                        type="button" 
                        className="inline-view-btn"
                        style={styles.inlineViewBtn} 
                        onClick={() => handleViewDocument(cert)}
                      >
                        View Document
                      </button>
                    </div>

                    {/* Integrated Certificate Document Viewer */}
                    {/*  */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 7. LANGUAGES */}
        {store.languages.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Languages</h2>
            <div style={styles.languagesCapsuleWrap}>
              {store.languages.map(lang => (
                <div key={lang.id} style={styles.languagePill}>
                  <strong style={{ color: "#10b981" }}>{lang.language}</strong> 
                  <span style={styles.languageProficiency}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. REFERENCES */}
        {store.references.length > 0 && (
          <section style={{ ...styles.section, marginBottom: "40px" }}>
            <h2 style={styles.sectionTitle}>Professional References</h2>
            <div style={styles.referencesGridLayout}>
              {store.references.map(ref => (
                <div key={ref.id} style={styles.referenceProfileNode}>
                  <strong style={styles.refName}>{ref.names}</strong>
                  <span style={styles.refTitle}>{ref.position}</span>
                  <span style={styles.refComms}>📞 {ref.phone}</span>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* GLOBAL SCREENSHOT & DOCUMENT LIGHTBOX MODAL */}
      {activeLightboxImg && (
        <div style={styles.lightboxOverlay} onClick={() => setActiveLightboxImg(null)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.lightboxCloseBtn} onClick={() => setActiveLightboxImg(null)}>×</button>
            <img src={activeLightboxImg} alt="High resolution view" style={styles.lightboxImage} />
          </div>
        </div>
      )}
    </>
  );
};

// Colors Engine Styles Configuration Grid
const styles = {
  canvas: {
    maxWidth: "1140px",
    margin: "40px auto",
    padding: "20px 24px",
    backgroundColor: "#f8fafc", 
    color: "#334155", 
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8fafc",
  },
  loadingSpinner: {
    width: "45px",
    height: "45px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#64748b",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
  headerRegion: {
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    alignItems: "center",
    padding: "40px",
    background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 25px -5px rgba(148, 163, 184, 0.05)",
    marginBottom: "48px",
  },
  avatarFrame: {
    width: "130px",
    height: "130px",
    borderRadius: "24px", 
    objectFit: "cover",
    border: "3px solid #ffffff",
    boxShadow: "0 8px 25px rgba(148, 163, 184, 0.25)",
  },
  metaIdentityBlock: {
    flex: "1 1 500px",
  },
  profileName: {
    fontSize: "2.6rem",
    fontWeight: "800",
    margin: "0 0 6px 0",
    letterSpacing: "-0.75px",
    color: "#0f172a", 
  },
  profileTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#3b82f6", 
    margin: "0 0 14px 0",
    letterSpacing: "0.3px",
  },
  headlineQuote: {
    fontStyle: "italic",
    color: "#64748b",
    fontSize: "1rem",
    lineHeight: "1.6",
    margin: "0 0 20px 0",
  },
  metaMetricsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    color: "#475569",
    fontSize: "0.85rem",
    marginBottom: "24px",
  },
  metricItem: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: "500",
  },
  hyperlinksRow: {
    display: "flex",
    gap: "12px",
  },
  hyperlink: {
    textDecoration: "none",
    color: "#3b82f6",
    border: "1px solid #bfdbfe",
    padding: "10px 24px",
    borderRadius: "12px",
    fontSize: "0.9rem",
    fontWeight: "600",
    background: "#eff6ff",
  },
  section: {
    marginBottom: "48px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "24px",
    color: "#0f172a",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "12px",
  },
  introSummary: {
    fontSize: "1.15rem",
    height: "auto",
    lineHeight: "1.75",
    color: "#334155",
    marginBottom: "24px",
  },
  objectiveCallout: {
    background: "#f0fdf4", 
    borderLeft: "4px solid #10b981",
    padding: "20px 24px",
    borderRadius: "0 16px 16px 0",
  },
  objectiveLabel: {
    display: "block",
    color: "#047857",
    marginBottom: "4px",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  objectiveText: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.6",
  },
  skillsMatrixFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillBadge: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "10px 16px",
    borderRadius: "12px",
    fontSize: "0.88rem",
    fontWeight: "500",
    color: "#334155",
    cursor: "default",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  opacitySub: {
    color: "#3b82f6",
    fontSize: "0.75rem",
    marginLeft: "6px",
    background: "#eff6ff",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  timelineStack: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardBodyText: {
    color: "#475569",
    lineHeight: "1.65",
    fontSize: "0.95rem",
    margin: 0,
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "24px",
  },
  projectGalleryRow: {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    padding: "4px 0",
  },
  showcaseAssetCard: {
    width: "130px",
    height: "85px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    cursor: "pointer",
  },
  qualificationsSplitRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    marginBottom: "48px",
  },
  splitColumn: {
    display: "flex",
    flexDirection: "column",
  },
  verticalStack: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  compactCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(148, 163, 184, 0.04)",
  },
  cardHeading: {
    display: "block",
    color: "#0f172a",
    fontSize: "1.05rem",
    fontWeight: "600",
    marginBottom: "4px",
  },
  cardSubheading: {
    color: "#475569",
    margin: "0 0 10px 0",
    fontSize: "0.92rem",
  },
  cardTimeline: {
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: "500",
  },
  certDocumentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "8px"
  },
  docWrapper: {
    position: "relative",
    width: "90px",
    height: "65px",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #cbd5e1"
  },
  certDocumentPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  docHoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(15, 23, 42, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s ease",
    ":hover": {
      opacity: 1
    }
  },
  inlineViewBtn: {
    background: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "0.82rem",
    fontWeight: "600",
    cursor: "pointer",
    outline: "none",
  },
  languagesCapsuleWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
  },
  languagePill: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "12px 20px",
    borderRadius: "14px",
    fontSize: "0.92rem",
    display: "flex",
    gap: "8px",
  },
  languageProficiency: {
    color: "#16a34a",
    fontWeight: "500",
  },
  referencesGridLayout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  referenceProfileNode: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 15px rgba(148, 163, 184, 0.04)",
  },
  refName: {
    color: "#0f172a",
    fontSize: "1.05rem",
    marginBottom: "4px",
  },
  refTitle: {
    color: "#64748b",
    fontSize: "0.88rem",
    marginBottom: "12px",
  },
  refComms: {
    color: "#334155",
    fontSize: "0.88rem",
    fontWeight: "500",
  },
  lightboxOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px"
  },
  lightboxContent: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90vh",
    backgroundColor: "#ffffff",
    padding: "10px",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  },
  lightboxImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    objectFit: "contain",
    borderRadius: "8px"
  },
  lightboxCloseBtn: {
    position: "absolute",
    top: "-45px",
    right: "0px",
    background: "none",
    border: "none",
    color: "#ffffff",
    fontSize: "2.5rem",
    cursor: "pointer"
  }
};
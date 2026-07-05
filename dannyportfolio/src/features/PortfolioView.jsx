import React, { useEffect, useState } from "react";
import * as API from "../api/services";
import { Card } from "../components/ui/Card";
import { DashboardView } from "./DashboardView";

// Helper function to safely parse asset URLs
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

// Simple frontend DJB2 hashing utility to protect raw strings in memory
const frontendHash = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
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
    references: [],
    otherdocuments: [] 
  });
  const [loading, setLoading] = useState(true);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Targets
  const TARGET_EMAIL = "danny@gmail.com";
  // Pre-hashed '1212' using frontendHash utility to ensure zero clear-text evaluations
  const TARGET_HASH = frontendHash("1212");

  useEffect(() => {
    const collectAllData = async () => {
      try {
        const [
          profile, 
          skills, 
          education, 
          experience, 
          projects, 
          certifications, 
          languages, 
          references,
          otherdocuments 
        ] = await Promise.all([
          API.ProfileService.getAll(), 
          API.SkillsService.getAll(), 
          API.EducationService.getAll(),
          API.ExperienceService.getAll(), 
          API.ProjectsService.getAll(), 
          API.CertificationsService.getAll(),
          API.LanguagesService.getAll(), 
          API.ReferencesService.getAll(),
          API.OtherDocumentsService ? API.OtherDocumentsService.getAll() : Promise.resolve([])
        ]);
        setStore({ profile, skills, education, experience, projects, certifications, languages, references, otherdocuments });
      } catch (e) {
        console.error("Failed fetching live profile portfolio parameters.", e);
      } finally {
        setLoading(false);
      }
    };
    collectAllData();
  }, []);

  const handleViewDocument = (rec) => {
    const fallbackUrl = rec.certificate_url || rec.document_url || rec.file_url;
    if (fallbackUrl && typeof fallbackUrl === "string" && fallbackUrl.startsWith("http")) {
      window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      return;
    }
    const parsedImages = safeParseUrls(rec.image_urls || rec.file_urls);
    if (parsedImages && parsedImages.length > 0) {
      window.open(parsedImages[0], "_blank", "noopener,noreferrer");
      return;
    }
    alert("No document file or external verification link available for this entry.");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    const computedInputHash = frontendHash(authPassword);

    if (authEmail.trim().toLowerCase() === TARGET_EMAIL && computedInputHash === TARGET_HASH) {
      setShowAuthModal(false);
      // Redirects the current browser window session to the logical dashboard path route
      window.location.pathname = "/dashboard";
    } else {
      setAuthError("Invalid administrative credentials provided.");
    }
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        body {
          background-color: #f8fafc !important;
          margin: 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .portfolio-canvas * {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .custom-card-wrapper {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          padding: 24px !important;
          box-shadow: 0 4px 12px rgba(148, 163, 184, 0.05) !important;
        }

        .custom-card-wrapper:hover {
          transform: translateY(-4px);
          border-color: #3b82f6 !important;
          box-shadow: 0 16px 32px rgba(59, 130, 246, 0.08) !important;
        }

        .custom-card-wrapper h3, .custom-card-wrapper h4 {
          color: #0f172a !important;
        }

        .skill-badge {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #334155;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.01);
        }

        .skill-badge:hover {
          background: #3b82f6 !important;
          color: #ffffff !important;
          border-color: transparent !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(59, 130, 246, 0.15);
        }

        .skill-badge:hover .category-span {
          color: rgba(255, 255, 255, 0.9) !important;
          background: rgba(255, 255, 255, 0.2) !important;
        }

        .hyperlink-element:hover {
          background: #3b82f6 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(59, 130, 246, 0.15);
        }

        .gallery-image:hover, .doc-preview-image:hover {
          transform: scale(1.04);
          border-color: #3b82f6 !important;
        }

        .inline-view-btn:hover {
          background: #1d4ed8 !important;
          transform: translateY(-1px);
        }

        .action-login-trigger {
          background: #ffffff;
          color: #334155;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-login-trigger:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
      `}</style>

      {/* TOP NAVIGATION BAR */}
      <nav style={styles.topNavbar}>
        <div style={styles.navContainer}>
          <div style={styles.navLogo}>Engineered Workspace</div>
          <button 
            type="button" 
            className="action-login-trigger" 
            onClick={() => { setAuthError(""); setShowAuthModal(true); }}
          >
            🔒 Administrative Gateway
          </button>
        </div>
      </nav>

      <div className="portfolio-canvas" style={styles.canvas}>
        
        {/* HERO INTRO BLOCK */}
        <div style={styles.headerRegion}>
          {user.profile_image_url && (
            <img 
              src={user.profile_image_url} 
              alt={user.name || "Developer"} 
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
              {user.github && <a href={user.github} target="_blank" rel="noreferrer" className="hyperlink-element" style={styles.hyperlink}>GitHub Profile</a>}
              {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" className="hyperlink-element" style={styles.hyperlink}>LinkedIn Connect</a>}
            </div>
          </div>
        </div>

        {/* ASYMMETRICAL COLUMN MATRIX */}
        <div style={styles.dualGridStructure}>
          
          {/* LEFT SIDE COLUMN (MAIN PROFILE DETAILS) */}
          <div style={styles.leftMainColumn}>
            
            {/* EXECUTIVE SUMMARY (BIO) */}
            {user.bio && (
              <section style={styles.section}>
                <h2 style={styles.premiumSectionTitle}>Executive Summary</h2>
                <div style={styles.bioWrapperCard}>
                  <p style={styles.premiumReaderBio}>{user.bio}</p>
                </div>
              </section>
            )}

            {/* FEATURED PROJECTS CONTAINER */}
            {store.projects.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Featured Operational Inventions</h2>
                <div style={styles.projectGrid}>
                  {store.projects.map(proj => (
                    <div key={proj.id} className="custom-card-wrapper">
                      <Card title={proj.title} subtitle={`Engineered with: ${proj.technologies}`}>
                        <p style={{ ...styles.cardBodyText, marginBottom: "16px" }}>{proj.description}</p>
                        <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                          {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" style={styles.textLinkBlue}>Source Code</a>}
                          {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" style={styles.textLinkGreen}>Production Live</a>}
                        </div>
                        
                        <div style={styles.projectGalleryRow}>
                          {safeParseUrls(proj.image_urls).map((url, idx) => (
                            <img 
                              key={idx} 
                              src={url} 
                              alt="Production Module Preview" 
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

            {/* WORK & LEADERSHIP EXPERIENCE */}
            {store.experience.length > 0 && (
              <section style={styles.section}>
                <h2 style={styles.premiumSectionTitle}>Professional & Leadership History</h2>
                <div style={styles.timelineStack}>
                  {store.experience.map(exp => (
                    <div key={exp.id} className="custom-card-wrapper">
                      <Card title={exp.position} subtitle={`${exp.organization} ⚡ ${exp.period}`}>
                        <p style={styles.premiumReaderExperience}>{exp.description}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDE STICKY COMPLEMENTARY COLUMN */}
          <div style={styles.rightSidebarColumn}>
            
            {/* CAREER OBJECTIVE CALLOUT */}
            {user.objective && (
              <div style={styles.objectiveCallout}>
                <strong style={styles.premiumObjectiveLabel}>Target Objective</strong>
                <p style={styles.premiumReaderObjective}>{user.objective}</p>
              </div>
            )}

            {/* SKILLS CONTAINER */}
            {store.skills.length > 0 && (
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarSectionTitle}>Technical Competencies</h3>
                <div style={styles.skillsMatrixFlex}>
                  {store.skills.map(sk => (
                    <span key={sk.id} className="skill-badge">
                      {sk.skill_name} 
                      <span className="category-span" style={styles.opacitySub}>{sk.category}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {store.education.length > 0 && (
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarSectionTitle}>Academic Background</h3>
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

            {/* LANGUAGES */}
            {store.languages.length > 0 && (
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarSectionTitle}>Languages</h3>
                <div style={styles.languagesCapsuleWrap}>
                  {store.languages.map(lang => (
                    <div key={lang.id} style={styles.languagePill}>
                      <strong style={{ color: "#057857" }}>{lang.language}</strong> 
                      <span style={styles.languageProficiency}>{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REFERENCES */}
            {store.references.length > 0 && (
              <div style={styles.sidebarSection}>
                <h3 style={styles.sidebarSectionTitle}>Professional Endorsements</h3>
                <div style={styles.verticalStack}>
                  {store.references.map(ref => (
                    <div key={ref.id} style={styles.referenceProfileNode}>
                      <strong style={styles.refName}>{ref.names}</strong>
                      <span style={styles.refTitle}>{ref.position}</span>
                      <span style={styles.refComms}>📞 {ref.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH ACCOMPLISHMENTS SEGMENT */}
        {(store.certifications.length > 0 || store.otherdocuments.length > 0) && (
          <section style={{ ...styles.section, marginTop: "24px" }}>
            <h2 style={styles.sectionTitle}>CERTIFICATES & OTHER DOCUMENTS</h2>
            <div style={styles.bottomCertRowGrid}>
              
              {/* Loop Certifications */}
              {store.certifications.map(cert => (
                <div key={cert.id} style={styles.compactCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={styles.cardHeading}>{cert.title}</strong>
                      <span style={{ ...styles.cardSubheading, margin: 0 }}>{cert.organization}</span>
                    </div>
                    <button 
                      type="button" 
                      className="inline-view-btn"
                      style={styles.inlineViewBtn} 
                      onClick={() => handleViewDocument(cert)}
                    >
                      View Document
                    </button>
                  </div>
                </div>
              ))}

              {/* Loop Supplementary Documents */}
              {store.otherdocuments.map(doc => (
                <div key={doc.id} style={{ ...styles.compactCard, borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, paddingRight: "12px" }}>
                      <strong style={styles.cardHeading}>{doc.document_name || doc.title || "Supplementary Asset"}</strong>
                      {doc.description && <p style={{ ...styles.cardSubheading, margin: "4px 0 0 0" }}>{doc.description}</p>}
                    </div>
                    <button 
                      type="button" 
                      className="inline-view-btn"
                      style={{ ...styles.inlineViewBtn, backgroundColor: "#475569" }} 
                      onClick={() => handleViewDocument(doc)}
                    >
                      Open File
                    </button>
                  </div>

                  {safeParseUrls(doc.image_urls || doc.file_urls).length > 0 && (
                    <div style={styles.certDocumentRow}>
                      {safeParseUrls(doc.image_urls || doc.file_urls).map((url, idx) => (
                        <div key={idx} style={styles.docWrapper} onClick={() => setActiveLightboxImg(url)}>
                          <img src={url} alt="Document Secure Preview" className="doc-preview-image" style={styles.certDocumentPreview} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ADMINISTRATIVE LOGIN INTERCEPT MODAL */}
      {showAuthModal && (
        <div style={styles.lightboxOverlay} onClick={() => setShowAuthModal(false)}>
          <div style={styles.authModalContainer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.authModalHeader}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>Administrative Identity Gateway</h3>
              <button style={styles.authModalCloseX} onClick={() => setShowAuthModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleLoginSubmit} style={styles.authForm}>
              {authError && <div style={styles.authFeedbackError}>{authError}</div>}
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Identity E-mail</label>
                <input 
                  type="email" 
                  required 
                  style={styles.formInputField}
                  placeholder="name@domain.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Security Access Key</label>
                <input 
                  type="password" 
                  required 
                  style={styles.formInputField}
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>

              <button type="submit" style={styles.authSubmitBtn}>
                Authenticate Identity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REUSABLE LIGHTBOX PREVIEW */}
      {activeLightboxImg && (
        <div style={styles.lightboxOverlay} onClick={() => setActiveLightboxImg(null)}>
          <div style={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.lightboxCloseBtn} onClick={() => setActiveLightboxImg(null)}>×</button>
            <img src={activeLightboxImg} alt="High resolution inspection" style={styles.lightboxImage} />
          </div>
        </div>
      )}
    </>
  );
};

// CSS-in-JS Design System Styles Blueprint
const styles = {
  topNavbar: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    padding: "12px 0",
  },
  navContainer: {
    maxWidth: "1140px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLogo: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "1.05rem",
    letterSpacing: "-0.3px",
  },
  canvas: {
    maxWidth: "1140px",
    margin: "24px auto 60px auto",
    padding: "0 24px",
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
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    marginTop: "16px",
    color: "#475569",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  headerRegion: {
    display: "flex",
    flexWrap: "wrap",
    gap: "32px",
    alignItems: "center",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(148, 163, 184, 0.04)",
    marginBottom: "32px",
  },
  avatarFrame: {
    width: "120px",
    height: "120px",
    borderRadius: "16px", 
    objectFit: "cover",
    border: "4px solid #f1f5f9",
  },
  metaIdentityBlock: {
    flex: "1 1 500px",
  },
  profileName: {
    fontSize: "2.25rem",
    fontWeight: "800",
    margin: "0 0 4px 0",
    letterSpacing: "-0.5px",
    color: "#0f172a", 
  },
  profileTitle: {
    fontSize: "1.15rem",
    fontWeight: "600",
    color: "#3b82f6", 
    margin: "0 0 12px 0",
  },
  headlineQuote: {
    fontStyle: "italic",
    color: "#64748b",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    margin: "0 0 16px 0",
  },
  metaMetricsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    color: "#475569",
    fontSize: "0.82rem",
    marginBottom: "20px",
  },
  metricItem: {
    background: "#f1f5f9",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "500",
  },
  hyperlinksRow: {
    display: "flex",
    gap: "12px",
  },
  hyperlink: {
    textDecoration: "none",
    color: "#3b82f6",
    border: "1px solid #dbeafe",
    padding: "8px 18px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "600",
    background: "#eff6ff",
  },
  dualGridStructure: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.9fr) minmax(0, 1.1fr)",
    gap: "32px",
    alignItems: "start",
  },
  leftMainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  rightSidebarColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "sticky",
    top: "85px",
  },
  section: {
    marginBottom: "28px",
  },
  sidebarSection: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(148, 163, 184, 0.02)",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "700",
    marginBottom: "18px",
    color: "#0f172a",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "12px",
  },
  premiumSectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "800",
    marginBottom: "18px",
    color: "#0f172a",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "12px",
  },
  sidebarSectionTitle: {
    fontSize: "1.05rem",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#0f172a",
    borderLeft: "3px solid #10b981",
    paddingLeft: "10px",
    marginTop: 0,
  },
  bioWrapperCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "24px",
    borderRadius: "16px",
  },
  premiumReaderBio: {
    fontSize: "1.06rem",
    lineHeight: "1.8",
    color: "#1e293b", 
    fontWeight: "600",
    letterSpacing: "-0.1px",
    margin: 0,
  },
  premiumObjectiveLabel: {
    display: "block",
    color: "#065f46",
    marginBottom: "8px",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "700",
  },
  premiumReaderObjective: {
    fontSize: "0.96rem",
    lineHeight: "1.75",
    color: "#0f172a", 
    fontWeight: "600",
    letterSpacing: "-0.05px",
    margin: 0,
  },
  premiumReaderExperience: {
    fontSize: "0.98rem",
    lineHeight: "1.8",
    color: "#1e293b",
    fontWeight: "600",
    letterSpacing: "0.02px",
    margin: 0,
    whiteSpace: "pre-wrap", 
  },
  objectiveCallout: {
    background: "#ecfdf5", 
    borderLeft: "4px solid #10b981",
    padding: "18px 20px",
    borderRadius: "12px",
  },
  skillsMatrixFlex: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  opacitySub: {
    color: "#3b82f6",
    fontSize: "0.72rem",
    background: "#eff6ff",
    padding: "1px 5px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  timelineStack: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardBodyText: {
    color: "#475569",
    lineHeight: "1.6",
    fontSize: "0.9rem",
    margin: 0,
  },
  projectGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  projectGalleryRow: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    paddingBottom: "4px",
  },
  showcaseAssetCard: {
    width: "110px",
    height: "75px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
  },
  bottomCertRowGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "20px",
  },
  verticalStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  compactCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "16px 20px",
    borderRadius: "12px",
  },
  cardHeading: {
    display: "block",
    color: "#0f172a",
    fontSize: "0.95rem",
    fontWeight: "600",
  },
  cardSubheading: {
    color: "#64748b",
    margin: "2px 0 6px 0",
    fontSize: "0.85rem",
  },
  cardTimeline: {
    color: "#94a3b8",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  certDocumentRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px"
  },
  docWrapper: {
    width: "75px",
    height: "55px",
    borderRadius: "6px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #e2e8f0"
  },
  certDocumentPreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  inlineViewBtn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "0.78rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  languagesCapsuleWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  languagePill: {
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    display: "flex",
    gap: "6px",
  },
  languageProficiency: {
    color: "#15803d",
    fontWeight: "500",
  },
  referenceProfileNode: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "14px 16px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
  },
  refName: {
    color: "#0f172a",
    fontSize: "0.92rem",
  },
  refTitle: {
    color: "#64748b",
    fontSize: "0.82rem",
    marginBottom: "6px",
  },
  refComms: {
    color: "#475569",
    fontSize: "0.82rem",
    fontWeight: "500",
  },
  textLinkBlue: { color: "#3b82f6", fontWeight: "600", textDecoration: "none", fontSize: "0.88rem" },
  textLinkGreen: { color: "#10b981", fontWeight: "600", textDecoration: "none", fontSize: "0.88rem" },
  
  lightboxOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    padding: "20px"
  },
  lightboxContent: {
    position: "relative",
    maxWidth: "85%",
    maxHeight: "85vh",
    backgroundColor: "#ffffff",
    padding: "8px",
    borderRadius: "12px",
  },
  lightboxImage: {
    maxWidth: "100%",
    maxHeight: "75vh",
    objectFit: "contain",
    borderRadius: "6px"
  },
  lightboxCloseBtn: {
    position: "absolute",
    top: "-40px",
    right: "0px",
    background: "none",
    border: "none",
    color: "#ffffff",
    fontSize: "2rem",
    cursor: "pointer"
  },
  authModalContainer: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
    border: "1px solid #e2e8f0",
  },
  authModalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  authModalCloseX: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "1.75rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formLabel: {
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  formInputField: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "0.92rem",
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
  },
  authSubmitBtn: {
    marginTop: "8px",
    background: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    fontWeight: "600",
    fontSize: "0.92rem",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },
  authFeedbackError: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "500",
  }
};
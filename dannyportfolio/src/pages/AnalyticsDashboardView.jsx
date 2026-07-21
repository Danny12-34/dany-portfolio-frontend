import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import * as API from "../api/services";
import { 
  FaFolderOpen, 
  FaCode, 
  FaCertificate, 
  FaSync, 
  FaArrowLeft,
  FaEye,
  FaDesktop,
  FaMobileAlt,
  FaGlobe,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaTerminal
} from "react-icons/fa";

export const AnalyticsDashboardView = () => {
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
  const [totalVisitorCount, setTotalVisitorCount] = useState(null);
  const [uniqueVisitorCount, setUniqueVisitorCount] = useState(null);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const trackWebsiteVisitors = useCallback(async () => {
    try {
      // JSONBin Cloud Credentials
      const BIN_ID = "6a5f5e1cf5f4af5e29ac1e1b";
      const API_KEY = "$2a$10$f1PzjyVH7XgKBaNgZwb53.yk.eAKvVNIl7N.F0bx5XSrNYCTR1o8u";

      // Fetch logs directly from your shared cloud bin
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": API_KEY }
      });
      const data = await res.json();
      const logs = Array.isArray(data.record) ? data.record : [];

      // Calculate totals and unique visitor counts from the cloud records
      setTotalVisitorCount(logs.length);
      const uniqueDevices = new Set(logs.map(l => l.biosSerialNumber));
      setUniqueVisitorCount(uniqueDevices.size);

      // Sort logs by timestamp (Newest visits first)
      logs.sort((a, b) => b.rawTimestamp - a.rawTimestamp);
      setVisitorLogs(logs);

    } catch (err) {
      console.error("Telemetry cloud bin resolution error:", err);
    }
  }, []);

  const fetchTelemetryData = useCallback(async () => {
    setLoading(true);
    try {
      await trackWebsiteVisitors();

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
        API.ProfileService ? API.ProfileService.getAll().catch(() => []) : [],
        API.SkillsService ? API.SkillsService.getAll().catch(() => []) : [],
        API.EducationService ? API.EducationService.getAll().catch(() => []) : [],
        API.ExperienceService ? API.ExperienceService.getAll().catch(() => []) : [],
        API.ProjectsService ? API.ProjectsService.getAll().catch(() => []) : [],
        API.CertificationsService ? API.CertificationsService.getAll().catch(() => []) : [],
        API.LanguagesService ? API.LanguagesService.getAll().catch(() => []) : [],
        API.ReferencesService ? API.ReferencesService.getAll().catch(() => []) : [],
        API.OtherDocumentsService ? API.OtherDocumentsService.getAll().catch(() => []) : []
      ]);

      setStore({
        profile: profile || [],
        skills: skills || [],
        education: education || [],
        experience: experience || [],
        projects: projects || [],
        certifications: certifications || [],
        languages: languages || [],
        references: references || [],
        otherdocuments: otherdocuments || []
      });
    } catch (e) {
      console.error("Error loading analytics telemetry:", e);
    } finally {
      setLoading(false);
    }
  }, [trackWebsiteVisitors]);

  useEffect(() => {
    fetchTelemetryData();

    const intervalId = setInterval(() => {
      trackWebsiteVisitors();
    }, 10000);

    const handleStorageChange = (e) => {
      if (e.key === "portfolio_registered" || e.key === "real_visitor_logs") {
        trackWebsiteVisitors();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchTelemetryData, trackWebsiteVisitors]);

  const totalDocuments = store.certifications.length + store.otherdocuments.length;

  // Pagination Logic
  const totalPages = Math.ceil(visitorLogs.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = visitorLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .analytics-root * {
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.25s ease;
        }

        .analytics-root {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 32px;
        }

        .analytics-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .analytics-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          background: #1e293b;
          padding: 8px 16px;
          border-radius: 10px;
          border: 1px solid #334155;
        }

        .back-link:hover {
          color: #ffffff;
          background: #334155;
        }

        .page-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
        }

        .sync-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          border: none;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .sync-btn:hover {
          background: #1d4ed8;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
        }

        .stat-card.cyan::before { background: #06b6d4; }
        .stat-card.indigo::before { background: #6366f1; }
        .stat-card.blue::before { background: #3b82f6; }
        .stat-card.green::before { background: #10b981; }
        .stat-card.purple::before { background: #8b5cf6; }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .stat-card.cyan .stat-icon { background: rgba(6, 182, 212, 0.15); color: #06b6d4; }
        .stat-card.indigo .stat-icon { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
        .stat-card.blue .stat-icon { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-card.green .stat-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .stat-card.purple .stat-icon { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }

        .stat-number {
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 6px;
        }

        .panel-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-header-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .telemetry-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .telemetry-table th {
          background: #0f172a;
          color: #94a3b8;
          padding: 12px 16px;
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          border-bottom: 1px solid #334155;
        }

        .telemetry-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #334155;
          font-size: 0.88rem;
          color: #e2e8f0;
        }

        .bios-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          color: #38bdf8;
          font-weight: 700;
          letter-spacing: 0.5px;
          background: rgba(56, 189, 248, 0.1);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(56, 189, 248, 0.2);
          font-size: 0.88rem;
        }

        .badge-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-status.first-visit {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }

        .badge-status.repeat-visit {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        }

        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #334155;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pagination-info {
          font-size: 0.85rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #0f172a;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .page-btn:hover:not(:disabled) {
          background: #2563eb;
          border-color: #2563eb;
        }

        .page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-number-btn {
          min-width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          border: 1px solid #334155;
          color: #94a3b8;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .page-number-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .analytics-root {
            padding: 16px;
          }
        }
      `}</style>

      <div className="analytics-root">
        <div className="analytics-container">
          
          <div className="analytics-topbar">
            <div>
              <Link to="/dashboard" className="back-link">
                <FaArrowLeft /> Back to Control Console
              </Link>
              <h1 className="page-title" style={{ marginTop: "12px" }}>
                Complete Telemetry & Traffic Logs
              </h1>
            </div>

            <button className="sync-btn" onClick={fetchTelemetryData}>
              <FaSync className={loading ? "fa-spin" : ""} /> Sync Telemetry
            </button>
          </div>

          <div className="cards-grid">
            <div className="stat-card cyan">
              <div className="stat-icon">
                <FaEye />
              </div>
              <div>
                <div className="stat-number">
                  {totalVisitorCount !== null ? totalVisitorCount.toLocaleString() : "..."}
                </div>
                <div className="stat-label">Total Visits (All Hits)</div>
              </div>
            </div>

            <div className="stat-card indigo">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div>
                <div className="stat-number">
                  {uniqueVisitorCount !== null ? uniqueVisitorCount.toLocaleString() : "..."}
                </div>
                <div className="stat-label">Unique Devices</div>
              </div>
            </div>

            <div className="stat-card blue">
              <div className="stat-icon">
                <FaFolderOpen />
              </div>
              <div>
                <div className="stat-number">{store.projects.length}</div>
                <div className="stat-label">Projects</div>
              </div>
            </div>

            <div className="stat-card green">
              <div className="stat-icon">
                <FaCode />
              </div>
              <div>
                <div className="stat-number">{store.skills.length}</div>
                <div className="stat-label">Skills</div>
              </div>
            </div>

            <div className="stat-card purple">
              <div className="stat-icon">
                <FaCertificate />
              </div>
              <div>
                <div className="stat-number">{totalDocuments}</div>
                <div className="stat-label">Documents</div>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-header-title">
                All Visitor Telemetry ({visitorLogs.length} Records)
              </h3>
              <FaGlobe style={{ color: "#06b6d4" }} />
            </div>

            <div className="table-responsive">
              <table className="telemetry-table">
                <thead>
                  <tr>
                    <th>Device Hardware ID</th>
                    <th>Location / Country</th>
                    <th>Device Hardware</th>
                    <th>Browser</th>
                    <th>Timestamp (Time of Visit)</th>
                    <th>Session Type</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="bios-badge">
                          <FaTerminal style={{ fontSize: "0.75rem", color: "#06b6d4" }} />
                          {log.biosSerialNumber}
                        </span>
                      </td>
                      <td>
                        <strong>{log.country}</strong> ({log.city})
                      </td>
                      <td>
                        {log.device === "Mobile" ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <FaMobileAlt style={{ color: "#10b981" }} /> Mobile
                          </span>
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <FaDesktop style={{ color: "#3b82f6" }} /> Desktop
                          </span>
                        )}
                      </td>
                      <td>{log.browser}</td>
                      <td style={{ fontWeight: 600 }}>{log.timeDisplay}</td>
                      <td>
                        <span className={`badge-status ${log.sessionType === "First-Time Visit" ? "first-visit" : "repeat-visit"}`}>
                          {log.sessionType}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {currentLogs.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "#64748b", padding: "24px" }}>
                        No telemetry logs available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-container">
              <div className="pagination-info">
                Showing {visitorLogs.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
                {Math.min(indexOfLastItem, visitorLogs.length)} of {visitorLogs.length} entries
              </div>

              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-number-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next <FaChevronRight />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};
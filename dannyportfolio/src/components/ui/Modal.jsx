import React, { useEffect } from "react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Hook to handle the Escape key to close the modal naturally
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset"; // Restore scrolling
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      {/* Clicking inside the modal container shouldn't close it */}
      <div style={styles.container} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button style={styles.closeButton} onClick={onClose} title="Close window">
            &times;
          </button>
        </div>
        <hr style={styles.divider} />
        <div style={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Vanilla structural theme definitions
const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  container: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "500px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    animation: "fadeIn 0.2s ease-out",
    display: "flex",
    flexDirection: "column",
    maxHeight: "90vh", // Prevent stretching beyond screen boundaries
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#111",
    fontWeight: "600",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#aaa",
    lineHeight: "1",
    padding: "0 4px",
    transition: "color 0.2s",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #eee",
    margin: 0,
  },
  body: {
    padding: "20px",
    overflowY: "auto", // Gracefully roll down if the embedded form is tall
  },
};
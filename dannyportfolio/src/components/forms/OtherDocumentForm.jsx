import React, { useState } from "react";
import "./OtherDocumentForm.css";

export const OtherDocumentForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    document_name: initialData.document_name || "",
    file: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      document_name: form.document_name,
      file: form.file,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="other-document-form">
      <input
        type="text"
        placeholder="Document Name"
        value={form.document_name}
        onChange={(e) =>
          setForm({
            ...form,
            document_name: e.target.value,
          })
        }
        required
      />

      <div className="form-divider">
        Upload Document (PDF, Word, Excel, Image, ZIP, etc.)
      </div>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,image/*"
        onChange={(e) =>
          setForm({
            ...form,
            file: e.target.files[0],
          })
        }
      />

      <button type="submit">
        {initialData.documentid ? "Update Document" : "Save Document"}
      </button>
    </form>
  );
};
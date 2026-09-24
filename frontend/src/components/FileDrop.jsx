import { useState } from "react";
import Icon from "./Icon";
import { ACCEPTED_FILE_TYPES, extensionOf, formatSize, validateFile } from "../lib/files";

export default function FileDrop({ noun, illustration, file, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const take = (picked) => {
    if (!picked) return;
    const message = validateFile(picked);
    setError(message);
    if (!message) onChange(picked);
  };

  const handleInput = (e) => {
    take(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    take(e.dataTransfer.files?.[0]);
  };

  const zoneClass = ["dropzone", dragging && "is-dragging", error && "has-error"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="file-drop">
      {file ? (
        <div className="file-card">
          <div className="file-badge" aria-hidden="true">
            {extensionOf(file.name).toUpperCase()}
          </div>
          <div className="file-meta">
            <span className="file-name">{file.name}</span>
            <span className="file-size">{formatSize(file.size)} · Added</span>
          </div>
          <label className="btn-outline">
            Replace<span className="visually-hidden"> {noun}</span>
            <input
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleInput}
              className="visually-hidden"
            />
          </label>
          <button
            type="button"
            className="icon-button"
            aria-label={`Remove ${noun}`}
            onClick={() => onChange(null)}
          >
            <Icon name="close" />
          </button>
        </div>
      ) : (
        <label
          className={zoneClass}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {illustration}
          <span className="dropzone-text">
            <span className="dropzone-title">
              Drop your {noun} here or <span className="dropzone-browse">browse files</span>
            </span>
            <span className="dropzone-hint">PDF or DOCX · up to 5 MB</span>
          </span>
          <input
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleInput}
            className="visually-hidden"
          />
        </label>
      )}

      {error && (
        <p role="alert" className="field-error">
          <Icon name="alert" size={18} />
          {error}
        </p>
      )}
    </div>
  );
}

export const ACCEPTED_FILE_TYPES = ".pdf,.docx";
const ACCEPTED_EXTENSIONS = ["pdf", "docx"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function extensionOf(name) {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

export function formatSize(bytes) {
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`;
}

// Returns an error message, or "" when the file can be uploaded.
export function validateFile(file) {
  const ext = extensionOf(file.name);
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    const found = ext ? `That’s a .${ext} file.` : "That file has no extension.";
    return `${found} Upload a PDF or DOCX instead.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `That file is ${formatSize(file.size)}. Keep it under 5 MB.`;
  }
  return "";
}

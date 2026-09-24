import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";

export async function analyzeApplication({ cv, coverLetter, url }, signal) {
  const form = new FormData();
  form.append("cv", cv);
  form.append("cover_letter", coverLetter);
  form.append("url", url);

  try {
    const res = await axios.post(`${API_URL}/api/analyze-cv`, form, { signal });
    return res.data.result;
  } catch (err) {
    if (axios.isCancel(err)) throw err;
    const message = err.response?.data?.message || err.response?.data?.error;
    throw new Error(
      message ||
        "We couldn’t reach the analysis service. Check that the backend is running and try again.",
      { cause: err }
    );
  }
}

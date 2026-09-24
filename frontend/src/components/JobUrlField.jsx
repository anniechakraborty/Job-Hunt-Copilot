import Icon from "./Icon";

function hintFor(job, error) {
  if (error) return { tone: "error", text: error };
  if (job.status === "invalid") {
    return {
      tone: "error",
      text: "That doesn’t look like a full link yet. Paste the whole address, starting with https://",
    };
  }
  if (job.blocked) {
    return {
      tone: "warning",
      text: `${job.source} usually blocks us from reading its postings. For the best results, paste the same job from the company’s career page or a job board like StepStone, Indeed or Xing.`,
    };
  }
  if (job.status === "valid") {
    return { tone: "", text: `Found a posting on ${job.source}. We’ll read it when you analyze.` };
  }
  return {
    tone: "",
    text: "Works best with company career pages and job boards like StepStone, Indeed, Xing, Greenhouse and Lever. LinkedIn links usually can’t be read.",
  };
}

export default function JobUrlField({ id, value, job, error, onChange }) {
  const hint = hintFor(job, error);
  const fieldState = error ? "invalid" : job.status;

  return (
    <>
      <div className={`url-field is-${fieldState}`}>
        <span className="url-field-icon">
          <Icon name="link" size={22} />
        </span>
        <input
          id={id}
          type="url"
          placeholder="https://careers.company.com/jobs/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={`${id}-hint`}
          aria-invalid={fieldState === "invalid"}
        />
        {job.status === "valid" && (
          <span className={`source-badge${job.blocked ? " is-warning" : ""}`}>
            <Icon name={job.blocked ? "alert" : "check"} size={16} strokeWidth={job.blocked ? 2.2 : 2.6} />
            {job.source}
          </span>
        )}
      </div>
      <p
        id={`${id}-hint`}
        role={error ? "alert" : undefined}
        aria-live="polite"
        className={`field-hint${hint.tone ? ` is-${hint.tone}` : ""}`}
      >
        {hint.tone && <Icon name="alert" size={18} />}
        <span>{hint.text}</span>
      </p>
    </>
  );
}

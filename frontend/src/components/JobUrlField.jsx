import Icon from "./Icon";

export default function JobUrlField({ id, value, job, onChange }) {
  const hint =
    job.status === "valid"
      ? `Found a posting on ${job.source}. We’ll read it when you analyze.`
      : job.status === "invalid"
        ? "That doesn’t look like a full link yet. Paste the whole address, starting with https://"
        : "Works with LinkedIn, Greenhouse, Lever, Indeed and most company career pages.";

  return (
    <>
      <div className={`url-field is-${job.status}`}>
        <span className="url-field-icon">
          <Icon name="link" size={22} />
        </span>
        <input
          id={id}
          type="url"
          placeholder="https://www.linkedin.com/jobs/view/…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={`${id}-hint`}
          aria-invalid={job.status === "invalid"}
        />
        {job.status === "valid" && (
          <span className="source-badge">
            <Icon name="check" size={16} strokeWidth={2.6} />
            {job.source}
          </span>
        )}
      </div>
      <p
        id={`${id}-hint`}
        aria-live="polite"
        className={`field-hint${job.status === "invalid" ? " is-error" : ""}`}
      >
        {hint}
      </p>
    </>
  );
}

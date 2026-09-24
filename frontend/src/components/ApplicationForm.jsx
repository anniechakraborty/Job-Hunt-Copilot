import FileDrop from "./FileDrop";
import JobUrlField from "./JobUrlField";
import Icon from "./Icon";
import { CvIllustration, LetterIllustration } from "./Illustrations";
import "../styles/form.css";

const JOB_URL_ID = "job-url";

export default function ApplicationForm({
  cv,
  onCvChange,
  coverLetter,
  onCoverLetterChange,
  url,
  onUrlChange,
  job,
  error,
  onAnalyze,
  onShowGuide,
}) {
  const urlError = error?.field === "url" ? error.message : "";
  const jobReady = job.status === "valid";
  const checklist = [
    { label: "CV", detail: cv ? cv.name : "Not added yet", done: !!cv },
    { label: "Cover letter", detail: coverLetter ? coverLetter.name : "Not added yet", done: !!coverLetter },
    { label: "Job link", detail: jobReady ? `${job.source} · ${job.host}` : "Not added yet", done: jobReady },
  ];
  const doneCount = checklist.filter((item) => item.done).length;
  const ready = doneCount === checklist.length;
  const missing = checklist
    .filter((item) => !item.done)
    .map((item) => (item.label === "CV" ? "CV" : item.label.toLowerCase()));
  const missingText =
    missing.length > 1 ? `${missing.slice(0, -1).join(", ")} and ${missing.at(-1)}` : missing[0];

  return (
    <main className="page">
      <div className="hero">
        <span className="eyebrow">New analysis</span>
        <h1 className="hero-title">
          Make your application read like it was written for <em>this</em> job.
        </h1>
        <p className="hero-lede">
          Add your CV, your cover letter and a link to the posting. You get a match score, the
          keywords you’re missing and a cover letter rewritten for the role.
        </p>
      </div>

      <div className="form-layout">
        <div className="steps">
          <Step number="01" done={!!cv} title="Your CV" description="We compare it line by line with what the job asks for.">
            <FileDrop noun="CV" illustration={<CvIllustration />} file={cv} onChange={onCvChange} />
          </Step>

          <Step
            number="02"
            done={!!coverLetter}
            title="Your cover letter"
            description="A rough draft is fine. We rewrite it around this job."
          >
            <FileDrop
              noun="cover letter"
              illustration={<LetterIllustration />}
              file={coverLetter}
              onChange={onCoverLetterChange}
            />
          </Step>

          <Step
            number="03"
            done={jobReady && !urlError}
            title="The job posting"
            titleFor={JOB_URL_ID}
            description="Paste the link from the company’s career page or a job board. We pull the requirements, skills and languages from it."
          >
            <JobUrlField id={JOB_URL_ID} value={url} job={job} error={urlError} onChange={onUrlChange} />
          </Step>
        </div>

        <aside className="summary" aria-label="Your application">
          <div className="summary-head">
            <span className="eyebrow eyebrow--muted">Your application</span>
            <span className="summary-title" aria-live="polite">
              {ready ? "Ready to analyze" : `${doneCount} of 3 added`}
            </span>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${(doneCount / 3) * 100}%` }} />
            </div>
          </div>

          <ul className="checklist">
            {checklist.map((item, i) => (
              <li key={item.label} className="checklist-item">
                <span className={`checklist-mark ${item.done ? "is-done" : "is-todo"}`}>
                  {item.done ? <Icon name="check" size={16} strokeWidth={2.8} /> : i + 1}
                </span>
                <span className="checklist-text">
                  <span className="checklist-label">{item.label}</span>
                  <span className="checklist-detail">{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>

          <button type="button" className="analyze-button" disabled={!ready} onClick={onAnalyze}>
            Analyze my application
            <Icon name="arrowRight" strokeWidth={2.2} />
          </button>
          <p className="summary-hint">
            {ready
              ? "Takes about 30 seconds: we read the job, score your CV, then rewrite your letter."
              : `Add your ${missingText} to continue.`}
          </p>

          {error && (
            <div role="alert" className="summary-error">
              <Icon name="alert" size={18} />
              <div className="summary-error-text">
                <p>
                  {urlError
                    ? "We couldn’t read the job link. See step 3 for what to try instead."
                    : error.message}
                </p>
                {!urlError && (
                  <button type="button" className="summary-error-link" onClick={onShowGuide}>
                    See a worked example of the results
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="divider" />

          <div className="benefits">
            <span className="eyebrow eyebrow--muted">What you get</span>
            <div className="benefit">
              <span className="benefit-key">A</span>
              <span>A match score and the keywords you’re missing</span>
            </div>
            <div className="benefit">
              <span className="benefit-key">B</span>
              <span>Rewritten CV bullets you can paste in</span>
            </div>
            <div className="benefit">
              <span className="benefit-key">C</span>
              <span>A cover letter tailored to the role</span>
            </div>
          </div>
        </aside>
      </div>

      <p className="privacy-note">
        <Icon name="lock" size={18} />
        Your files are only used for this analysis and aren’t saved.
      </p>
    </main>
  );
}

function Step({ number, done, title, titleFor, description, children }) {
  return (
    <section className="step">
      <div className="step-marker">
        {done ? (
          <div className="step-check">
            <Icon name="check" size={24} strokeWidth={2.4} />
          </div>
        ) : (
          <span className="step-number" aria-hidden="true">
            {number}
          </span>
        )}
      </div>
      <div className="step-body">
        <div className="step-heading">
          <h2 className="step-title">{titleFor ? <label htmlFor={titleFor}>{title}</label> : title}</h2>
          <p className="step-description">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

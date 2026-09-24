import Icon from "./Icon";
import "../styles/results.css";

const STAGES = [
  {
    title: "Reading the job posting",
    detail: "Title, level, skills, responsibilities and languages",
    headline: "Reading the job posting…",
  },
  {
    title: "Scoring your CV",
    detail: "Match score, missing keywords and rewritten bullets",
    headline: "Scoring your CV against the job…",
  },
  {
    title: "Rewriting your cover letter",
    detail: "A tailored version and a list of what changed",
    headline: "Rewriting your cover letter…",
  },
];

export default function AnalyzingView({ stage, source }) {
  const current = Math.min(stage, STAGES.length - 1);

  return (
    <main className="analyzing">
      <div className="analyzing-inner">
        <div className="analyzing-head">
          <span className="eyebrow">
            Step {current + 1} of {STAGES.length}
            {source ? ` · ${source}` : ""}
          </span>
          <h1 className="analyzing-title" aria-live="polite">
            {STAGES[current].headline}
          </h1>
          <p className="analyzing-lede">
            This usually takes about 30 seconds. You can leave this tab open in the background.
          </p>
        </div>

        <div className="progress progress--lg">
          <div
            className="progress-fill"
            style={{ width: `${((current + 0.5) / STAGES.length) * 100}%` }}
          />
        </div>

        <ol className="stage-list">
          {STAGES.map((s, i) => {
            const state = i < current ? "done" : i === current ? "active" : "pending";
            return (
              <li key={s.title} className={`stage is-${state}`}>
                <StageIcon state={state} number={i + 1} />
                <span className="stage-text">
                  <span className="stage-title">{s.title}</span>
                  <span className="stage-detail">{s.detail}</span>
                </span>
                <span className="stage-status">
                  {state === "done" ? "DONE" : state === "active" ? "WORKING" : "UP NEXT"}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

function StageIcon({ state, number }) {
  if (state === "done") {
    return (
      <span className="stage-icon is-done">
        <Icon name="check" size={18} strokeWidth={2.8} />
      </span>
    );
  }
  if (state === "active") {
    return (
      <svg className="stage-spinner" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <circle className="track" cx="16" cy="16" r="13" fill="none" strokeWidth="3" />
        <path className="arc" d="M16 3a13 13 0 0 1 13 13" fill="none" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return <span className="stage-icon is-pending">{number}</span>;
}

import { useEffect, useId, useRef, useState } from "react";
import Icon from "../Icon";
import ScoreRing from "./ScoreRing";
import "../../styles/results.css";

const TABS = [
  { id: "cv", label: "CV fixes" },
  { id: "letter", label: "Cover letter" },
  { id: "job", label: "Job details" },
];

/* ---------------- HELPERS ---------------- */

// LLM output is loosely typed: lists may hold objects, scores may be "72%" or 72.
function toText(value) {
  if (value == null) return "";
  if (typeof value === "object") return Object.values(value).map(toText).filter(Boolean).join(" – ");
  return String(value);
}

function asList(value) {
  return Array.isArray(value) ? value.map(toText).filter(Boolean) : [];
}

function parseScore(value) {
  const match = String(value ?? "").match(/\d+(\.\d+)?/);
  if (!match) return null;
  return Math.max(0, Math.min(100, Math.round(Number(match[0]))));
}

function markSkills(required, gaps) {
  const gapTerms = gaps.map((g) => g.toLowerCase()).filter((g) => g.length > 2);
  return required.map((label) => {
    const low = label.toLowerCase();
    const missing = gapTerms.some((g) => g.includes(low) || low.includes(g));
    return { label, missing };
  });
}

function scoreSummary(score, skills) {
  const missing = skills.filter((s) => s.missing).length;
  const have = skills.length - missing;

  let headline = "Score unavailable";
  if (score != null) {
    if (score >= 75) headline = "Strong match";
    else if (score >= 50) headline = missing ? `Good base, ${missing} gap${missing === 1 ? "" : "s"}` : "Good base";
    else headline = "Some work to do";
  }

  let body = "";
  if (skills.length) {
    body = `You cover ${have} of the ${skills.length} required skills.`;
    if (missing) body += " Closing the gaps is the fastest way to raise your score.";
  }
  return { headline, body };
}

/* ---------------- VIEW ---------------- */

export default function ResultsView({ result, source }) {
  const [tab, setTab] = useState("cv");
  const tabRefs = useRef({});
  const baseId = useId();

  const job = result?.job_analysis || {};
  const cv = result?.cv_analysis || {};
  const letter = result?.cover_letter || {};

  const score = parseScore(cv.match_score);
  const skills = markSkills(asList(job.skills_required), [
    ...asList(cv.missing_keywords),
    ...asList(cv.skills_to_add),
  ]);
  const summary = scoreSummary(score, skills);
  const meta = [toText(job.location), toText(job.experience_level), asList(job.language_requirements).join(", ")].filter(Boolean);

  const focusTab = (index) => {
    const next = TABS[(index + TABS.length) % TABS.length];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const handleTabKey = (e, index) => {
    if (e.key === "ArrowRight") focusTab(index + 1);
    else if (e.key === "ArrowLeft") focusTab(index - 1);
  };

  return (
    <main className="page results">
      <div className="results-head">
        <span className="eyebrow">Your results{source ? ` · ${source}` : ""}</span>
        <h1 className="results-title">{toText(job.title) || "Your application, reviewed"}</h1>
        {meta.length > 0 && (
          <ul className="results-meta">
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="overview">
        <section className="card score-card">
          <ScoreRing score={score} />
          <div className="score-text">
            <h2 className="score-headline">{summary.headline}</h2>
            {summary.body && <p className="score-body">{summary.body}</p>}
          </div>
        </section>

        <section className="card skills-card">
          <div className="skills-card-head">
            <h2 className="card-title">Required skills</h2>
            <div className="legend" aria-hidden="true">
              <span className="legend-item">
                <span className="legend-swatch is-have" />
                On your CV
              </span>
              <span className="legend-item">
                <span className="legend-swatch is-missing" />
                Missing
              </span>
            </div>
          </div>
          {skills.length ? (
            <ul className="chips">
              {skills.map((s) => (
                <li key={s.label} className={`chip ${s.missing ? "chip--missing" : "chip--have"}`}>
                  <Icon name={s.missing ? "plus" : "check"} size={16} strokeWidth={s.missing ? 2.2 : 2.6} />
                  {s.label}
                  <span className="visually-hidden">{s.missing ? " (missing)" : " (on your CV)"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No specific skills were listed in the posting.</p>
          )}
        </section>
      </div>

      <div className="tabs" role="tablist" aria-label="Result sections">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`${baseId}-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            className="tab"
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => handleTabKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-panel-${tab}`} aria-labelledby={`${baseId}-tab-${tab}`}>
        {tab === "cv" && <CvPanel cv={cv} />}
        {tab === "letter" && <LetterPanel letter={letter} />}
        {tab === "job" && <JobPanel job={job} source={source} />}
      </div>
    </main>
  );
}

/* ---------------- PANELS ---------------- */

function SectionError() {
  return (
    <p className="section-error" role="alert">
      <Icon name="alert" size={18} />
      This part of the analysis came back in an unexpected format. Run the analysis again to retry.
    </p>
  );
}

function NumberedList({ items }) {
  return (
    <ol className="numbered-list">
      {items.map((text, i) => (
        <li key={i}>
          <span className="list-number">{String(i + 1).padStart(2, "0")}</span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

function CvPanel({ cv }) {
  if (cv.error) return <SectionError />;

  const keywords = asList(cv.missing_keywords);
  const skillsToAdd = asList(cv.skills_to_add);
  const tips = asList(cv.ats_optimization_tips);
  const feedback = asList(cv.general_feedback);
  const rewrites = Array.isArray(cv.experience_improvements)
    ? cv.experience_improvements.filter((x) => x && (x.original || x.improved))
    : [];
  const summaryText = toText(cv.summary_improvement);

  return (
    <div className="panel-grid">
      <div className="panel-column">
        <section className="card">
          <div className="card-heading">
            <h2 className="card-title">Keywords to work in</h2>
            <p className="card-subtitle">In the posting, not in your CV.</p>
          </div>
          {keywords.length ? (
            <ul className="chips chips--tight">
              {keywords.map((k) => (
                <li key={k} className="chip chip--keyword">
                  {k}
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">Nothing missing. Nice work.</p>
          )}
          {skillsToAdd.length > 0 && (
            <>
              <div className="card-divider" />
              <h3 className="card-subheading">Skills worth adding</h3>
              <ul className="arrow-list">
                {skillsToAdd.map((s) => (
                  <li key={s}>
                    <Icon name="arrowRight" size={16} strokeWidth={2.2} />
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="card">
          <h2 className="card-title">Get past the ATS</h2>
          {tips.length ? <NumberedList items={tips} /> : <p className="empty-note">No tips this time.</p>}
        </section>

        {feedback.length > 0 && (
          <section className="card">
            <h2 className="card-title">Overall feedback</h2>
            <NumberedList items={feedback} />
          </section>
        )}
      </div>

      <div className="panel-column">
        <section className="card">
          <div className="card-heading">
            <h2 className="card-title">Rewritten experience bullets</h2>
            <p className="card-subtitle">Check any numbers before you paste these in.</p>
          </div>
          {rewrites.length ? (
            rewrites.map((x, i) => (
              <div key={i} className="rewrite">
                {x.original && (
                  <div className="rewrite-row">
                    <span className="rewrite-label">BEFORE</span>
                    <span className="rewrite-before">{toText(x.original)}</span>
                  </div>
                )}
                <div className="rewrite-row">
                  <span className="rewrite-label is-after">AFTER</span>
                  <span className="rewrite-after">{toText(x.improved)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-note">No bullet rewrites suggested.</p>
          )}
        </section>

        {summaryText && (
          <section className="card">
            <h2 className="card-title">A sharper summary</h2>
            <p className="serif-copy">{summaryText}</p>
          </section>
        )}
      </div>
    </div>
  );
}

function LetterPanel({ letter }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (letter.error) return <SectionError />;

  const text = toText(letter.improved_version);
  const changes = asList(letter.key_changes);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="panel-split">
      <section className="card letter-card">
        <div className="letter-card-head">
          <span className="eyebrow eyebrow--muted">Your cover letter, rewritten</span>
          {text && (
            <button type="button" className="btn-primary" onClick={copy}>
              <Icon name={copied ? "check" : "copy"} size={18} />
              <span aria-live="polite">{copied ? "Copied" : "Copy letter"}</span>
            </button>
          )}
        </div>
        {text ? <p className="letter-body">{text}</p> : <p className="empty-note">No rewritten letter came back.</p>}
      </section>

      <section className="card changes-card">
        <h2 className="card-title">What changed</h2>
        {changes.length ? <NumberedList items={changes} /> : <p className="empty-note">No changes listed.</p>}
      </section>
    </div>
  );
}

function JobPanel({ job, source }) {
  if (job.error) return <SectionError />;

  const responsibilities = asList(job.key_responsibilities);
  const tools = asList(job.tools_technologies);
  const facts = [
    ["LEVEL", toText(job.experience_level)],
    ["LOCATION", toText(job.location)],
    ["LANGUAGES", asList(job.language_requirements).join(", ")],
    ["SOURCE", source],
  ].filter(([, v]) => v);

  return (
    <div className="panel-grid panel-grid--3">
      <section className="card">
        <h2 className="card-title">What you’d do</h2>
        {responsibilities.length ? (
          <ul className="dot-list">
            {responsibilities.map((r) => (
              <li key={r}>
                <span className="dot" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-note">No responsibilities listed.</p>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">Tools and technologies</h2>
        {tools.length ? (
          <ul className="chips chips--tight">
            {tools.map((t) => (
              <li key={t} className="chip chip--tool">
                {t}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-note">None listed.</p>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">The basics</h2>
        {facts.length ? (
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k} className="fact">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="empty-note">No details found.</p>
        )}
      </section>
    </div>
  );
}

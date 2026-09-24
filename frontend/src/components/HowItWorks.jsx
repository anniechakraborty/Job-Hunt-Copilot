import Icon from "./Icon";
import "../styles/form.css";
import "../styles/guide.css";

const SHOTS = `${import.meta.env.BASE_URL}how-it-works/`;

const STEPS = [
  {
    image: "01-add-files.png",
    title: "Add your CV, cover letter and the job link",
    body: "Drop in your files (PDF or DOCX) and paste a link from the company’s career page or a job board. Each step checks off as you fill it in, and the Analyze button unlocks when all three are in.",
    alt: "The form with a CV and a cover letter attached, a StepStone job link pasted, and the side panel showing Ready to analyze.",
  },
  {
    image: "02-analyzing.png",
    title: "Give it about 30 seconds",
    body: "Three AI passes run one after another: reading the job posting, scoring your CV against it, then rewriting your cover letter.",
    alt: "The analyzing screen on step 2 of 3, Scoring your CV against the job, with the first step marked done.",
  },
  {
    image: "03-results.png",
    title: "See how well you match",
    body: "Your match score and the job’s required skills come first. Skills already on your CV are filled in; missing ones are dashed with a plus.",
    alt: "The results page for a Frontend Engineer role with a 68% match score and eight required skills, three of them marked missing.",
  },
  {
    image: "04-cv-fixes.png",
    title: "Fix your CV",
    body: "Keywords to work in, tips for getting past applicant tracking systems, and before-and-after rewrites of your experience bullets.",
    alt: "The CV fixes tab with missing keywords, ATS tips, rewritten experience bullets and a sharper summary.",
  },
  {
    image: "05-cover-letter.png",
    title: "Use the rewritten cover letter",
    body: "Copy the tailored letter in one click, and see what changed and why.",
    alt: "The Cover letter tab with the rewritten letter, a Copy letter button and a numbered list of what changed.",
  },
  {
    image: "06-job-details.png",
    title: "Check the job details",
    body: "What the role involves, the tools it uses, and the basics: level, location and languages.",
    alt: "The Job details tab listing responsibilities, tools and technologies, and the role’s level, location and languages.",
  },
];

export default function HowItWorks({ onStart }) {
  return (
    <main className="page guide">
      <div className="hero">
        <span className="eyebrow">How it works</span>
        <h1 className="hero-title guide-title">From three inputs to a tailored application.</h1>
        <p className="hero-lede">
          Here’s a full run from start to finish, so you know what to expect, even if the live
          analysis runs into an error.
        </p>
        <p className="guide-note">
          <Icon name="alert" size={18} />
          These screenshots show a worked example with sample files for a Frontend Engineer role.
        </p>
      </div>

      <ol className="guide-steps">
        {STEPS.map((step, i) => (
          <li key={step.image} className="guide-step">
            <div className="guide-step-text">
              <span className="guide-step-number">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="guide-step-title">{step.title}</h2>
              <p className="guide-step-body">{step.body}</p>
            </div>
            <figure className="guide-shot">
              <a href={`${SHOTS}${step.image}`} target="_blank" rel="noreferrer" title="Open full size">
                <img src={`${SHOTS}${step.image}`} alt={step.alt} loading="lazy" />
              </a>
            </figure>
          </li>
        ))}
      </ol>

      <div className="guide-cta">
        <button type="button" className="analyze-button" onClick={onStart}>
          Try it with your own files
          <Icon name="arrowRight" strokeWidth={2.2} />
        </button>
      </div>
    </main>
  );
}

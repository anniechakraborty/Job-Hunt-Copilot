import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import ApplicationForm from "./components/ApplicationForm";
import AnalyzingView from "./components/AnalyzingView";
import ResultsView from "./components/results/ResultsView";
import Icon from "./components/Icon";
import { analyzeApplication } from "./api";
import { parseJobUrl } from "./lib/jobUrl";

// The API answers once at the end, so the three stages advance on a timer
// (and hold on the last one until the response arrives).
const STAGE_INTERVAL_MS = 8000;

export default function App() {
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [url, setUrl] = useState("");
  const [screen, setScreen] = useState("form"); // "form" | "analyzing" | "results"
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const requestRef = useRef(null);

  const job = parseJobUrl(url);

  useEffect(() => {
    if (screen !== "analyzing") return;
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, 2)), STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [screen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const analyze = async () => {
    if (!cv || !coverLetter || job.status !== "valid") return;

    const controller = new AbortController();
    requestRef.current = controller;
    setError("");
    setStage(0);
    setScreen("analyzing");

    try {
      const data = await analyzeApplication({ cv, coverLetter, url: job.url }, controller.signal);
      setResult(data);
      setScreen("results");
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err.message);
      setScreen("form");
    }
  };

  const cancel = () => {
    requestRef.current?.abort();
    setScreen("form");
  };

  return (
    <div className="app">
      <Header>
        {screen === "analyzing" && (
          <button type="button" className="btn-outline" onClick={cancel}>
            Cancel
          </button>
        )}
        {screen === "results" && (
          <button type="button" className="btn-outline" onClick={() => setScreen("form")}>
            <Icon name="arrowLeft" size={18} />
            New analysis
          </button>
        )}
      </Header>

      {screen === "form" && (
        <ApplicationForm
          cv={cv}
          onCvChange={setCv}
          coverLetter={coverLetter}
          onCoverLetterChange={setCoverLetter}
          url={url}
          onUrlChange={setUrl}
          job={job}
          error={error}
          onAnalyze={analyze}
        />
      )}
      {screen === "analyzing" && <AnalyzingView stage={stage} source={job.source} />}
      {screen === "results" && <ResultsView result={result} source={job.source} />}
    </div>
  );
}

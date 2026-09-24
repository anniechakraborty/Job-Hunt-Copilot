const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ score }) {
  const filled = score == null ? 0 : (CIRCUMFERENCE * score) / 100;

  return (
    <div
      className="score-ring"
      role="img"
      aria-label={score == null ? "Match score unavailable" : `${score}% match with this job`}
    >
      <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
        <circle className="track" cx="66" cy="66" r={RADIUS} fill="none" strokeWidth="12" />
        <circle
          className="arc"
          cx="66"
          cy="66"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
        />
      </svg>
      <div className="score-ring-label" aria-hidden="true">
        <span className="score-value">
          {score ?? "–"}
          {score != null && <small>%</small>}
        </span>
        <span className="score-caption">MATCH</span>
      </div>
    </div>
  );
}

export function CvIllustration() {
  return (
    <svg className="dropzone-illustration" width="64" height="76" viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <rect className="ill-tint" x="10" y="6" width="44" height="60" rx="5" transform="rotate(-8 32 36)" stroke="#1c1b19" strokeWidth="1.5" />
      <rect x="10" y="9" width="44" height="60" rx="5" fill="#fffdf8" stroke="#1c1b19" strokeWidth="2" />
      <circle className="ill-accent" cx="22" cy="23" r="5" />
      <path d="M31 21h15M31 26h10M18 39h28M18 46h28M18 53h18" stroke="#1c1b19" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LetterIllustration() {
  return (
    <svg className="dropzone-illustration" width="64" height="76" viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <rect className="ill-tint" x="6" y="32" width="52" height="38" rx="5" stroke="#1c1b19" strokeWidth="2" />
      <rect x="14" y="6" width="36" height="48" rx="4" fill="#fffdf8" stroke="#1c1b19" strokeWidth="2" />
      <path className="ill-accent-stroke" d="M20 16h18M20 23h24M20 30h24" strokeWidth="2.5" strokeLinecap="round" />
      <path
        className="ill-tint"
        d="M6 37v28a5 5 0 0 0 5 5h42a5 5 0 0 0 5-5V37L32 55z"
        stroke="#1c1b19"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

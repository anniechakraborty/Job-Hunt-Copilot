export default function Header({ children }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand">
          <svg className="brand-mark" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="28" height="28" rx="8" />
            <path
              d="M9.5 15.5l3.6 3.6 7.4-8.2"
              stroke="#fffdf8"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="brand-name">Job Hunt Copilot</span>
        </div>
        {children}
      </div>
    </header>
  );
}

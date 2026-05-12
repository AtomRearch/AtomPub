// Shared UI atoms — used across all views
const { useState, useEffect, useRef, useMemo } = React;

// ====== Brand mark / logo ======
function BrandMark({ size = 22 }) {
  return (
    <span className="brand__mark" style={{ width: size, height: size, fontSize: size * 0.55 }}>
      <svg viewBox="0 0 22 22" width={size} height={size} aria-hidden="true">
        <circle cx="11" cy="11" r="2.2" fill="#fff" />
        <ellipse cx="11" cy="11" rx="9" ry="3.2" stroke="#fff" strokeWidth="1" fill="none" />
        <ellipse cx="11" cy="11" rx="9" ry="3.2" stroke="#fff" strokeWidth="1" fill="none" transform="rotate(60 11 11)" />
        <ellipse cx="11" cy="11" rx="9" ry="3.2" stroke="#fff" strokeWidth="1" fill="none" transform="rotate(120 11 11)" />
      </svg>
    </span>
  );
}

// ====== Multiscale badge ======
function ScaleBadge({ scale, compact = false }) {
  // atom = 1 dot blue, meso = 2 dots gold, macro = 3 dots
  const config = {
    atom:  { dots: [1, 0, 0], color: "is-on", label: "ATOM" },
    meso:  { dots: [1, 1, 0], color: "is-on--gold", label: "MESO" },
    macro: { dots: [1, 1, 1], color: "is-on", label: "MACRO" },
  }[scale];
  if (!config) return null;
  return (
    <span className="scale-badge" title={`Multiscale: ${config.label}`}>
      <span className="scale-badge__dots">
        {config.dots.map((on, i) => (
          <span key={i} className={`scale-badge__dot ${on ? config.color : ""}`} />
        ))}
      </span>
      {!compact && <span style={{ color: "var(--fg-muted)" }}>{config.label}</span>}
    </span>
  );
}

// ====== Sparkline ======
function Spark({ values, w = 80, h = 24, color = "var(--c-kinetic)", area = false }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = "M" + pts.join(" L");
  const areaD = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {area && <path d={areaD} fill={color} opacity="0.12" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.25" />
    </svg>
  );
}

// ====== Animated counter (live feel) ======
function LiveNumber({ base, drift = 1, decimals = 0, prefix = "", suffix = "" }) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV(b => Math.max(0, b + (Math.random() - 0.45) * drift));
    }, 1800);
    return () => clearInterval(id);
  }, [drift]);
  const display = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString();
  return <span>{prefix}{display}{suffix}</span>;
}

// ====== Ticker rail ======
function TickerRail() {
  const items = window.AtomData.ticker;
  const doubled = [...items, ...items]; // for seamless scroll
  return (
    <div className="ticker-rail">
      <div className="ticker">
        {doubled.map((row, i) => (
          <span key={i} className="ticker__item">
            <span className="ticker__sym">{row[0]}</span>
            <span className="ticker__val">{row[1]}</span>
            <span className={`ticker__delta ${row[3]}`}>{row[2]}</span>
            <span style={{ color: "var(--c-space-400)" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ====== Theme toggle (light <-> dark) ======
function ThemeToggle() {
  const [theme, setTheme] = React.useState(() => {
    return document.documentElement.getAttribute("data-theme") || "light";
  });
  const flip = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("atompub-theme", next); } catch (e) {}
  };
  const isLight = theme === "light";
  return (
    <button className="theme-toggle" onClick={flip}
            title={isLight ? "Switch to dark terminal" : "Switch to light reader"}>
      <span className="theme-toggle__icon" aria-hidden="true">
        {isLight ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="8" cy="8" r="3"/>
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11 1.5a6.5 6.5 0 1 0 3.5 11.9A5.5 5.5 0 0 1 11 1.5z"/>
          </svg>
        )}
      </span>
      <span>{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}

// ====== Top nav ======
function TopNav({ view, onView }) {
  const items = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "MSEDsBench" },
    { id: "article", label: "Article" },
    { id: "submit", label: "Submit" },
    { id: "review", label: "Review" },
  ];
  return (
    <header className="topnav">
      <div className="shell topnav__inner">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); onView("home"); }}>
          <BrandMark />
          <span>AtomPub</span>
          <span className="brand__journal">Vol. 04 · ISSN 3027-1188</span>
        </a>
        <nav className="nav">
          {items.map(it => (
            <a key={it.id} href="#"
               className={`nav__item ${view === it.id ? "is-active" : ""}`}
               onClick={(e) => { e.preventDefault(); onView(it.id); }}>
              {it.label}
            </a>
          ))}
        </nav>
        <div className="nav__right">
          <div className="nav__search">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" />
              <path d="M11 11l3 3" stroke="currentColor" strokeLinecap="round" />
            </svg>
            <input placeholder="Search papers, materials, DOIs…" />
            <span className="kbd">⌘K</span>
          </div>
          <ThemeToggle />
          <button className="btn btn--ghost btn--sm">Sign in</button>
          <button className="btn btn--primary btn--sm" onClick={() => onView("submit")}>Submit</button>
        </div>
      </div>
      <TickerRail />
    </header>
  );
}

// ====== Footer ======
function Footer() {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__col">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <BrandMark size={20} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>AtomPub</span>
          </div>
          <p style={{ color: "var(--fg-muted)", fontSize: 12, lineHeight: 1.55, margin: 0, maxWidth: 320 }}>
            The publishing layer of the AtomRearch ecosystem.
            Standardized, machine-readable, reviewer-verified science for
            multiscale energy materials.
          </p>
          <div className="mono dim" style={{ fontSize: 10.5, marginTop: 16, letterSpacing: ".12em" }}>
            ISSN 3027-1188 · DOI prefix 10.55881
          </div>
        </div>
        <div className="foot__col">
          <h5>Journal</h5>
          <ul>
            <li><a href="#">Latest Issue</a></li>
            <li><a href="#">Archive</a></li>
            <li><a href="#">Editorial Board</a></li>
            <li><a href="#">Aims & Scope</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h5>Authors</h5>
          <ul>
            <li><a href="#">Submission Guide</a></li>
            <li><a href="#">.qmd Template</a></li>
            <li><a href="#">Data Standards</a></li>
            <li><a href="#">Open Access</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h5>Bench</h5>
          <ul>
            <li><a href="#">MSEDsBench</a></li>
            <li><a href="#">Data Sprints</a></li>
            <li><a href="#">Protocols</a></li>
            <li><a href="#">AtomAgent</a></li>
          </ul>
        </div>
        <div className="foot__col">
          <h5>About</h5>
          <ul>
            <li><a href="#">AtomRearch</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="foot__legal">
        <span>© 2026 AtomRearch. All rights reserved.</span>
        <span>Quarto-rendered · CC-BY 4.0 unless noted</span>
      </div>
    </footer>
  );
}

Object.assign(window, { BrandMark, ScaleBadge, Spark, LiveNumber, TickerRail, TopNav, Footer, ThemeToggle });

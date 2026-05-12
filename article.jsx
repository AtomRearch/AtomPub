// Article view — Rich HTML paper with sticky sidebar + interactive data windows
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const ArticleSidebar = () => {
  const sections = [
    { id: "abstract", label: "Abstract" },
    { id: "intro", label: "1. Introduction" },
    { id: "methods", label: "2. Methods · Cell Construction" },
    { id: "results", label: "3. Results" },
    { id: "fig1", label: "  ↳ Figure 1 · Cycle Drift" },
    { id: "fig2", label: "  ↳ Figure 2 · ED Map" },
    { id: "discussion", label: "4. Discussion" },
    { id: "data", label: "Data Access" },
    { id: "refs", label: "References" },
  ];
  const [active, setActive] = useStateA("abstract");
  return (
    <aside style={{
      position: "sticky", top: 100, alignSelf: "start",
      borderLeft: "1px solid var(--line)", paddingLeft: 18,
      display: "flex", flexDirection: "column", gap: 22,
      maxHeight: "calc(100vh - 120px)", overflow: "auto",
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Contents</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {sections.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setActive(s.id)}
                 style={{
                   display: "block", padding: "4px 8px",
                   borderLeft: `2px solid ${active === s.id ? "var(--c-kinetic)" : "transparent"}`,
                   color: active === s.id ? "var(--fg)" : "var(--fg-muted)",
                   fontSize: 12, marginLeft: -10,
                 }}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Data Access</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ Raw cycler data · 412 MB</a>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ XRD operando · 1.2 GB</a>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ Methods bundle (.qmd)</a>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ Verified replication kit</a>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Cite</div>
        <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", padding: 10, background: "var(--c-space-800)", border: "1px solid var(--line)", lineHeight: 1.55 }}>
          Hara, K. et al. (2026).<br/>
          AtomPub <span className="gold">10.55881/atp-2026-0148</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
          <button className="btn btn--sm">BibTeX</button>
          <button className="btn btn--sm">RIS</button>
          <button className="btn btn--sm btn--ghost">Copy DOI</button>
        </div>
      </div>

      <div>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Metrics</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div className="mono" style={{ fontSize: 18 }}>12.4k</div>
            <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>READS</div>
          </div>
          <div>
            <div className="mono gold" style={{ fontSize: 18 }}>38</div>
            <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>CITES</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 18 }}>614</div>
            <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>DL · KIT</div>
          </div>
          <div>
            <div className="mono pos" style={{ fontSize: 18 }}>99.4%</div>
            <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>VERIFIED</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

const InlineFigure = ({ id, title, num }) => {
  const [hover, setHover] = useStateA(null);
  const data = useRefA(Array.from({ length: 40 }, (_, i) => 580 + Math.sin(i * 0.32) * 15 + i * 0.4 + Math.random() * 4)).current;
  const w = 640, h = 240;
  const min = Math.min(...data) - 4;
  const max = Math.max(...data) + 4;
  const span = max - min;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / span) * h;
    return [x, y];
  });
  const d = "M" + pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" L");
  return (
    <figure className="figure" id={id}>
      <div className="figure__hd">
        <span>FIG {num} · {title}</span>
        <span style={{ display: "flex", gap: 10 }}>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ CSV</a>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↓ PNG</a>
          <a href="#" style={{ color: "var(--c-kinetic)" }}>↗ Interactive</a>
        </span>
      </div>
      <div style={{ padding: 16, position: "relative" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - 16;
          const idx = Math.round((x / (rect.width - 32)) * (data.length - 1));
          if (idx >= 0 && idx < data.length) setHover({ idx, x: e.clientX - rect.left, y: e.clientY - rect.top, v: data[idx] });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          {[0.25, 0.5, 0.75].map(t => (
            <line key={t} x1="0" x2={w} y1={t * h} y2={t * h} stroke="var(--line)" strokeDasharray="2 4" />
          ))}
          <line x1="0" x2={w} y1={h - ((612 - min) / span) * h} y2={h - ((612 - min) / span) * h}
                stroke="var(--c-gold)" strokeDasharray="3 4" opacity="0.7" />
          <path d={`${d} L${w},${h} L0,${h} Z`} fill="var(--c-kinetic)" opacity="0.10" />
          <path d={d} fill="none" stroke="var(--c-kinetic)" strokeWidth="1.4" />
          {hover && (
            <g>
              <line x1={(hover.idx / (data.length - 1)) * w} x2={(hover.idx / (data.length - 1)) * w}
                    y1="0" y2={h} stroke="var(--c-gold)" strokeDasharray="2 3" />
              <circle cx={(hover.idx / (data.length - 1)) * w}
                      cy={h - ((data[hover.idx] - min) / span) * h}
                      r="3" fill="var(--c-gold)" />
            </g>
          )}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-dim)" }}>
          <span>cycle 0</span><span>cycle 100</span><span>cycle 200</span><span>cycle 312</span>
        </div>
        {hover && (
          <div className="tip" style={{ left: hover.x + 12, top: hover.y - 36 }}>
            <div className="tip__lbl">Cycle {Math.round((hover.idx / (data.length - 1)) * 312)}</div>
            <div className="tip__val">{hover.v.toFixed(2)} Wh/kg</div>
          </div>
        )}
      </div>
      <div className="figure__cap">
        <strong style={{ color: "var(--fg)" }}>Fig. {num}.</strong> {title}. Discharge ED across 312 cycles at 25 °C; gold dashed line marks 612 Wh/kg pack-EV target. Hover for per-cycle values. Source: <span className="mono gold">DOI 10.55881/atp-2026-0148/fig{num}</span>
      </div>
    </figure>
  );
};

const ArticleView = () => (
  <main>
    <div style={{ borderBottom: "1px solid var(--line)", padding: "32px var(--gutter) 28px", background: "var(--c-space-800)" }}>
      <div className="shell">
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
          <span className="badge badge--scale-atom">ATOM SCALE</span>
          <span className="badge badge--verified">AGENT-VERIFIED</span>
          <span className="badge badge--peer">3 / 3 REVIEWERS</span>
          <span className="mono dim" style={{ fontSize: 11, letterSpacing: ".06em", marginLeft: "auto" }}>
            Vol. 04 · Issue 09 · Article atp-2026-0148 · Published May 04 2026
          </span>
        </div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 38, lineHeight: 1.12, letterSpacing: "-.01em", fontWeight: 500, margin: "0 0 14px", maxWidth: 920 }}>
          Electrolyte Coalescence in Li-S Cells under Cryogenic Drift: A 312-Cycle Verification at 612 Wh/kg
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", color: "var(--fg-muted)", fontSize: 13, marginBottom: 14 }}>
          <span><strong style={{ color: "var(--fg)" }}>K. Hara</strong><sup style={{ color: "var(--c-kinetic)" }}>1,2</sup></span>
          <span><strong style={{ color: "var(--fg)" }}>D. Volkov</strong><sup style={{ color: "var(--c-kinetic)" }}>1</sup></span>
          <span><strong style={{ color: "var(--fg)" }}>L. Chen</strong><sup style={{ color: "var(--c-kinetic)" }}>3</sup></span>
          <span><strong style={{ color: "var(--fg)" }}>+ 4 authors</strong></span>
          <span style={{ color: "var(--fg-dim)" }}>·</span>
          <span><sup className="kinetic">1</sup> Tsinghua University</span>
          <span><sup className="kinetic">2</sup> Argonne National Lab</span>
          <span><sup className="kinetic">3</sup> AtomRearch Lab</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn--primary btn--sm">↓ Download PDF</button>
          <button className="btn btn--sm">↓ Methods bundle (.qmd)</button>
          <button className="btn btn--sm btn--gold">View on MSEDsBench →</button>
          <button className="btn btn--sm btn--ghost">Cite</button>
          <button className="btn btn--sm btn--ghost">Share</button>
        </div>
      </div>
    </div>

    <div className="shell" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px", gap: 56, padding: "44px 24px 80px", alignItems: "start" }}>
      <article className="article-body">
        <h2 id="abstract">Abstract</h2>
        <p>
          We report a Li-S cell architecture (G3-η) achieving <strong className="gold">612.4 Wh/kg pack-equivalent
          energy density</strong> over 312 cycles at 25 °C, with cryogenic drift behavior that diverges from
          published continuum models below 0 °C. The result is the first <em className="term">MSEDsBench</em>-anchored
          publication to surpass the 612 Wh/kg pack-EV threshold while passing AtomAgent's
          full verification gate (99.7% reproducibility across two independent labs)<sup>1</sup>.
        </p>

        <h2 id="intro">1. Introduction</h2>
        <p>
          Lithium-sulfur chemistries have promised pack-level densities above 600 Wh/kg for nearly
          two decades<sup>2,3</sup>, yet practical cells routinely degrade below 400 Wh/kg within
          200 cycles due to polysulfide shuttling. Here we revisit the role of <em className="term">electrolyte coalescence</em> —
          the spontaneous merging of electrolyte microdomains under thermal drift — as a previously
          under-reported contributor to capacity stability.
        </p>

        <h2 id="methods">2. Methods · Cell Construction</h2>
        <p>
          Coin cells (CR2032) were assembled following <em className="term">P-COIN-32</em> v3.2 in an Ar glovebox
          (≤ 0.5 ppm O₂ / H₂O). Cathodes employed an η-graphene matrix with 78 wt% S loading. The full
          methods bundle, including raw .qmd, executable cell-build script, and operando XRD frames,
          is available at <span className="mono kinetic">DOI 10.55881/atp-2026-0148/methods</span>.
        </p>
        <div className="eq">
          <span>η<sub>coal</sub> = 1 − exp(−κ · ΔT / τ<sub>shuttle</sub>) · ⟨φ<sub>e</sub>⟩</span>
          <span className="eq__num">(1)</span>
        </div>
        <p>
          where κ is the empirical coalescence rate constant (Tab. 2), ΔT is thermal drift across one
          cycle, τ<sub>shuttle</sub> is the polysulfide shuttling time-constant, and ⟨φ<sub>e</sub>⟩
          the volume-averaged electrolyte fraction.
        </p>

        <h2 id="results">3. Results</h2>
        <InlineFigure id="fig1" num="1" title="Discharge ED vs. cycle count, 25 °C" />
        <p>
          Figure 1 shows pack-equivalent ED stable above 590 Wh/kg through cycle 312, with mean
          fade rate of <strong>0.041%/cycle</strong> — an order of magnitude below the literature
          envelope for comparable Li-S geometries<sup>4</sup>.
        </p>
        <InlineFigure id="fig2" num="2" title="Coalescence energy map · ΔT × electrolyte fraction" />
        <p>
          Crucially, below −10 °C, the coalescence regime described by Eq. 1 inverts: ED <em>increases</em>
          with thermal drift before the established cliff at −22 °C. This violates the monotonic
          decay assumed in <em className="term">Liu &amp; Park (2023)</em> and motivates the cryogenic
          extension of <span className="mono kinetic">P-CYCL-08</span> to v0.9.
        </p>

        <h2 id="discussion">4. Discussion</h2>
        <p>
          The 612.4 Wh/kg result is, to our knowledge, the highest pack-equivalent ED for any Li-S
          chemistry to clear AtomAgent's verification gate at full statistical power.
          We caution that the cryogenic inversion is observed only in the η-graphene matrix; replication
          attempts in commercial KB-carbon hosts <em>did not</em> reproduce the effect (kit DS-117 / E-12).
        </p>

        <h2 id="data">Data Access</h2>
        <p>
          All raw cycler traces, operando XRD frames, and the executable methods bundle are deposited
          in the AtomPub Data Vault under <span className="mono kinetic">10.55881/atp-2026-0148</span>.
          Replication kits ship via the open <em className="term">AtomDraft</em> CLI:
        </p>
        <div className="eq" style={{ borderLeftColor: "var(--c-gold)" }}>
          <span>$ atomdraft pull 10.55881/atp-2026-0148 --kit replication</span>
          <span className="eq__num">CLI</span>
        </div>

        <h2 id="refs">References</h2>
        <ol style={{ paddingLeft: 18, fontSize: 13.5, color: "var(--fg-muted)", lineHeight: 1.7 }}>
          <li>AtomAgent. <em>Verification gate v4 specification</em>. AtomRearch Tech. Rep. AR-VG-4.0 (2026).</li>
          <li>Manthiram, A. et al. <em>Chem. Rev.</em> <strong>114</strong>, 11751 (2014).</li>
          <li>Bruce, P. G. et al. <em>Nature Mater.</em> <strong>11</strong>, 19 (2012).</li>
          <li>Liu, J. &amp; Park, S. <em>Joule</em> <strong>7</strong>, 410 (2023).</li>
        </ol>
      </article>
      <ArticleSidebar />
    </div>
  </main>
);

window.ArticleView = ArticleView;

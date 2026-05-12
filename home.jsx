// Home view — AtomPub journal portal
const HomeHero = () => {
  const top3 = window.AtomData.leaderboard.slice(0, 6);
  return (
    <section className="hero bg-grid">
      <div className="shell hero__grid">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="dot-pulse" /> Live · Vol. 04 · Issue 09 · May 2026
          </div>
          <h1>
            Publishing the <span className="accent">verified maximum</span> of energy density science.
          </h1>
          <p className="hero__lede">
            AtomPub is the publishing arm of AtomRearch — a Quarto-native journal where every
            paper ships with raw data, executable methods, and an MSEDsBench-anchored result.
            We don't print PDFs. We deposit standardized, machine-readable scientific assets.
          </p>
          <div className="hero__cta">
            <button className="btn btn--primary">Browse Vol. 04 ›</button>
            <button className="btn">Submit a Manuscript</button>
            <button className="btn btn--gold">View MSEDsBench ↗</button>
          </div>
          <div className="hero__meta">
            <div className="hero__metaitem">
              <span className="v"><LiveNumber base={1284} drift={2} /></span>
              <span className="l">Submissions YTD</span>
            </div>
            <div className="hero__metaitem">
              <span className="v">41.7%</span>
              <span className="l">Acceptance Rate</span>
            </div>
            <div className="hero__metaitem">
              <span className="v gold">12.8</span>
              <span className="l">Impact Factor (2025)</span>
            </div>
            <div className="hero__metaitem">
              <span className="v"><LiveNumber base={99.41} drift={0.05} decimals={2} suffix="%" /></span>
              <span className="l">AtomAgent Verification</span>
            </div>
          </div>
        </div>

        <div className="leadercard">
          <div className="leadercard__hd">
            <div>
              <div className="eyebrow">MSEDsBench · Global Top Cells</div>
              <div style={{ fontSize: 14, marginTop: 4, fontWeight: 500 }}>
                Pack-Equivalent Energy Density · Wh/kg
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="dot-pulse" />
              <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>LIVE 09:42:18 UTC</span>
            </div>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr 80px 80px 80px",
            padding: "8px 16px",
            borderBottom: "1px solid var(--line)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "var(--fg-dim)",
          }}>
            <span>#</span><span>Material / Lab</span><span style={{ textAlign: "right" }}>Wh/kg</span>
            <span style={{ textAlign: "right" }}>Δ 30d</span><span style={{ textAlign: "right" }}>Trend</span>
          </div>
          {top3.map((r) => (
            <div key={r.rank} className="leadercard__row">
              <span className={`leadercard__rank is-${r.rank}`}>{String(r.rank).padStart(2, "0")}</span>
              <div className="leadercard__name">
                <span className="n">
                  {r.name}
                  {r.verified && <span style={{ marginLeft: 8, color: "var(--c-pos)", fontSize: 10 }}>● VERIFIED</span>}
                </span>
                <span className="o">{r.org} · <ScaleBadge scale={r.scale} compact /></span>
              </div>
              <span className="leadercard__col" style={{ color: r.rank === 1 ? "var(--c-gold)" : "var(--fg)" }}>
                {r.ed.toFixed(1)}
              </span>
              <span className={`leadercard__col ${r.change >= 0 ? "pos" : "neg"}`}>
                {r.change >= 0 ? "+" : ""}{r.change.toFixed(1)}
              </span>
              <span className="leadercard__col">
                <Spark
                  values={Array.from({ length: 14 }, (_, i) =>
                    r.ed + Math.sin(i * 0.7 + r.rank) * 6 + r.change * (i / 13)
                  )}
                  color={r.change >= 0 ? "var(--c-pos)" : "var(--c-neg)"}
                  w={64} h={18}
                />
              </span>
            </div>
          ))}
          <div style={{
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg-dim)",
          }}>
            <span>Tracking 1,847 cells · 312 labs · 47 countries</span>
            <a href="#" style={{ color: "var(--c-kinetic)" }}>Open full bench →</a>
          </div>
        </div>
      </div>
    </section>
  );
};

const LiveDashboardWidget = () => (
  <section className="section">
    <div className="shell">
      <div className="section__head">
        <div>
          <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="dot-pulse" /> Live Dashboard · refreshed every 1.8s
          </div>
          <h2 className="section__title">The journal, instrumented.</h2>
          <p className="section__sub">Editorial throughput, agent verification and benchmark drift — public, in real time.</p>
        </div>
        <button className="btn btn--ghost btn--sm">Open public API ↗</button>
      </div>
      <div className="live">
        <div className="live__cell">
          <div className="live__lbl">In-Review</div>
          <div className="live__val"><LiveNumber base={327} drift={1.4} /></div>
          <div className="live__sub">↓ 4 since 09:00 UTC · median age 11d</div>
        </div>
        <div className="live__cell">
          <div className="live__lbl">Agent Verification Pass-Rate</div>
          <div className="live__val gold"><LiveNumber base={99.41} drift={0.04} decimals={2} suffix="%" /></div>
          <div className="live__sub">target ≥ 99.20% · trailing 7d</div>
        </div>
        <div className="live__cell">
          <div className="live__lbl">Reviewers Online</div>
          <div className="live__val"><LiveNumber base={184} drift={0.8} /></div>
          <div className="live__sub">42 disciplines · 28 countries</div>
        </div>
        <div className="live__cell">
          <div className="live__lbl">MSED-IDX</div>
          <div className="live__val">612.40</div>
          <div className="live__sub pos">+0.83% · new high</div>
        </div>
      </div>
    </div>
  </section>
);

const LatestResearch = () => {
  const items = window.AtomData.research;
  return (
    <section className="section">
      <div className="shell">
        <div className="section__head">
          <div>
            <div className="eyebrow">Latest Research · Vol. 04 / Issue 09</div>
            <h2 className="section__title">Fresh from peer review.</h2>
            <p className="section__sub">Rich HTML articles. Every paper has a benchmark anchor and an executable methods bundle.</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn--sm">All Scales</button>
            <button className="btn btn--sm btn--ghost">Atom</button>
            <button className="btn btn--sm btn--ghost">Meso</button>
            <button className="btn btn--sm btn--ghost">Macro</button>
          </div>
        </div>
        <div className="research-grid">
          {items.map(p => (
            <article key={p.id} className="research-card">
              <div className="research-card__top">
                <ScaleBadge scale={p.scale} />
                <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".06em" }}>{p.id}</span>
              </div>
              <h3 className="research-card__title">{p.title}</h3>
              <div className="research-card__authors">{p.authors}</div>
              <div className="research-card__foot">
                <span>{p.date}</span>
                <span style={{ display: "flex", gap: 14 }}>
                  <span>{p.reads} reads</span>
                  <span className="gold">↗ {p.cite} cites</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedSprints = () => {
  const sprints = window.AtomData.sprints;
  return (
    <section className="section">
      <div className="shell">
        <div className="section__head">
          <div>
            <div className="eyebrow">Featured Data Sprints</div>
            <h2 className="section__title">Open call · prized · timed.</h2>
            <p className="section__sub">AtomRearch sponsors quarterly sprints around an open MSEDsBench frontier. Submit results, win, and get fast-tracked publication.</p>
          </div>
          <button className="btn btn--gold btn--sm">Sponsor a sprint ↗</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {sprints.map((s, i) => (
            <div key={s.code} className="panel" style={{ padding: 0, position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", inset: 0, opacity: 0.06,
                background: i === 0 ? "var(--c-kinetic)" : i === 1 ? "var(--c-gold)" : "var(--c-space-400)",
                pointerEvents: "none",
              }} />
              <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--c-kinetic)", letterSpacing: ".14em" }}>
                    SPRINT {s.code}
                  </span>
                  <span className={`badge ${s.status === "open" ? "badge--verified" : "badge--review"}`}>
                    {s.status === "open" ? "OPEN" : "IN REVIEW"}
                  </span>
                </div>
                <h3 style={{ fontSize: 22, margin: 0, fontWeight: 500, letterSpacing: "-.01em", lineHeight: 1.15 }}>
                  {s.name}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
                  <div>
                    <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>ENTRIES</div>
                    <div className="mono" style={{ fontSize: 18 }}>{s.entries}</div>
                  </div>
                  <div>
                    <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>PRIZE</div>
                    <div className="mono gold" style={{ fontSize: 18 }}>{s.prize}</div>
                  </div>
                  <div>
                    <div className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>DEADLINE</div>
                    <div className="mono" style={{ fontSize: 18 }}>{s.deadline}</div>
                  </div>
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button className="btn btn--sm">View brief →</button>
                  {s.status === "open" && <button className="btn btn--sm btn--primary">Enter sprint</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Protocols = () => (
  <section className="section">
    <div className="shell">
      <div className="section__head">
        <div>
          <div className="eyebrow">Methodology Protocols</div>
          <h2 className="section__title">Reproducibility, by construction.</h2>
          <p className="section__sub">Every protocol is versioned, citable, and machine-runnable. Reference once; verify forever.</p>
        </div>
        <button className="btn btn--sm btn--ghost">Browse all 184 protocols ↗</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, border: "1px solid var(--line)" }}>
        {[
          { code: "P-COIN-32", name: "Coin Cell Assembly · Ar Glovebox", v: "v3.2", scale: "atom",  runs: "12,418" },
          { code: "P-CYCL-08", name: "Long-Cycle Aging · 25→55 °C",     v: "v0.8", scale: "meso",  runs: "3,902" },
          { code: "P-XRD-21",  name: "Operando XRD · Synchrotron",      v: "v2.1", scale: "atom",  runs: "718"   },
          { code: "P-PACK-04", name: "Pack-Level Calorimetry",          v: "v0.4", scale: "macro", runs: "204"   },
        ].map((p) => (
          <div key={p.code} style={{
            padding: 18,
            borderRight: "1px solid var(--line)",
            display: "flex", flexDirection: "column", gap: 10,
            cursor: "pointer", transition: "background .15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--c-space-600)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="mono" style={{ fontSize: 11, color: "var(--c-kinetic)", letterSpacing: ".14em" }}>{p.code}</span>
              <span className="mono dim" style={{ fontSize: 11 }}>{p.v}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, marginTop: 4 }}>{p.name}</div>
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <ScaleBadge scale={p.scale} compact />
              <span className="mono dim" style={{ fontSize: 11 }}>{p.runs} runs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ImpactFactor = () => (
  <section className="section">
    <div className="shell">
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40,
        alignItems: "center",
        padding: "32px 0",
      }}>
        <div className="panel" style={{ background: "var(--c-space-800)", padding: 0, overflow: "hidden" }}>
          <div className="panel__head">
            <span className="panel__title">Impact Factor · 2025 (Clarivate-equiv.)</span>
            <span className="badge badge--peer">PEER-RANKED</span>
          </div>
          <div style={{ padding: "28px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>2-YR JIF</div>
              <div className="num-xxl gold" style={{ marginTop: 6 }}>12.8</div>
              <div className="mono pos" style={{ fontSize: 11, marginTop: 4 }}>+2.4 vs 2024</div>
            </div>
            <div>
              <div className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>5-YR JIF</div>
              <div className="num-xxl" style={{ marginTop: 6 }}>9.4</div>
              <div className="mono pos" style={{ fontSize: 11, marginTop: 4 }}>+1.1 vs 2024</div>
            </div>
            <div>
              <div className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>CITESCORE</div>
              <div className="mono" style={{ fontSize: 22, marginTop: 4 }}>14.62</div>
            </div>
            <div>
              <div className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>SJR</div>
              <div className="mono" style={{ fontSize: 22, marginTop: 4 }}>3.804</div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", padding: "10px 16px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-dim)", letterSpacing: ".06em" }}>
            <span>Quartile · Q1 · Energy Materials</span>
            <span>Rank 3 / 184</span>
          </div>
        </div>

        <div>
          <div className="eyebrow">For Authors</div>
          <h2 className="section__title" style={{ maxWidth: 520 }}>
            Submit a .qmd. Get <span className="gold">verified</span>, indexed, and cited — in days, not quarters.
          </h2>
          <p className="section__sub" style={{ maxWidth: 540, marginTop: 10 }}>
            AtomPub's pipeline is Quarto-native. Our CSS ships identically to the PDF
            renderer — what you see on the web is what gets archived to the DOI.
            Median time-to-verification: 38 hours. Median time-to-publication: 11 days.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button className="btn btn--primary">Start a submission</button>
            <button className="btn">Read the .qmd template guide</button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HomeView = () => (
  <main>
    <HomeHero />
    <LiveDashboardWidget />
    <LatestResearch />
    <FeaturedSprints />
    <Protocols />
    <ImpactFactor />
  </main>
);

window.HomeView = HomeView;

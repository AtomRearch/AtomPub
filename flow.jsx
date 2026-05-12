// Submit + Review views — distraction-free, agent-augmented
const { useState: useStateS } = React;

const SubmitView = () => {
  const [step, setStep] = useStateS(2);
  const [progress, setProgress] = useStateS(64);
  const stepDefs = [
    "01 Manuscript",
    "02 Data & Code",
    "03 Bench Anchor",
    "04 Authorship",
    "05 Review",
  ];
  return (
    <main>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "20px var(--gutter)", background: "var(--c-space-800)" }}>
        <div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="eyebrow">New Submission · Draft #DS-2026-0419</div>
            <div style={{ fontSize: 18, marginTop: 4, fontWeight: 500 }}>
              Distraction-free portal · for the super individual
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--sm btn--ghost">Save & exit</button>
            <button className="btn btn--sm">Preview as published</button>
            <button className="btn btn--sm btn--primary">Continue →</button>
          </div>
        </div>
      </div>

      <div className="shell" style={{ padding: "24px 24px 0" }}>
        <div className="steps">
          {stepDefs.map((s, i) => (
            <div key={i} className={`step ${i === step ? "is-active" : i < step ? "is-done" : ""}`}>
              <span className="step__dot">{i < step ? "✓" : i + 1}</span>
              <span>{s.split(" ").slice(1).join(" ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="shell" style={{ padding: "24px var(--gutter) 80px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
        <div>
          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel__head">
              <span className="panel__title">Manuscript Source · .qmd</span>
              <span className="badge badge--verified">PARSED</span>
            </div>
            <div className="panel__body" style={{ padding: 0 }}>
              <div className="dropzone" style={{ margin: 16 }}>
                <div className="mono" style={{ color: "var(--fg)" }}>manuscript_li-s_g3eta.qmd</div>
                <div className="dim" style={{ marginTop: 4 }}>147 KB · parsed in 0.42s · 4 figures · 28 references</div>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", padding: "12px 16px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-dim)" }}>
                <span>Quarto v1.6.43 · ATOMPUB-TEMPLATE v0.4</span>
                <a href="#" className="kinetic">Re-upload</a>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: 16 }}>
            <div className="panel__head">
              <span className="panel__title">Raw Data · Cycler / XRD / Operando</span>
              <span className="mono dim" style={{ fontSize: 10.5 }}>3 of 4 required</span>
            </div>
            <div className="panel__body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "cycler_312cycles_25C.h5", size: "412 MB", status: "verified", agent: "Ranges normal · 0.041%/cycle fade" },
                { name: "xrd_operando_synchrotron.tar", size: "1.2 GB", status: "verified", agent: "1842 frames · ATOM-XRD-21 conformant" },
                { name: "raw_impedance_25_55C.csv", size: "8 MB", status: "review", agent: "Outlier at idx 2031 · please confirm" },
                { name: "thermal_drift_calorimetry.dat", size: "—", status: "missing", agent: "Required by P-CYCL-08 v0.8" },
              ].map(f => (
                <div key={f.name} style={{
                  display: "grid", gridTemplateColumns: "1fr 80px 110px 280px",
                  gap: 12, alignItems: "center",
                  padding: "10px 12px",
                  border: "1px solid var(--line)",
                  borderRadius: 4,
                  background: f.status === "missing" ? "rgba(255,90,90,.04)" : "var(--c-space-800)",
                }}>
                  <span className="mono" style={{ fontSize: 12 }}>{f.name}</span>
                  <span className="mono dim" style={{ fontSize: 11 }}>{f.size}</span>
                  <span className={`badge ${f.status === "verified" ? "badge--verified" : f.status === "review" ? "badge--review" : "badge--reject"}`}>
                    {f.status === "verified" ? "VERIFIED" : f.status === "review" ? "FLAGGED" : "MISSING"}
                  </span>
                  <span className="mono dim" style={{ fontSize: 11 }}>↳ AtomAgent: {f.agent}</span>
                </div>
              ))}
              <div className="dropzone" style={{ marginTop: 4 }}>
                + drop additional raw data — we'll verify in real time
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">MSEDsBench Anchor</span>
              <span className="mono dim" style={{ fontSize: 10.5 }}>required</span>
            </div>
            <div className="panel__body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field">
                <label>Bench Track</label>
                <select defaultValue="li-s">
                  <option value="li-s">Li-S · Pack-Equivalent ED</option>
                  <option>Solid-State Garnet</option>
                  <option>Anode-Free Reproducibility</option>
                </select>
              </div>
              <div className="field">
                <label>Reported ED (Wh/kg)</label>
                <input type="text" defaultValue="612.4" />
              </div>
              <div className="field">
                <label>Multiscale Focus</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn--sm">ATOM</button>
                  <button className="btn btn--sm btn--ghost">MESO</button>
                  <button className="btn btn--sm btn--ghost">MACRO</button>
                </div>
              </div>
              <div className="field">
                <label>Replication Lab (optional)</label>
                <input type="text" defaultValue="Argonne National Lab · Volkov" />
              </div>
              <div style={{ gridColumn: "1 / -1", padding: 14, background: "var(--c-space-800)", border: "1px solid var(--c-gold-line)", borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--c-gold)", letterSpacing: ".14em" }}>NEW BENCH RECORD CANDIDATE</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>
                    Your reported value <span className="gold mono">612.4</span> exceeds the current Li-S leader by <span className="pos mono">+14.3 Wh/kg</span>. Eligible for fast-tracked review.
                  </div>
                </div>
                <button className="btn btn--sm btn--gold">Opt in to fast-track</button>
              </div>
            </div>
          </div>
        </div>

        {/* Agent sidecar */}
        <aside style={{ position: "sticky", top: 100, alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">Submission Health</span>
              <span className="mono pos" style={{ fontSize: 11 }}>{progress}%</span>
            </div>
            <div className="panel__body">
              <div className="progress" style={{ marginBottom: 14 }}>
                <div className="progress__bar" style={{ width: `${progress}%` }} />
              </div>
              {[
                ["Manuscript parses cleanly", true],
                ["Methods bundle is executable", true],
                ["Bench anchor selected", true],
                ["All required raw data present", false],
                ["3 of 3 author ORCIDs resolved", true],
                ["No agent-flagged anomalies", false],
              ].map(([k, ok]) => (
                <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0", fontSize: 12 }}>
                  <span style={{
                    width: 14, height: 14, borderRadius: 2,
                    background: ok ? "var(--c-pos)" : "var(--c-space-500)",
                    color: "#000",
                    display: "inline-grid", placeItems: "center", fontSize: 10, fontWeight: 700,
                  }}>{ok ? "✓" : ""}</span>
                  <span style={{ color: ok ? "var(--fg-muted)" : "var(--fg)" }}>{k}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel" style={{ background: "var(--c-space-800)" }}>
            <div className="panel__head">
              <span className="panel__title">AtomAgent · Live Notes</span>
              <span className="dot-pulse" />
            </div>
            <div className="panel__body" style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.55 }}>
              <div>
                <span className="dim">[09:42:18] </span>
                <span className="pos">parsed manuscript</span>
                <span className="dim"> · 4 figs · 28 refs</span>
              </div>
              <div>
                <span className="dim">[09:42:21] </span>
                <span className="kinetic">cross-checked Eq.(1)</span>
                <span className="dim"> against Liu &amp; Park (2023) — sign convention OK</span>
              </div>
              <div>
                <span className="dim">[09:42:34] </span>
                <span className="gold">flag</span>
                <span className="dim">: thermal drift dataset missing — required by P-CYCL-08 v0.8</span>
              </div>
              <div>
                <span className="dim">[09:42:47] </span>
                <span className="pos">verified</span>
                <span className="dim"> ED = 612.4 Wh/kg via xrd_operando — reproducible at 99.7%</span>
              </div>
              <div>
                <span className="dim">[09:43:02] </span>
                <span className="kinetic">suggested reviewers</span>
                <span className="dim">: 4 candidates, 2 conflict-free → see panel</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

const ReviewView = () => {
  const queue = [
    { id: "atp-2026-0148", title: "Electrolyte Coalescence in Li-S Cells under Cryogenic Drift", authors: "Hara, Volkov, Chen + 4", scale: "atom", days: 11, status: "verified", agent: 99.7, you: "round 2 / 3" },
    { id: "atp-2026-0151", title: "Solid-State Garnet 7 — A Scalable Synthesis Route",         authors: "Tanaka, Bauer + 3", scale: "macro", days: 4,  status: "verified", agent: 98.9, you: "round 1 / 3" },
    { id: "atp-2026-0150", title: "AtomAgent-Driven Failure Mapping in NMC-811 at Mesoscale",   authors: "Okafor, Lindqvist", scale: "meso", days: 7,  status: "review",   agent: 87.4, you: "round 2 / 3" },
    { id: "atp-2026-0149", title: "Anode-Free Reproducibility Bounds at Pack Level",            authors: "Whittaker, Rao",   scale: "macro",days: 14, status: "review",   agent: 91.2, you: "round 3 / 3" },
    { id: "atp-2026-0145", title: "Reproducibility Bounds for DFT-Driven Cathode Screens",      authors: "Whittaker, Rao",   scale: "atom",  days: 19, status: "reject", agent: 62.1, you: "decision" },
  ];

  return (
    <main>
      <div style={{ borderBottom: "1px solid var(--line)", padding: "20px var(--gutter)", background: "var(--c-space-800)" }}>
        <div className="shell" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="eyebrow">Peer Review Dashboard · Reviewer view</div>
            <div style={{ fontSize: 18, marginTop: 4, fontWeight: 500 }}>
              5 active assignments · 2 require your decision
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn--sm btn--ghost">Settings</button>
            <button className="btn btn--sm">Decline next</button>
            <button className="btn btn--sm btn--primary">Open next →</button>
          </div>
        </div>
      </div>

      <div className="shell" style={{ padding: "24px var(--gutter)" }}>
        <div className="dash-row" style={{ marginBottom: 18 }}>
          <div className="kpi">
            <div className="kpi__lbl">Median Decision Time</div>
            <div className="kpi__val">38h</div>
            <div className="kpi__delta pos">↓ 4h vs. last quarter</div>
          </div>
          <div className="kpi">
            <div className="kpi__lbl">Agent Pre-Verification</div>
            <div className="kpi__val gold">99.4%</div>
            <div className="kpi__delta dim">avg pass-rate · trailing 30d</div>
          </div>
          <div className="kpi">
            <div className="kpi__lbl">Your Backlog</div>
            <div className="kpi__val">5</div>
            <div className="kpi__delta dim">2 due in &lt; 48h</div>
          </div>
          <div className="kpi">
            <div className="kpi__lbl">Conflicts Detected</div>
            <div className="kpi__val">0</div>
            <div className="kpi__delta pos">last scan 14m ago</div>
          </div>
        </div>

        <div className="panel" style={{ padding: 0 }}>
          <div className="panel__head">
            <span className="panel__title">Assignment Queue</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn--sm">All</button>
              <button className="btn btn--sm btn--ghost">Verified</button>
              <button className="btn btn--sm btn--ghost">Flagged</button>
              <button className="btn btn--sm btn--ghost">Decision</button>
            </div>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Manuscript</th>
                <th>Scale</th>
                <th>Agent Verify</th>
                <th>Your Round</th>
                <th className="num">Days in Queue</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {queue.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontSize: 13, fontFamily: "var(--font-serif)" }}>{p.title}</div>
                    <div className="mono dim" style={{ fontSize: 10.5, marginTop: 2 }}>{p.id} · {p.authors}</div>
                  </td>
                  <td><ScaleBadge scale={p.scale} compact /></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 64, height: 4, background: "var(--c-space-500)", borderRadius: 2, overflow: "hidden",
                      }}>
                        <div style={{
                          width: `${p.agent}%`, height: "100%",
                          background: p.agent > 95 ? "var(--c-pos)" : p.agent > 80 ? "var(--c-warn)" : "var(--c-neg)",
                        }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11 }}>{p.agent}%</span>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>{p.you}</td>
                  <td className="num">{p.days}</td>
                  <td>
                    {p.status === "verified" && <span className="badge badge--verified">VERIFIED</span>}
                    {p.status === "review"   && <span className="badge badge--review">REVIEW</span>}
                    {p.status === "reject"   && <span className="badge badge--reject">DECISION</span>}
                  </td>
                  <td><button className="btn btn--sm">Open →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Active reviewer panel — focused on top item */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">Active · atp-2026-0148 · Agent Verification Report</span>
              <span className="badge badge--verified">99.7% PASS</span>
            </div>
            <div className="panel__body" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, lineHeight: 1.65 }}>
              {[
                ["✓", "pos", "manifest_check",  "all 4 required artefacts present"],
                ["✓", "pos", "ed_consistency",  "manuscript ED 612.4 ↔ raw cycler 612.39 ± 0.04"],
                ["✓", "pos", "xrd_conformance", "1842 frames pass ATOM-XRD-21 schema"],
                ["✓", "pos", "thermal_drift",   "drift envelope within P-CYCL-08 v0.8"],
                ["⚠", "warn","outlier_imp",     "1 outlier impedance @ idx 2031 — flagged for reviewer"],
                ["✓", "pos", "ref_resolution",  "28 / 28 refs resolved · no retracted citations"],
                ["✓", "pos", "author_orcids",   "7 / 7 ORCIDs resolved · no COI with reviewer pool"],
                ["✓", "pos", "exec_methods",    "methods.qmd compiles · 12.4s runtime"],
                ["✓", "pos", "repro_2lab",      "Argonne replication: 612.6 Wh/kg (Δ +0.03%)"],
                ["✓", "pos", "novelty",         "highest verified Li-S pack-EV ED on bench"],
              ].map(([icon, tone, key, desc]) => (
                <div key={key} style={{ display: "grid", gridTemplateColumns: "20px 180px 1fr", gap: 12, padding: "6px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className={tone === "pos" ? "pos" : ""} style={{ color: tone === "warn" ? "var(--c-warn)" : undefined }}>{icon}</span>
                  <span className="kinetic">{key}</span>
                  <span className="dim">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel__head">
              <span className="panel__title">Your Recommendation</span>
            </div>
            <div className="panel__body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Accept",            "var(--c-pos)",     "0 changes required"],
                ["Accept w/ Minor",   "var(--c-warn)",    "address impedance outlier"],
                ["Major Revision",    "var(--c-kinetic)", "extra cryogenic dataset"],
                ["Reject",            "var(--c-neg)",     "do not advance"],
              ].map(([label, c, sub], i) => (
                <button key={label} className="btn" style={{
                  height: "auto", padding: "12px 14px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  borderLeft: `3px solid ${c}`,
                }}>
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
                    <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".06em" }}>{sub}</span>
                  </span>
                  <span className="mono dim" style={{ fontSize: 11 }}>→</span>
                </button>
              ))}
              <div className="field" style={{ marginTop: 6 }}>
                <label>Comments to authors</label>
                <textarea placeholder="Strong, reproducible result. The cryogenic inversion in Fig. 2 deserves a stronger discussion of mechanism…" />
              </div>
              <button className="btn btn--primary" style={{ marginTop: 4 }}>Submit recommendation</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

window.SubmitView = SubmitView;
window.ReviewView = ReviewView;

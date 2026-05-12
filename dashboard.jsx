// MSEDsBench Dashboard — Bloomberg-terminal feel
const { useState: useStateD, useMemo: useMemoD, useEffect: useEffectD } = React;

function MiniBars({ values, color = "var(--c-kinetic)", h = 36, w = 120 }) {
  const max = Math.max(...values);
  const bw = w / values.length;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {values.map((v, i) => {
        const bh = (v / max) * (h - 2);
        return <rect key={i} x={i * bw + 0.5} y={h - bh} width={bw - 1} height={bh} fill={color} opacity={0.35 + (i / values.length) * 0.65} />;
      })}
    </svg>
  );
}

function AreaChart({ series, w = 720, h = 200, color = "var(--c-kinetic)", goldThreshold = null }) {
  const all = series.flat();
  const min = Math.min(...all) * 0.97;
  const max = Math.max(...all) * 1.02;
  const span = max - min;
  const path = series.map((vals, idx) => {
    const pts = vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return [x, y];
    });
    const d = "M" + pts.map(p => p.map(n => n.toFixed(1)).join(",")).join(" L");
    return { d, color: idx === 0 ? color : "var(--c-gold)" };
  });
  const gridY = [0.25, 0.5, 0.75].map(t => t * h);
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {gridY.map((y, i) => (
        <line key={i} x1="0" x2={w} y1={y} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
      ))}
      {goldThreshold && (
        <line x1="0" x2={w}
          y1={h - ((goldThreshold - min) / span) * h}
          y2={h - ((goldThreshold - min) / span) * h}
          stroke="var(--c-gold)" strokeDasharray="3 4" opacity="0.6"
        />
      )}
      {path.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="1.4" />)}
    </svg>
  );
}

function genSeries(base, n, vol = 1) {
  const out = [base];
  for (let i = 1; i < n; i++) out.push(out[i - 1] + (Math.random() - 0.45) * vol);
  return out;
}

const DashCommand = () => {
  const [val, setVal] = useStateD("");
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 12,
      padding: "10px 14px",
      background: "var(--c-space-800)",
      borderBottom: "1px solid var(--line)",
      alignItems: "center",
    }}>
      <span className="mono" style={{ color: "var(--c-kinetic)", fontSize: 11, letterSpacing: ".14em" }}>
        MSED:
      </span>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="GO · type a command (e.g. RANK LI-S 30D, COMP NMC811 GARNET-7, ALERT MSED-IDX > 615)"
        style={{
          background: "transparent", border: 0, outline: 0,
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg)",
          width: "100%",
        }}
      />
      <span className="mono dim" style={{ fontSize: 10, letterSpacing: ".14em" }}>F1 HELP · F2 ALERT · F3 EXPORT</span>
      <span className="kbd">/</span>
    </div>
  );
};

const KPIRow = () => {
  const items = [
    { lbl: "MSED-IDX",        val: "612.40", d: "+5.04",  pct: "+0.83%", pos: true,  spark: genSeries(600, 20, 3) },
    { lbl: "MEDIAN ED",       val: "284.6",  d: "+1.2",   pct: "+0.42%", pos: true,  spark: genSeries(280, 20, 1.5) },
    { lbl: "AGENT VERIFY %",  val: "99.41%", d: "+0.02",  pct: "+0.02%", pos: true,  spark: genSeries(99, 20, .2) },
    { lbl: "OPEN SUBMITS",    val: "1,284",  d: "+18",    pct: "+1.42%", pos: true,  spark: genSeries(1200, 20, 8) },
    { lbl: "REJECTS WK",      val: "47",     d: "-3",     pct: "-6.0%",  pos: false, spark: genSeries(50, 20, 2) },
    { lbl: "LABS TRACKED",    val: "312",    d: "+2",     pct: "+0.6%",  pos: true,  spark: genSeries(308, 20, 1) },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", borderBottom: "1px solid var(--line)" }}>
      {items.map((k, i) => (
        <div key={i} style={{
          padding: "12px 14px",
          borderRight: i < items.length - 1 ? "1px solid var(--line)" : 0,
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          <div className="mono dim" style={{ fontSize: 9.5, letterSpacing: ".14em" }}>{k.lbl}</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div className="mono" style={{ fontSize: 18, color: i === 0 ? "var(--c-gold)" : "var(--fg)", letterSpacing: "-.02em" }}>
              {k.val}
            </div>
            <MiniBars values={k.spark} h={20} w={48} color={k.pos ? "var(--c-pos)" : "var(--c-neg)"} />
          </div>
          <div className="mono" style={{ fontSize: 11, color: k.pos ? "var(--c-pos)" : "var(--c-neg)" }}>
            {k.d} <span style={{ opacity: 0.7 }}>({k.pct})</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const Leaderboard = () => {
  const [sort, setSort] = useStateD("ed");
  const [scale, setScale] = useStateD("all");
  const data = useMemoD(() => {
    let d = [...window.AtomData.leaderboard];
    if (scale !== "all") d = d.filter(x => x.scale === scale);
    if (sort === "ed") d.sort((a, b) => b.ed - a.ed);
    if (sort === "delta") d.sort((a, b) => b.change - a.change);
    return d;
  }, [sort, scale]);
  return (
    <div className="panel" style={{ padding: 0 }}>
      <div className="panel__head">
        <span className="panel__title">Global Leaderboard · Pack-Equivalent Energy Density</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "atom", "meso", "macro"].map(s => (
            <button key={s} className={`btn btn--sm ${scale === s ? "" : "btn--ghost"}`} onClick={() => setScale(s)}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 36 }}>#</th>
            <th>Material / Lab</th>
            <th>Scale</th>
            <th className="num" onClick={() => setSort("ed")} style={{ cursor: "pointer" }}>
              ED Wh/kg {sort === "ed" && "▾"}
            </th>
            <th className="num" onClick={() => setSort("delta")} style={{ cursor: "pointer" }}>
              Δ 30d {sort === "delta" && "▾"}
            </th>
            <th className="num">Vol</th>
            <th className="num">Repro %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr key={r.rank}>
              <td className="mono dim">{String(idx + 1).padStart(2, "0")}</td>
              <td>
                <div style={{ fontSize: 13 }}>{r.name}</div>
                <div className="mono dim" style={{ fontSize: 10.5 }}>{r.org}</div>
              </td>
              <td><ScaleBadge scale={r.scale} compact /></td>
              <td className="num" style={{ color: idx === 0 ? "var(--c-gold)" : "var(--fg)", fontSize: 14 }}>
                {r.ed.toFixed(1)}
              </td>
              <td className={`num ${r.change >= 0 ? "pos" : "neg"}`}>{r.change >= 0 ? "+" : ""}{r.change.toFixed(1)}</td>
              <td className="num">{(r.ed * 0.1 + 12).toFixed(0)}k</td>
              <td className="num">{(95 + Math.random() * 4).toFixed(1)}</td>
              <td>
                {r.verified
                  ? <span className="badge badge--verified">VERIFIED</span>
                  : <span className="badge badge--review">PENDING</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ChartPanel = () => {
  const series1 = useMemoD(() => genSeries(560, 60, 3), []);
  const series2 = useMemoD(() => genSeries(540, 60, 2.5), []);
  const [hover, setHover] = useStateD(null);
  return (
    <div className="panel" style={{ padding: 0 }}>
      <div className="panel__head">
        <span className="panel__title">MSED-IDX · 60-Day Track · Top Cell vs Median</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["1D", "7D", "30D", "60D", "1Y", "ALL"].map((p, i) => (
            <button key={p} className={`btn btn--sm ${i === 3 ? "" : "btn--ghost"}`}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 14px", position: "relative" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const pct = Math.min(1, Math.max(0, (x - 14) / (rect.width - 28)));
          const idx = Math.round(pct * (series1.length - 1));
          setHover({ x, idx, v1: series1[idx], v2: series2[idx] });
        }}
        onMouseLeave={() => setHover(null)}
      >
        <AreaChart series={[series1, series2]} h={200} goldThreshold={612} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-dim)" }}>
          <span>Mar 09</span><span>Mar 24</span><span>Apr 08</span><span>Apr 23</span><span>May 08</span>
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 12, fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span><span style={{ display: "inline-block", width: 8, height: 2, background: "var(--c-kinetic)", verticalAlign: "middle", marginRight: 6 }}></span>Top Cell · Li-S G3-η</span>
          <span><span style={{ display: "inline-block", width: 8, height: 2, background: "var(--c-gold)", verticalAlign: "middle", marginRight: 6 }}></span>Bench Median</span>
          <span style={{ marginLeft: "auto", color: "var(--fg-dim)" }}>Threshold · 612 Wh/kg (Pack EV target)</span>
        </div>
        {hover && (
          <div className="tip" style={{ left: hover.x + 8, top: 12 }}>
            <div className="tip__lbl">Wh/kg · day {hover.idx + 1}</div>
            <div className="tip__val">{hover.v1.toFixed(1)} <span style={{ color: "var(--fg-muted)" }}>vs</span> {hover.v2.toFixed(1)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const NewsRail = () => (
  <div className="panel" style={{ padding: 0, height: "100%" }}>
    <div className="panel__head">
      <span className="panel__title">Bench Tape · Latest Verifications</span>
      <span className="dot-pulse" />
    </div>
    <div style={{ maxHeight: 540, overflow: "auto" }}>
      {[
        { t: "09:42:18", c: "VERIFIED", scale: "atom",  k: "LI-S G3-η", m: "+4.2 Wh/kg · cycle 312", color: "pos" },
        { t: "09:38:01", c: "SUBMIT",   scale: "meso",  k: "AlS-NMC811", m: "by MIT/SLAC · v2.3", color: "kinetic" },
        { t: "09:31:44", c: "REJECT",   scale: "macro", k: "Pack-Q4 trial", m: "agent flag · ΔSOH unverified", color: "neg" },
        { t: "09:27:09", c: "REVIEW",   scale: "atom",  k: "LiFSI-Conc.", m: "assigned to 3 reviewers", color: "warn" },
        { t: "09:18:33", c: "VERIFIED", scale: "macro", k: "Garnet-7",    m: "−0.3 Wh/kg · cycle 128", color: "pos" },
        { t: "09:14:02", c: "ALERT",    scale: "meso",  k: "MSED-IDX",    m: "crossed 610 threshold ↑", color: "kinetic" },
        { t: "09:10:41", c: "SUBMIT",   scale: "atom",  k: "K-Layer MX",  m: "by Seoul Natl./KAIST",  color: "kinetic" },
        { t: "09:02:17", c: "VERIFIED", scale: "meso",  k: "Si-Air v2",   m: "+1.0 Wh/kg · cycle 84", color: "pos" },
        { t: "08:58:02", c: "REVIEW",   scale: "atom",  k: "Mg-S Polymer",m: "review round 2 / 3",     color: "warn" },
        { t: "08:51:30", c: "VERIFIED", scale: "macro", k: "Pack-EV-A2",  m: "+0.8 Wh/kg · cycle 220", color: "pos" },
      ].map((row, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "60px 80px 1fr",
          gap: 10, padding: "10px 14px",
          borderBottom: "1px solid var(--line)",
          fontFamily: "var(--font-mono)", fontSize: 11.5,
          alignItems: "start",
        }}>
          <span className="dim">{row.t}</span>
          <span className={row.color === "pos" ? "pos" : row.color === "neg" ? "neg" : row.color === "warn" ? "" : "kinetic"} style={{ color: row.color === "warn" ? "var(--c-warn)" : undefined }}>
            {row.c}
          </span>
          <span>
            <span style={{ color: "var(--fg)" }}>{row.k}</span>
            <span style={{ color: "var(--fg-dim)" }}> · {row.m}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

const HeatGrid = () => {
  const cells = useMemoD(() => Array.from({ length: 7 * 12 }, () => Math.random()), []);
  return (
    <div className="panel" style={{ padding: 0 }}>
      <div className="panel__head">
        <span className="panel__title">Lab Activity Heatmap · 12 weeks × 7 days</span>
        <span className="mono dim" style={{ fontSize: 10.5, letterSpacing: ".14em" }}>SUBMITS / DAY</span>
      </div>
      <div style={{ padding: 14, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 }}>
        {Array.from({ length: 12 }).map((_, c) => (
          <div key={c} style={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gap: 3 }}>
            {Array.from({ length: 7 }).map((_, r) => {
              const v = cells[c * 7 + r];
              return (
                <div key={r} style={{
                  aspectRatio: "1 / 1",
                  background: `rgba(0,91,255,${0.08 + v * 0.85})`,
                  borderRadius: 1,
                }} title={`Wk ${c+1} · Day ${r+1} · ${Math.round(v * 80)} submits`} />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardView = () => (
  <main>
    <DashCommand />
    <KPIRow />
    <div style={{ padding: "14px var(--gutter)", display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <ChartPanel />
        <Leaderboard />
        <HeatGrid />
      </div>
      <NewsRail />
    </div>
  </main>
);

window.DashboardView = DashboardView;

// Shared mock data for AtomPub prototype
window.AtomData = (() => {
  const leaderboard = [
    { rank: 1, name: "Li-S Cathode (G3-η)",   org: "Tsinghua / Argonne",     ed: 612.4, change: +4.2, scale: "atom",  verified: true },
    { rank: 2, name: "AlS-NMC811 Hybrid",     org: "MIT / SLAC",             ed: 598.1, change: +2.1, scale: "meso",  verified: true },
    { rank: 3, name: "Solid-State Garnet 7",  org: "Toyota CRDL",            ed: 581.6, change: -0.3, scale: "macro", verified: true },
    { rank: 4, name: "Si-Air Stack v2",       org: "ETH Zürich",             ed: 567.0, change: +1.0, scale: "meso",  verified: true },
    { rank: 5, name: "K-Ion Layered MX",      org: "Seoul Natl. / KAIST",    ed: 552.8, change: +5.6, scale: "atom",  verified: false },
    { rank: 6, name: "Mg-S Polymer Matrix",   org: "Stanford GLAM",          ed: 540.2, change: -1.4, scale: "macro", verified: true },
    { rank: 7, name: "LiFSI-Conc. Electrolyte",org: "AtomRearch Lab",        ed: 533.9, change: +0.6, scale: "atom",  verified: true },
    { rank: 8, name: "NaIon Hard Carbon Δ",   org: "CNRS / Grenoble",        ed: 521.5, change: +2.8, scale: "meso",  verified: false },
  ];

  const research = [
    { id: "atp-2026-0148", title: "Electrolyte Coalescence in Li-S Cells under Cryogenic Drift", authors: "Hara, Volkov, Chen et al.", scale: "atom", date: "May 04 2026", reads: "12.4k", cite: 38 },
    { id: "atp-2026-0147", title: "AtomAgent-Verified Mesoscale Failure Mapping in NMC-811", authors: "Okafor, Lindqvist, Park", scale: "meso", date: "May 02 2026", reads: "9.1k",  cite: 21 },
    { id: "atp-2026-0146", title: "A Closed-Loop Sprint for Solid-State Garnet Discovery", authors: "Tanaka, Bauer, Ramos et al.", scale: "macro",date: "Apr 29 2026", reads: "18.7k", cite: 56 },
    { id: "atp-2026-0145", title: "Reproducibility Bounds for DFT-Driven Cathode Screens", authors: "Whittaker, Rao",                scale: "atom", date: "Apr 27 2026", reads: "7.3k",  cite: 11 },
    { id: "atp-2026-0144", title: "Temperature-Dependent Dendrite Suppression: A Protocol",   authors: "Ngozi, Ferraro, Klein",       scale: "meso", date: "Apr 24 2026", reads: "6.0k",  cite: 14 },
    { id: "atp-2026-0143", title: "Pack-Level Energy Density at Manufacturing Scale: 612 Wh/kg Replication", authors: "AtomRearch Consortium", scale: "macro", date: "Apr 22 2026", reads: "31.2k", cite: 92 },
  ];

  const sprints = [
    { code: "DS-117", name: "Cryogenic Cell Drift", entries: 248, prize: "$120k", deadline: "Jun 14", status: "open" },
    { code: "DS-116", name: "Solid Electrolyte 800 Wh/kg", entries: 612, prize: "$250k", deadline: "Jul 02", status: "open" },
    { code: "DS-115", name: "Anode-Free Reproducibility", entries: 184, prize: "$60k",  deadline: "Closed", status: "review" },
  ];

  // ticker
  const ticker = [
    ["MSED-IDX", "612.40", "+0.83%", "pos"],
    ["LI-S",     "598.10", "+0.42%", "pos"],
    ["NA-ION",   "521.50", "+2.10%", "pos"],
    ["GARNET-7", "581.60", "-0.30%", "neg"],
    ["MG-S",     "540.20", "-1.40%", "neg"],
    ["K-LAYER",  "552.80", "+5.60%", "pos"],
    ["AGENT-Q",  " 99.41%","+0.02%", "pos"],
    ["SUBMITS",  "1,284",  "+18",    "pos"],
    ["IN-REVIEW","  327",  "-4",     "neg"],
    ["ACCEPT-R", "  41.7%","+1.2",   "pos"],
  ];

  return { leaderboard, research, sprints, ticker };
})();

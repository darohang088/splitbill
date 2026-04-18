import { useState, useRef, useEffect } from "react";

const OWNER = "Me";
const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#F43F5E",
  "#84CC16",
  "#FB923C",
  "#3B82F6",
];

const FALLBACK_CONTACTS = [
  { name: "Bong PY", nickname: "Good Husband", emoji: "💑" },
  { name: "Bong Sak", nickname: "Fan ozawa69", emoji: "🐼" },
  { name: "bong hong", nickname: "Tongue Emperor", emoji: "👅" },
  { name: "Daro", nickname: "មហាចោរ", emoji: "🔥" },
  { name: "Colin", nickname: "songsa yisunshin", emoji: "💋" },
  { name: "Chea Hour", nickname: "មុខក័យ សំដីឡូយ", emoji: "😰" },
  { name: "Thinh", nickname: "Kmeng kohork", emoji: "🙃" },
  { name: "Mengche", nickname: "Tongue prince", emoji: "👅👑" },
  { name: "Smey", nickname: "kmeng nhean six", emoji: "🍆🍑😩👉👌💦" },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #F0F4FF;
    --card:        rgba(255,255,255,0.85);
    --card-border: rgba(255,255,255,0.9);
    --shadow-sm:   0 2px 12px rgba(99,102,241,0.08);
    --shadow:      0 8px 40px rgba(99,102,241,0.12), 0 2px 8px rgba(99,102,241,0.06);
    --accent:      #6366F1;
    --accent2:     #8B5CF6;
    --green:       #10B981;
    --green2:      #059669;
    --red:         #F43F5E;
    --text:        #0F172A;
    --sub:         #475569;
    --muted:       #94A3B8;
    --border:      rgba(99,102,241,0.15);
    --inp:         rgba(255,255,255,0.7);
    --inp-border:  rgba(99,102,241,0.2);
    --ff:          'Sora', sans-serif;
  }

  body {
    font-family: var(--ff);
    background: var(--bg);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%,  rgba(99,102,241,0.13) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 20%,  rgba(139,92,246,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 70% 60% at 50% 90%,  rgba(6,182,212,0.08)  0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .app {
    position: relative; z-index: 1;
    max-width: 440px; margin: 0 auto;
    padding: 0 18px 100px;
  }

  .header { text-align: center; padding: 36px 0 0; }

  .logo-pill {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--card); backdrop-filter: blur(20px);
    border: 1.5px solid var(--card-border); border-radius: 24px;
    padding: 12px 22px; box-shadow: var(--shadow);
  }
  .logo-title { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .logo-sub   { font-size: 10px; color: var(--muted); font-weight: 600; letter-spacing: 0.5px; }
  .tagline    { color: var(--sub); font-size: 13px; margin-top: 12px; font-weight: 500; }

  .stepbar {
    display: flex; align-items: center;
    margin: 20px 0 0; padding: 16px 20px;
    background: var(--card); backdrop-filter: blur(20px);
    border: 1.5px solid var(--card-border); border-radius: 20px;
    box-shadow: var(--shadow-sm);
  }
  .step-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }
  .step-dot {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .step-dot.done   { background: linear-gradient(135deg,var(--green),var(--green2)); color:#fff; box-shadow:0 4px 12px rgba(16,185,129,.35); }
  .step-dot.active { background: linear-gradient(135deg,var(--accent),var(--accent2)); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,.4); transform:scale(1.1); }
  .step-dot.idle   { background: rgba(99,102,241,.08); color:var(--muted); }
  .step-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .step-label.active { color: var(--accent); }
  .step-label.done   { color: var(--green); }
  .step-label.idle   { color: var(--muted); }
  .step-line { flex:1; height:2px; margin:0 6px 16px; border-radius:99px; transition:background .3s; }
  .step-line.done { background: linear-gradient(90deg,var(--green),var(--accent)); }
  .step-line.idle { background: rgba(99,102,241,.12); }

  .card {
    background: var(--card); backdrop-filter: blur(20px);
    border: 1.5px solid var(--card-border); border-radius: 28px;
    padding: 28px 24px; box-shadow: var(--shadow);
    margin-top: 20px; animation: slideUp .4s cubic-bezier(.32,1,.6,1);
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .s-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 10px; font-weight: 800; letter-spacing: 2px;
    text-transform: uppercase; color: var(--muted); margin-bottom: 20px;
  }
  .s-label-icon {
    width: 24px; height: 24px;
    background: linear-gradient(135deg,var(--accent),var(--accent2));
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 12px; box-shadow: 0 2px 8px rgba(99,102,241,.3);
  }

  .amount-input {
    width: 100%;
    background: linear-gradient(135deg,rgba(99,102,241,.05),rgba(139,92,246,.05));
    border: 2px solid rgba(99,102,241,.15); border-radius: 20px; padding: 20px;
    font-family: var(--ff); font-size: 42px; font-weight: 800;
    color: var(--text); text-align: center;
    outline: none; letter-spacing: -2px; transition: all .2s;
  }
  .amount-input:focus {
    border-color: var(--accent);
    background: linear-gradient(135deg,rgba(99,102,241,.08),rgba(139,92,246,.08));
    box-shadow: 0 0 0 4px rgba(99,102,241,.1);
  }
  .amount-input::placeholder { color: rgba(99,102,241,.25); }

  .inp {
    width: 100%; background: var(--inp);
    border: 1.5px solid var(--inp-border); border-radius: 14px;
    padding: 13px 16px; font-family: var(--ff); font-size: 14px; color: var(--text);
    outline: none; transition: all .2s;
  }
  .inp:focus { border-color: var(--accent); background: rgba(255,255,255,.9); box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
  textarea.inp { resize: none; line-height: 1.5; }

  .field-label { font-size:12px; font-weight:700; color:var(--sub); display:block; margin-bottom:8px; }
  .field-muted { color:var(--muted); font-weight:500; }

  .btn-primary {
    width: 100%; padding: 15px 20px; border-radius: 16px;
    background: linear-gradient(135deg,var(--accent),var(--accent2));
    color: #fff; font-weight: 800; font-size: 15px;
    font-family: var(--ff); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 6px 20px rgba(99,102,241,.4);
    transition: all .2s cubic-bezier(.34,1.56,.64,1); margin-top: 20px;
  }
  .btn-primary:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 28px rgba(99,102,241,.5); }
  .btn-primary:active:not(:disabled){ transform:scale(.98); }
  .btn-primary:disabled { opacity:.4; cursor:not-allowed; }

  .btn-green {
    background: linear-gradient(135deg,var(--green),var(--green2)) !important;
    box-shadow: 0 6px 20px rgba(16,185,129,.35) !important;
  }
  .btn-green:hover:not(:disabled) { box-shadow:0 8px 28px rgba(16,185,129,.5) !important; }

  .btn-ghost {
    padding: 13px 18px; border-radius: 14px;
    background: rgba(99,102,241,.07); color: var(--sub);
    font-weight: 700; font-size: 14px; font-family: var(--ff);
    border: 1.5px solid var(--border); cursor: pointer; transition: all .2s;
  }
  .btn-ghost:hover { background:rgba(99,102,241,.12); border-color:rgba(99,102,241,.3); }

  .avatar {
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; color: #fff; flex-shrink: 0; letter-spacing: -.5px;
  }

  .info-band {
    background: linear-gradient(135deg,rgba(16,185,129,.08),rgba(6,182,212,.06));
    border: 1.5px solid rgba(16,185,129,.2);
    border-radius: 14px; padding: 11px 16px; margin-bottom: 18px;
    font-size: 13px; font-weight: 600; color: var(--green2);
  }

  .me-btn {
    width: 100%; padding: 14px 16px; border-radius: 16px; margin-bottom: 12px;
    background: rgba(255,255,255,.7); border: 2px dashed var(--inp-border);
    cursor: pointer; font-family: var(--ff);
    display: flex; align-items: center; gap: 12px;
    transition: all .25s cubic-bezier(.34,1.56,.64,1);
  }
  .me-btn.joined { background: linear-gradient(135deg,rgba(16,185,129,.08),rgba(6,182,212,.06)); border: 2px solid rgba(16,185,129,.3); }
  .me-btn:hover:not(:disabled) { transform:translateY(-1px); }

  .contacts-btn {
    width: 100%; padding: 14px 16px; border-radius: 16px; margin-bottom: 14px;
    background: linear-gradient(135deg,rgba(99,102,241,.07),rgba(139,92,246,.05));
    border: 2px solid rgba(99,102,241,.2);
    cursor: pointer; font-family: var(--ff);
    display: flex; align-items: center; gap: 12px; transition: all .25s;
  }
  .contacts-btn:hover { transform:translateY(-1px); background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08)); }

  .person-chip {
    display: flex; align-items: center; gap: 10px;
    border-radius: 50px; padding: 8px 14px 8px 8px;
    margin-bottom: 8px; transition: all .2s;
    animation: chipIn .3s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes chipIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }

  .divider { display:flex; align-items:center; gap:10px; margin:4px 0 12px; }
  .divider-line { flex:1; height:1.5px; background:var(--border); border-radius:99px; }
  .divider-text { font-size:11px; font-weight:700; color:var(--muted); white-space:nowrap; }

  .progress-wrap {
    background: rgba(99,102,241,.07); border: 1.5px solid rgba(99,102,241,.12);
    border-radius: 16px; padding: 14px 16px; margin-bottom: 18px;
  }
  .progress-bg { height:8px; background:rgba(99,102,241,.12); border-radius:99px; overflow:hidden; margin-top:10px; }
  .progress-fill { height:100%; border-radius:99px; transition:width .4s; background:linear-gradient(90deg,var(--accent),var(--accent2)); }
  .progress-fill.over { background:linear-gradient(90deg,var(--red),#FB923C); }

  .split-row {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; border-radius: 16px;
    margin-bottom: 10px; border: 1.5px solid transparent; transition: all .2s;
  }
  .split-row.is-me    { background:linear-gradient(135deg,rgba(16,185,129,.06),rgba(6,182,212,.04)); border-color:rgba(16,185,129,.2); }
  .split-row.is-auto  { background:rgba(99,102,241,.04); border-color:rgba(99,102,241,.08); }
  .split-row.is-custom{ background:linear-gradient(135deg,rgba(99,102,241,.06),rgba(139,92,246,.04)); border-color:rgba(99,102,241,.2); }

  .custom-input {
    width: 88px; padding: 9px 11px; border-radius: 12px;
    border: 1.5px solid rgba(99,102,241,.2);
    background: rgba(255,255,255,.8);
    font-family: var(--ff); font-size: 14px; font-weight: 800;
    color: var(--text); outline: none; text-align: right; transition: all .2s;
  }
  .custom-input:focus  { border-color:var(--accent); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .custom-input.is-set { border-color:var(--accent); background:rgba(99,102,241,.05); }

  .reset-btn { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; padding:0 2px; transition:all .2s; }
  .reset-btn:hover { color:var(--red); }

  /* ── Share panels: ALWAYS hardcoded light colors — never uses CSS vars ──
     This guarantees html2canvas captures correct colors in both light & dark mode */
  .share-panel {
    border-radius: 24px; overflow: hidden;
    border: 1.5px solid rgba(99,102,241,.12);
    box-shadow: 0 8px 40px rgba(99,102,241,.12);
    margin-top: 20px;
    animation: slideUp .4s cubic-bezier(.32,1,.6,1);
  }
  .share-panel-header {
    background: linear-gradient(135deg,#6366F1,#8B5CF6);
    padding: 18px 22px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .share-panel-body   { background: #ffffff; padding: 12px 22px; }
  .share-panel-footer { background: rgba(99,102,241,.04); padding: 10px 18px; text-align: center; border-top: 1px solid rgba(99,102,241,.08); }
  .share-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 0; border-top: 1px solid rgba(99,102,241,.07);
  }
  .share-row:first-child { border-top: none; }

  .note-bar {
    background:var(--card); border:1.5px dashed var(--border);
    border-radius:14px; padding:11px 16px; cursor:pointer;
    display:flex; align-items:center; justify-content:space-between;
    transition:all .2s; margin-top:12px;
  }
  .note-bar:hover { border-color:var(--accent); background:rgba(99,102,241,.04); }

  .upload-zone {
    border: 2px dashed var(--inp-border); border-radius: 16px; padding: 18px 10px;
    text-align: center; cursor: pointer; background: var(--inp); min-height: 110px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .upload-zone:hover   { border-color:var(--accent); background:rgba(99,102,241,.05); }
  .upload-zone.has-img { border-color:var(--accent); background:rgba(99,102,241,.04); }

  .badge       { background:rgba(99,102,241,.1); color:#6366F1; border-radius:99px; padding:3px 12px; font-size:12px; font-weight:800; }
  .badge-green { background:rgba(16,185,129,.1); color:#059669; padding:2px 10px; border-radius:99px; font-size:11px; font-weight:700; }
  .badge-device{ background:rgba(6,182,212,.1); color:#0891b2; padding:2px 8px; border-radius:99px; font-size:10px; font-weight:700; }
  .tag { display:inline-flex; align-items:center; gap:5px; background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.15); color:var(--accent); border-radius:99px; padding:4px 12px; font-size:11px; font-weight:700; }
  .float-badge { background:rgba(255,255,255,.25); border-radius:99px; padding:3px 12px; font-size:12px; font-weight:800; }

  .sheet-backdrop {
    position:fixed; inset:0; background:rgba(15,23,42,.5);
    backdrop-filter:blur(8px); z-index:900; animation:fadeIn .2s;
  }
  .sheet {
    position:fixed; bottom:0; left:0; right:0;
    background:#ffffff; backdrop-filter:blur(20px);
    border-radius:32px 32px 0 0; z-index:901;
    max-height:88vh; display:flex; flex-direction:column;
    box-shadow:0 -12px 60px rgba(99,102,241,.2);
    font-family:var(--ff);
    animation:sheetUp .35s cubic-bezier(.32,1,.6,1);
  }
  @keyframes sheetUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }

  .handle { width:40px; height:4px; background:rgba(99,102,241,.2); border-radius:99px; margin:14px auto 0; }

  .contact-row {
    display:flex; align-items:center; gap:12px;
    padding:12px; border-radius:18px; margin-bottom:6px;
    cursor:pointer; transition:all .15s; border:1.5px solid transparent;
  }
  .contact-row:hover    { background:rgba(99,102,241,.05); }
  .contact-row.selected { background:rgba(99,102,241,.07); border-color:rgba(99,102,241,.2); }
  .contact-row.already  { opacity:.45; cursor:default; }

  .chkbox { width:24px; height:24px; border-radius:8px; border:2px solid rgba(99,102,241,.2); background:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .15s cubic-bezier(.34,1.56,.64,1); }
  .chkbox.checked { background:linear-gradient(135deg,#6366F1,#8B5CF6); border-color:transparent; box-shadow:0 3px 10px rgba(99,102,241,.4); }

  .footer { text-align:center; margin-top:48px; padding-bottom:20px; }

  .add-btn {
    width:48px; height:48px; border-radius:14px; flex-shrink:0;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    border:none; color:#fff; font-size:26px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 14px rgba(99,102,241,.4);
    transition:all .2s cubic-bezier(.34,1.56,.64,1);
  }
  .add-btn:hover  { transform:scale(1.08); }
  .add-btn:active { transform:scale(.94); }

  /* Permission prompt inside sheet */
  .perm-box { text-align:center; padding:32px 20px 16px; }
  .perm-icon {
    width:72px; height:72px; border-radius:20px; margin:0 auto 16px;
    background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08));
    border:1.5px solid rgba(99,102,241,.2);
    display:flex; align-items:center; justify-content:center; font-size:34px;
  }
  .perm-title { font-size:18px; font-weight:800; color:#0F172A; margin-bottom:8px; }
  .perm-sub   { font-size:13px; color:#94A3B8; font-weight:500; line-height:1.6; margin-bottom:20px; }

  .spinner {
    width:28px; height:28px; border-radius:50%;
    border:3px solid rgba(99,102,241,.15); border-top-color:#6366F1;
    animation:spin .7s linear infinite; margin:0 auto 14px;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* Dark Mode — sheet stays white, share panels stay white */
  body.dark {
    --bg:          #0D0F1A;
    --card:        rgba(22,25,45,0.9);
    --card-border: rgba(99,102,241,0.18);
    --text:        #F1F5F9;
    --sub:         #94A3B8;
    --muted:       #64748B;
    --border:      rgba(99,102,241,0.2);
    --inp:         rgba(15,18,35,0.8);
    --inp-border:  rgba(99,102,241,0.25);
  }
  body.dark::before {
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%,  rgba(99,102,241,0.2)  0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 20%,  rgba(139,92,246,0.15) 0%, transparent 55%),
      radial-gradient(ellipse 70% 60% at 50% 90%,  rgba(6,182,212,0.12)  0%, transparent 60%);
  }
  body.dark .logo-pill,
  body.dark .stepbar,
  body.dark .card  { box-shadow:0 8px 40px rgba(0,0,0,0.4); }
  body.dark .custom-input { background:rgba(15,18,35,0.8); color:#F1F5F9; }
  body.dark .me-btn { background:rgba(22,25,45,0.7); }
  /* sheet and share-panel intentionally stay #ffffff so captured images look correct */

  .theme-toggle {
    display:inline-flex; align-items:center; gap:8px; margin-top:12px;
    background:var(--card); backdrop-filter:blur(16px);
    border:1.5px solid var(--card-border); border-radius:99px;
    padding:5px 6px 5px 12px; box-shadow:var(--shadow-sm);
    cursor:pointer; font-family:var(--ff); font-size:12px; font-weight:700; color:var(--sub);
    transition:all .25s; user-select:none;
  }
  .theme-toggle:hover { border-color:var(--accent); color:var(--accent); }
  .toggle-track {
    width:36px; height:20px; border-radius:99px;
    background:rgba(99,102,241,0.15); border:1.5px solid var(--border);
    position:relative; transition:all .3s; flex-shrink:0;
  }
  .toggle-track.on { background:linear-gradient(135deg,#6366F1,#8B5CF6); border-color:transparent; box-shadow:0 2px 8px rgba(99,102,241,0.4); }
  .toggle-thumb {
    width:14px; height:14px; border-radius:50%; background:#fff;
    position:absolute; top:2px; left:2px;
    transition:transform .3s cubic-bezier(.34,1.56,.64,1);
    box-shadow:0 1px 4px rgba(0,0,0,.2);
  }
  .toggle-thumb.on { transform:translateX(16px); }
`;

// ─── helpers ─────────────────────────────────────────────────────────────────
const getInitial = (name) => name.trim().charAt(0).toUpperCase() || "?";
const fmt = (n) => Number(n).toFixed(2);

async function loadHtml2Canvas() {
  if (window.html2canvas) return;
  await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function nodeToFile(node, filename) {
  // Force white background so dark-mode CSS vars never bleed into the capture
  const canvas = await window.html2canvas(node, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    onclone: (doc) => {
      // Remove dark class from cloned document so CSS vars resolve to light values
      doc.body.classList.remove("dark");
    },
  });
  return new Promise((res) =>
    canvas.toBlob(
      (b) => res(new File([b], filename, { type: "image/png" })),
      "image/png"
    )
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, color, size = 40 }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        fontSize: size * 0.4,
        boxShadow: `0 3px 12px ${color}55`,
      }}
    >
      {getInitial(name)}
    </div>
  );
}

// ─── StepBar ──────────────────────────────────────────────────────────────────
function StepBar({ current }) {
  const labels = ["Amount", "People", "Split", "Summary"];
  return (
    <div className="stepbar">
      {labels.map((label, i) => {
        const s = i + 1;
        const done = current > s,
          active = current === s;
        return (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              flex: s < 4 ? 1 : "none",
            }}
          >
            <div className="step-item">
              <div
                className={`step-dot ${
                  done ? "done" : active ? "active" : "idle"
                }`}
              >
                {done ? "✓" : s}
              </div>
              <span
                className={`step-label ${
                  done ? "done" : active ? "active" : "idle"
                }`}
              >
                {label}
              </span>
            </div>
            {s < 4 && <div className={`step-line ${done ? "done" : "idle"}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── ContactsSheet ────────────────────────────────────────────────────────────
function ContactsSheet({ open, onClose, onAdd, alreadyAdded }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState(null);
  // status: idle | requesting | granted | denied | unsupported
  const [status, setStatus] = useState("idle");

  const isSupported =
    typeof navigator !== "undefined" &&
    "contacts" in navigator &&
    "ContactsManager" in window;

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected([]);
      setSearch("");
      if (contacts === null) setStatus("idle");
    }
  }, [open]);

  if (!open) return null;

  // MUST be called from a direct button click — browser blocks auto calls
  const handleRequestContacts = async () => {
    if (!isSupported) {
      setStatus("unsupported");
      setContacts(FALLBACK_CONTACTS);
      return;
    }
    setStatus("requesting");
    try {
      const results = await navigator.contacts.select(["name", "tel"], {
        multiple: true,
      });
      if (!results || results.length === 0) {
        setStatus("denied");
        setContacts(FALLBACK_CONTACTS);
        return;
      }
      const mapped = results
        .filter((c) => c.name?.[0])
        .map((c) => ({
          name: c.name[0],
          nickname: c.tel?.[0] ?? "",
          emoji: "",
          isDevice: true,
        }));
      setStatus("granted");
      setContacts(mapped.length > 0 ? mapped : FALLBACK_CONTACTS);
    } catch (err) {
      console.warn("Contacts picker:", err);
      setStatus("denied");
      setContacts(FALLBACK_CONTACTS);
    }
  };

  const toggle = (name) =>
    setSelected((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name]
    );

  const handleAdd = () => {
    onAdd(selected);
    onClose();
  };

  const list = contacts || [];
  const filtered = list.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.nickname || "").toLowerCase().includes(search.toLowerCase())
  );

  const renderBody = () => {
    // ── Step 1: Ask permission with a real button tap ──
    if (status === "idle") {
      return (
        <div className="perm-box">
          <div className="perm-icon">📱</div>
          <div className="perm-title">Load Your Contacts</div>
          <div className="perm-sub">
            Tap the button below. Your phone will ask you to allow contact
            access — select the contacts you want to add.
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 0, fontSize: 15 }}
            onClick={handleRequestContacts}
          >
            📋 Allow Contact Access
          </button>
          <div
            style={{
              marginTop: 18,
              fontSize: 12,
              color: "#94A3B8",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => {
              setStatus("unsupported");
              setContacts(FALLBACK_CONTACTS);
            }}
          >
            Use saved contacts instead →
          </div>
        </div>
      );
    }

    // ── Waiting for picker ──
    if (status === "requesting") {
      return (
        <div className="perm-box">
          <div className="perm-icon">📱</div>
          <div className="perm-title">Select Contacts…</div>
          <div className="perm-sub">
            Pick the people you want to add from your phone's contacts list.
          </div>
          <div className="spinner" />
          <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
            Waiting for your selection…
          </div>
        </div>
      );
    }

    // ── List view ──
    return (
      <>
        {status === "granted" && (
          <div
            style={{
              background: "rgba(16,185,129,.08)",
              border: "1.5px solid rgba(16,185,129,.2)",
              borderRadius: 14,
              padding: "10px 14px",
              marginBottom: 12,
              fontSize: 12,
              fontWeight: 600,
              color: "#059669",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>✅</span>
            <span>Loaded {list.length} contacts from your device</span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                cursor: "pointer",
                color: "#6366F1",
              }}
              onClick={handleRequestContacts}
            >
              Refresh
            </span>
          </div>
        )}
        {(status === "denied" || status === "unsupported") && (
          <div
            style={{
              background: "rgba(244,63,94,.07)",
              border: "1.5px solid rgba(244,63,94,.2)",
              borderRadius: 14,
              padding: "10px 14px",
              marginBottom: 12,
              fontSize: 12,
              fontWeight: 600,
              color: "#F43F5E",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span style={{ flex: 1 }}>
              {status === "unsupported"
                ? "Contact Picker not supported on this browser. Showing saved contacts."
                : "Access denied or cancelled. Showing saved contacts."}
            </span>
            {status === "denied" && isSupported && (
              <span
                style={{ flexShrink: 0, cursor: "pointer", color: "#6366F1" }}
                onClick={handleRequestContacts}
              >
                Try again
              </span>
            )}
          </div>
        )}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#94A3B8",
              fontSize: 14,
            }}
          >
            No results
          </div>
        )}
        {filtered.map((contact, idx) => {
          const isSel = selected.includes(contact.name);
          const isAlr = alreadyAdded.includes(contact.name);
          return (
            <div
              key={contact.name + idx}
              className={`contact-row ${isSel ? "selected" : ""} ${
                isAlr ? "already" : ""
              }`}
              onClick={() => !isAlr && toggle(contact.name)}
            >
              <Avatar
                name={contact.name}
                color={COLORS[(idx + 1) % COLORS.length]}
                size={42}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 15,
                      color: isSel ? "#6366F1" : "#0F172A",
                    }}
                  >
                    {contact.name}
                  </span>
                  {contact.emoji ? (
                    <span style={{ fontSize: 13 }}>{contact.emoji}</span>
                  ) : null}
                  {contact.isDevice && (
                    <span className="badge-device">📱 device</span>
                  )}
                  {isAlr && <span className="badge-green">Added</span>}
                </div>
                {contact.nickname ? (
                  <div
                    style={{
                      fontSize: 12,
                      color: isSel ? "#6366F1" : "#94A3B8",
                      fontWeight: 500,
                      marginTop: 1,
                    }}
                  >
                    {contact.nickname}
                  </div>
                ) : null}
              </div>
              <div className={`chkbox ${isSel ? "checked" : ""}`}>
                {isSel && (
                  <span
                    style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}
                  >
                    ✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: 20 }} />
      </>
    );
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="handle" />

        <div style={{ padding: "16px 22px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>
                {status === "granted" ? "📱 Device Contacts" : "Select Friends"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#94A3B8",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {status === "idle"
                  ? "Tap Allow to load your contacts"
                  : status === "requesting"
                  ? "Waiting for selection…"
                  : selected.length === 0
                  ? "Tap to select"
                  : `${selected.length} selected`}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.08)",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#475569",
              }}
            >
              ×
            </button>
          </div>

          {(status === "granted" ||
            status === "denied" ||
            status === "unsupported") && (
            <div style={{ position: "relative", marginBottom: 14 }}>
              <span
                style={{
                  position: "absolute",
                  left: 13,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 14,
                  opacity: 0.5,
                }}
              >
                🔍
              </span>
              <input
                className="inp"
                placeholder="Search name or number…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 38 }}
              />
            </div>
          )}
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "0 22px" }}>
          {renderBody()}
        </div>

        <div
          style={{
            padding: "14px 22px",
            paddingBottom: "calc(14px + env(safe-area-inset-bottom,0px))",
            borderTop: "1px solid rgba(99,102,241,0.08)",
          }}
        >
          {selected.length > 0 ? (
            <button
              className="btn-primary"
              style={{ marginTop: 0 }}
              onClick={handleAdd}
            >
              Add {selected.length}{" "}
              {selected.length === 1 ? "person" : "people"}
              <span className="float-badge">
                {selected.map((s) => s.split(" ")[0]).join(", ")}
              </span>
            </button>
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#94A3B8",
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 0",
              }}
            >
              {status === "idle" || status === "requesting"
                ? "Contacts not loaded yet"
                : "Select at least one friend"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SplitEase() {
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState("");
  const [desc, setDesc] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [people, setPeople] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [qrImage, setQrImage] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [includedMe, setIncludedMe] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const [showContacts, setShowContacts] = useState(false);

  const fileRef = useRef();
  const billRef = useRef();
  const nameRef = useRef();
  const summaryRef = useRef();
  const qrRef = useRef();
  const billPanelRef = useRef();

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  const totalNum = parseFloat(total) || 0;

  const addPerson = (name) => {
    const n = (name || nameInput).trim();
    if (!n || people.includes(n)) return;
    setPeople((p) => [...p, n]);
    setNameInput("");
    nameRef.current?.focus();
  };

  const addFromContacts = (names) => {
    setPeople((prev) => [...prev, ...names.filter((n) => !prev.includes(n))]);
  };

  const includeMe = () => {
    if (includedMe || people.includes(OWNER)) return;
    setPeople((p) => [...p, OWNER]);
    setIncludedMe(true);
  };

  const removePerson = (name) => {
    setPeople((p) => p.filter((x) => x !== name));
    setAmounts((a) => {
      const b = { ...a };
      delete b[name];
      return b;
    });
    if (name === OWNER) setIncludedMe(false);
  };

  const setAmount = (name, val) => setAmounts((a) => ({ ...a, [name]: val }));

  const lockedTotal = people.reduce((s, p) => {
    const v = parseFloat(amounts[p]);
    return s + (isNaN(v) ? 0 : v);
  }, 0);
  const unlockedCount = people.filter(
    (p) => amounts[p] === undefined || amounts[p] === ""
  ).length;
  const remainder = Math.max(0, totalNum - lockedTotal);
  const splitShare = unlockedCount > 0 ? remainder / unlockedCount : 0;
  const overBudget = lockedTotal > totalNum + 0.001;
  const getEff = (name) => {
    const v = parseFloat(amounts[name]);
    return isNaN(v) || amounts[name] === "" ? splitShare : v;
  };

  const panelCount = 1 + (qrImage ? 1 : 0) + (billImage ? 1 : 0);

  const handleShare = async () => {
    setSharing(true);
    try {
      await loadHtml2Canvas();
      const files = [];
      files.push(await nodeToFile(summaryRef.current, "splitease-summary.png"));
      if (qrImage && qrRef.current)
        files.push(await nodeToFile(qrRef.current, "splitease-qr.png"));
      if (billImage && billPanelRef.current)
        files.push(
          await nodeToFile(billPanelRef.current, "splitease-bill.png")
        );

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files })
      ) {
        await navigator.share({
          title: "SplitEase",
          text: desc ? `Bill split: ${desc}` : "Here's our bill split! 🍽",
          files,
        });
      } else {
        for (const file of files) {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(file);
          a.download = file.name;
          a.click();
          await new Promise((r) => setTimeout(r, 300));
        }
        alert(`${files.length} image${files.length > 1 ? "s" : ""} saved!`);
      }
    } catch (e) {
      if (e?.name !== "AbortError")
        alert("Couldn't share. Try a screenshot instead.");
    }
    setSharing(false);
  };

  const goReset = () => {
    setStep(1);
    setTotal("");
    setDesc("");
    setPeople([]);
    setAmounts({});
    setQrImage(null);
    setBillImage(null);
    setIncludedMe(false);
  };

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <div className="logo-pill">
          <div>
            <div className="logo-title">SplitEase</div>
            {/* <div className="logo-sub">by Hang Daro</div> */}
          </div>
        </div>
        <p className="tagline">Split bills without the drama ✨</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="theme-toggle" onClick={() => setDark((d) => !d)}>
            <span>{dark ? "🌙" : "☀️"}</span>
            <span>{dark ? "Dark" : "Light"}</span>
            <div className={`toggle-track ${dark ? "on" : ""}`}>
              <div className={`toggle-thumb ${dark ? "on" : ""}`} />
            </div>
          </div>
        </div>
        <StepBar current={step} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <div className="s-label">Total Bill</div>
          <label className="field-label">How much is the bill?</label>
          <div style={{ marginBottom: 20 }}>
            <input
              className="amount-input"
              type="number"
              min="0"
              placeholder="0.00"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && totalNum > 0 && setStep(2)}
              autoFocus
            />
          </div>
          <label className="field-label">
            Description <span className="field-muted">(optional)</span>
          </label>
          <textarea
            className="inp"
            placeholder="e.g. Dinner at Topaz, Birthday party, Trip to Kep…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
          />
          <button
            className="btn-primary"
            disabled={totalNum <= 0}
            onClick={() => totalNum > 0 && setStep(2)}
            style={{ opacity: totalNum <= 0 ? 0.4 : 1 }}
          >
            Continue <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card">
          <div className="s-label">
            <div className="s-label-icon"></div>
            Who's Splitting?
          </div>

          <div className="info-band">
            Total: <strong>{fmt(totalNum)}</strong>
            {desc && (
              <em style={{ fontWeight: 400, opacity: 0.8 }}> · {desc}</em>
            )}
          </div>

          <button
            className={`me-btn ${includedMe ? "joined" : ""}`}
            disabled={includedMe}
            onClick={includeMe}
          >
            <Avatar name="Y" color={COLORS[0]} size={36} />
            <div style={{ textAlign: "left", flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: includedMe ? "var(--green2)" : "var(--text)",
                }}
              >
                {includedMe ? "✓ You're in!" : "Count me in"}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}
              >
                Add yourself to the split
              </div>
            </div>
            <span style={{ fontSize: 18 }}>{includedMe ? "✅" : "👋"}</span>
          </button>

          <button
            className="contacts-btn"
            onClick={() => setShowContacts(true)}
          >
            <div style={{ display: "flex", flexShrink: 0 }}>
              {FALLBACK_CONTACTS.slice(0, 3).map((c, i) => (
                <div
                  key={c.name}
                  style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}
                >
                  <Avatar
                    name={c.name}
                    color={COLORS[(i + 1) % COLORS.length]}
                    size={30}
                  />
                </div>
              ))}
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <div
                style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}
              >
                Select from contacts
              </div>
              <div
                style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}
              >
                Tap to load your phone contacts
              </div>
            </div>
            <div className="badge">→</div>
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">OR ADD MANUALLY</span>
            <div className="divider-line" />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              ref={nameRef}
              className="inp"
              placeholder="Enter name…"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPerson()}
              style={{ flex: 1 }}
            />
            <button className="add-btn" onClick={() => addPerson()}>
              +
            </button>
          </div>

          {people.map((name, i) => {
            const isMe = name === OWNER;
            const contact = FALLBACK_CONTACTS.find((c) => c.name === name);
            return (
              <div
                key={name}
                className="person-chip"
                style={{
                  background: isMe
                    ? "linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.06))"
                    : "rgba(99,102,241,0.06)",
                  border: `1.5px solid ${
                    isMe ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.12)"
                  }`,
                }}
              >
                <Avatar
                  name={isMe ? "Y" : name}
                  color={COLORS[i % COLORS.length]}
                  size={34}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: isMe ? "var(--green2)" : "var(--text)",
                      fontSize: 14,
                    }}
                  >
                    {isMe ? "You" : name}
                  </span>
                  {contact && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontWeight: 500,
                      }}
                    >
                      {contact.nickname}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removePerson(name)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    fontSize: 20,
                    cursor: "pointer",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}

          {people.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "var(--muted)",
                fontSize: 13,
                padding: "8px 0",
              }}
            >
              Add at least 2 people to split the bill
            </p>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn-ghost" onClick={() => setStep(1)}>
              ← Back
            </button>
            <button
              className="btn-primary"
              style={{
                flex: 1,
                marginTop: 0,
                opacity: people.length < 2 ? 0.4 : 1,
              }}
              disabled={people.length < 2}
              onClick={() => people.length >= 2 && setStep(3)}
            >
              {people.length < 2
                ? `Need ${2 - people.length} more`
                : `Split ${people.length} ways →`}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card">
          <div className="s-label">
            <div className="s-label-icon">⚖️</div>
            Custom Amounts
          </div>
          <p
            style={{
              color: "var(--sub)",
              fontSize: 13,
              margin: "0 0 18px",
              fontWeight: 500,
            }}
          >
            Set a fixed amount for anyone who paid more — the rest splits
            evenly.
          </p>

          <div className="progress-wrap">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "var(--sub)" }}
              >
                Allocated
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: overBudget ? "var(--red)" : "var(--green2)",
                }}
              >
                {fmt(lockedTotal)} / {fmt(totalNum)}
              </span>
            </div>
            <div className="progress-bg">
              <div
                className={`progress-fill ${overBudget ? "over" : ""}`}
                style={{
                  width: `${Math.min(100, (lockedTotal / totalNum) * 100)}%`,
                }}
              />
            </div>
            {overBudget && (
              <p
                style={{
                  color: "var(--red)",
                  fontSize: 12,
                  margin: "8px 0 0",
                  fontWeight: 700,
                }}
              >
                ⚠️ Over by {fmt(lockedTotal - totalNum)}
              </p>
            )}
          </div>

          {people.map((name, i) => {
            const isAuto = amounts[name] === undefined || amounts[name] === "";
            const isMe = name === OWNER;
            const contact = FALLBACK_CONTACTS.find((c) => c.name === name);
            return (
              <div
                key={name}
                className={`split-row ${
                  isMe ? "is-me" : isAuto ? "is-auto" : "is-custom"
                }`}
              >
                <Avatar
                  name={isMe ? "Y" : name}
                  color={COLORS[i % COLORS.length]}
                  size={36}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 800,
                      color: isMe ? "var(--green2)" : "var(--text)",
                      fontSize: 14,
                    }}
                  >
                    {isMe ? "You" : name}
                  </div>
                  {contact && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontWeight: 500,
                      }}
                    >
                      {contact.nickname}
                    </div>
                  )}
                  {isAuto && (
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--accent)",
                        marginTop: 1,
                      }}
                    >
                      auto · {fmt(splitShare)}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder="custom"
                  className={`custom-input ${!isAuto ? "is-set" : ""}`}
                  value={amounts[name] || ""}
                  onChange={(e) => setAmount(name, e.target.value)}
                />
                {!isAuto && (
                  <button
                    className="reset-btn"
                    onClick={() => setAmount(name, "")}
                  >
                    ↺
                  </button>
                )}
              </div>
            );
          })}

          {unlockedCount > 0 && (
            <div
              style={{
                textAlign: "center",
                background:
                  "linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.06))",
                border: "1.5px solid rgba(99,102,241,0.15)",
                borderRadius: 12,
                padding: "10px 16px",
                margin: "4px 0 14px",
              }}
            >
              <span
                style={{
                  color: "var(--accent)",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {unlockedCount} person{unlockedCount > 1 ? "s" : ""} split{" "}
                {fmt(remainder)} → {fmt(splitShare)} each
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => setStep(2)}>
              ← Back
            </button>
            <button
              className="btn-primary"
              style={{ flex: 1, marginTop: 0, opacity: overBudget ? 0.4 : 1 }}
              disabled={overBudget}
              onClick={() => !overBudget && setStep(4)}
            >
              See Summary →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div style={{ width: "100%" }}>
          {/* Summary — hardcoded light colors, correct in both modes */}
          <div ref={summaryRef} className="share-panel">
            <div className="share-panel-header">
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 900, color: "#ffffff" }}
                >
                  🍽 SplitEase
                </div>
                {/* <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 600,
                  }}
                >
                  by Hang Daro
                </div> */}
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  TOTAL
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-1px",
                  }}
                >
                  {fmt(totalNum)}
                </div>
              </div>
            </div>
            <div className="share-panel-body">
              {desc && (
                <div
                  style={{
                    background: "rgba(16,185,129,0.07)",
                    border: "1.5px solid rgba(16,185,129,0.18)",
                    borderRadius: 12,
                    padding: "9px 14px",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}
                  >
                    📝 {desc}
                  </span>
                </div>
              )}
              {people.map((name, i) => (
                <div key={name} className="share-row">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Avatar
                      name={name === OWNER ? "Y" : name}
                      color={COLORS[i % COLORS.length]}
                      size={32}
                    />
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#0F172A",
                        fontSize: 15,
                      }}
                    >
                      {name === OWNER ? "You" : name}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 18,
                      color: "#0F172A",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {fmt(getEff(name))}
                  </div>
                </div>
              ))}
            </div>
            <div className="share-panel-footer">
              <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>
                Made with SplitEase · by Hang Daro
              </span>
            </div>
          </div>

          {/* QR */}
          {qrImage && (
            <div ref={qrRef} className="share-panel" style={{ marginTop: 12 }}>
              <div className="share-panel-header">
                <div
                  style={{ fontSize: 15, fontWeight: 900, color: "#ffffff" }}
                >
                  🔳 Scan to Pay
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  {fmt(totalNum)}
                </div>
              </div>
              <div
                className="share-panel-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {desc && (
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#059669",
                      margin: "0 0 12px",
                      textAlign: "center",
                    }}
                  >
                    📝 {desc}
                  </p>
                )}
                <img
                  src={qrImage}
                  alt="QR"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "2px solid rgba(99,102,241,0.12)",
                  }}
                />
              </div>
              <div className="share-panel-footer">
                <span
                  style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}
                >
                  Made with SplitEase · by Hang Daro
                </span>
              </div>
            </div>
          )}

          {/* Bill */}
          {billImage && (
            <div
              ref={billPanelRef}
              className="share-panel"
              style={{ marginTop: 12 }}
            >
              <div className="share-panel-header">
                <div
                  style={{ fontSize: 15, fontWeight: 900, color: "#ffffff" }}
                >
                  🧾 Bill Receipt
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  {fmt(totalNum)}
                </div>
              </div>
              <div
                className="share-panel-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {desc && (
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#059669",
                      margin: "0 0 12px",
                      textAlign: "center",
                    }}
                  >
                    📝 {desc}
                  </p>
                )}
                <img
                  src={billImage}
                  alt="Bill"
                  style={{
                    width: "100%",
                    borderRadius: 14,
                    border: "2px solid rgba(99,102,241,0.12)",
                  }}
                />
              </div>
              <div className="share-panel-footer">
                <span
                  style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}
                >
                  Made with SplitEase · by Hang Daro
                </span>
              </div>
            </div>
          )}

          {/* Note */}
          {!editingDesc ? (
            <div
              className="note-bar"
              onClick={() => {
                setDescDraft(desc);
                setEditingDesc(true);
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: desc ? "var(--accent)" : "var(--muted)",
                }}
              >
                {desc ? `📝 ${desc}` : "✏️ Add a note…"}
              </span>
              <span className="tag">edit</span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                className="inp"
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDesc(descDraft);
                    setEditingDesc(false);
                  }
                  if (e.key === "Escape") setEditingDesc(false);
                }}
                placeholder="e.g. Dinner at Topaz…"
                style={{ flex: 1, borderColor: "var(--accent)" }}
                autoFocus
              />
              <button
                onClick={() => {
                  setDesc(descDraft);
                  setEditingDesc(false);
                }}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "var(--accent)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "var(--ff)",
                }}
              >
                Save
              </button>
              <button
                className="btn-ghost"
                style={{ padding: "10px 12px" }}
                onClick={() => setEditingDesc(false)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Attach images */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div className="s-label">Attach Images</div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--sub)",
                    marginBottom: 8,
                  }}
                >
                  Payment QR
                </div>
                <div
                  className={`upload-zone ${qrImage ? "has-img" : ""}`}
                  onClick={() => fileRef.current.click()}
                >
                  {qrImage ? (
                    <img
                      src={qrImage}
                      alt="QR"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 90,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 28 }}>🔳</div>
                      <p
                        style={{
                          color: "var(--muted)",
                          margin: "6px 0 0",
                          fontSize: 11,
                        }}
                      >
                        Tap to upload
                      </p>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = (ev) => setQrImage(ev.target.result);
                      r.readAsDataURL(f);
                    }}
                  />
                </div>
                {qrImage && (
                  <button
                    className="btn-ghost"
                    style={{
                      width: "100%",
                      marginTop: 6,
                      fontSize: 12,
                      padding: "7px 10px",
                    }}
                    onClick={() => setQrImage(null)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--sub)",
                    marginBottom: 8,
                  }}
                >
                  Bill Screenshot
                </div>
                <div
                  className={`upload-zone ${billImage ? "has-img" : ""}`}
                  onClick={() => billRef.current.click()}
                >
                  {billImage ? (
                    <img
                      src={billImage}
                      alt="Bill"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 90,
                        borderRadius: 10,
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 28 }}>🧾</div>
                      <p
                        style={{
                          color: "var(--muted)",
                          margin: "6px 0 0",
                          fontSize: 11,
                        }}
                      >
                        Tap to upload
                      </p>
                    </>
                  )}
                  <input
                    ref={billRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = (ev) => setBillImage(ev.target.result);
                      r.readAsDataURL(f);
                    }}
                  />
                </div>
                {billImage && (
                  <button
                    className="btn-ghost"
                    style={{
                      width: "100%",
                      marginTop: 6,
                      fontSize: 12,
                      padding: "7px 10px",
                    }}
                    onClick={() => setBillImage(null)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 11,
                margin: "12px 0 0",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Both images appear in the shared summary
            </p>
          </div>

          <button
            className="btn-primary btn-green"
            style={{ marginTop: 14, opacity: sharing ? 0.7 : 1 }}
            disabled={sharing}
            onClick={handleShare}
          >
            {sharing ? (
              <>
                <span>⏳</span> Capturing {panelCount} images…
              </>
            ) : (
              <>
                <span style={{ fontSize: 18 }}>📤</span> Share Summary
                <span className="float-badge">
                  {panelCount} {panelCount === 1 ? "image" : "images"}
                </span>
              </>
            )}
          </button>

          <button
            className="btn-ghost"
            style={{ width: "100%", marginTop: 10, display: "block" }}
            onClick={goReset}
          >
            🔄 Start Over
          </button>
        </div>
      )}

      <div className="footer">
        <p style={{ color: "var(--muted)", fontSize: 12, fontWeight: 500 }}>
          Built with ❤️ by{" "}
          <strong style={{ color: "var(--sub)" }}>Hang Daro</strong>
        </p>
      </div>

      <ContactsSheet
        open={showContacts}
        onClose={() => setShowContacts(false)}
        onAdd={addFromContacts}
        alreadyAdded={people}
      />
    </div>
  );
}

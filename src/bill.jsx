import { useState, useRef, useEffect } from "react";

const COLORS = ["#F87171","#FBBF24","#34D399","#60A5FA","#A78BFA","#FB923C","#2DD4BF","#F472B6"];
const L = {
  bg: "#F5F4F0", card: "#FFFFFF", shadow: "0 2px 20px rgba(0,0,0,.07)",
  border: "#E8E6E0", text: "#1C1917", sub: "#78716C", muted: "#A8A29E",
  accent: "#16A34A", accentBg: "#DCFCE7", danger: "#DC2626",
  input: "#FAF9F6", inputBorder: "#E0DDD6",
};

function Avatar({ name, color, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 800, fontSize: size * 0.38, color: "#fff", flexShrink: 0,
      boxShadow: `0 2px 8px ${color}55`,
    }}>
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

function StepDots({ current }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12 }}>
      {[1, 2, 3, 4].map(s => (
        <div key={s} style={{
          height: 6, borderRadius: 99,
          width: current === s ? 24 : 6,
          background: current === s ? L.accent : L.border,
          transition: "all .3s",
        }} />
      ))}
    </div>
  );
}

export default function BillSplitter() {
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState("");
  const [desc, setDesc] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [people, setPeople] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [qrImage, setQrImage] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [qrPerson, setQrPerson] = useState(null);
  const [sharing, setSharing] = useState(false);
  const fileRef = useRef();
  const nameRef = useRef();
  const summaryRef = useRef();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);

  const totalNum = parseFloat(total) || 0;
  const addPerson = () => {
    const name = nameInput.trim();
    if (!name || people.includes(name)) return;
    setPeople(p => [...p, name]);
    setNameInput("");
    nameRef.current?.focus();
  };
  const removePerson = (name) => {
    setPeople(p => p.filter(x => x !== name));
    setAmounts(a => { const b = { ...a }; delete b[name]; return b; });
  };
  const setAmount = (name, val) => setAmounts(a => ({ ...a, [name]: val }));

  const lockedTotal = people.reduce((s, p) => {
    const v = parseFloat(amounts[p]); return s + (isNaN(v) ? 0 : v);
  }, 0);
  const unlockedCount = people.filter(p => amounts[p] === undefined || amounts[p] === "").length;
  const remainder = Math.max(0, totalNum - lockedTotal);
  const splitShare = unlockedCount > 0 ? remainder / unlockedCount : 0;
  const overBudget = lockedTotal > totalNum + 0.001;
  const getEff = (name) => {
    const v = parseFloat(amounts[name]);
    return isNaN(v) || amounts[name] === "" ? splitShare : v;
  };
  const fmt = (n) => Number(n).toFixed(2);

  const handleShare = async () => {
    setSharing(true);
    try {
      if (!window.html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const canvas = await window.html2canvas(summaryRef.current, {
        scale: 3, useCORS: true, backgroundColor: L.bg, logging: false,
      });

      // Try native share sheet (works on mobile — Telegram, WhatsApp, etc.)
      if (navigator.share && navigator.canShare) {
        const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        const file = new File([blob], "split-summary.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: "SplitEase Summary",
            text: desc ? `Bill split: ${desc}` : "Here's our bill split!",
            files: [file],
          });
          setSharing(false);
          return;
        }
      }

      // Fallback: download
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "split-summary.png";
      a.click();
      alert("Image saved! Open your Files and share to Telegram manually.");
    } catch (e) {
      if (e?.name !== "AbortError") {
        alert("Could not share. Try a screenshot instead.");
      }
    }
    setSharing(false);
  };

  const card = {
    background: L.card, borderRadius: 20, boxShadow: L.shadow,
    padding: "24px 22px", width: "100%", maxWidth: 440,
    boxSizing: "border-box", marginTop: 20, border: `1px solid ${L.border}`,
  };
  const sLabel = {
    fontSize: 10, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
    color: L.muted, marginBottom: 14, display: "block",
  };
  const inp = {
    width: "100%", boxSizing: "border-box", background: L.input,
    border: `1.5px solid ${L.inputBorder}`, borderRadius: 10,
    padding: "12px 14px", color: L.text, fontSize: 15, outline: "none",
    fontFamily: "'Nunito', sans-serif",
  };
  const btnPri = {
    width: "100%", padding: "13px", borderRadius: 12, background: L.text,
    color: "#fff", fontWeight: 800, fontSize: 15, border: "none",
    cursor: "pointer", fontFamily: "'Nunito', sans-serif", marginTop: 14,
  };
  const btnSec = {
    padding: "12px 18px", borderRadius: 12, background: "transparent",
    color: L.sub, fontWeight: 700, fontSize: 14,
    border: `1.5px solid ${L.border}`, cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: L.bg, fontFamily: "'Nunito', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 60px" }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 440, textAlign: "center", padding: "36px 0 0" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: L.text, margin: 0, letterSpacing: "-0.5px" }}>🍽 SplitEase</h1>
        <p style={{ color: L.muted, fontSize: 13, margin: "4px 0 0" }}>Split bills without the drama</p>
        <StepDots current={step} />
      </div>

      {/* ─── STEP 1 ─── */}
      {step === 1 && (
        <div style={card}>
          <span style={sLabel}>Step 1 of 4 — Total Bill</span>
          <label style={{ fontSize: 12, fontWeight: 700, color: L.sub, display: "block", marginBottom: 6 }}>Total Amount</label>
          <input
            style={{ ...inp, fontSize: 30, fontWeight: 900, paddingLeft: 14, marginBottom: 14 }}
            type="number" min="0" placeholder="0.00"
            value={total} onChange={e => setTotal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && totalNum > 0 && setStep(2)}
          />
          <label style={{ fontSize: 12, fontWeight: 700, color: L.sub, display: "block", marginBottom: 6 }}>
            Description <span style={{ color: L.muted, fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            style={{ ...inp, resize: "none", minHeight: 70, fontSize: 14 }}
            placeholder="e.g. Dinner at Topaz, Birthday party, Trip to Kep…"
            value={desc} onChange={e => setDesc(e.target.value)} rows={2}
          />
          <button style={{ ...btnPri, opacity: totalNum <= 0 ? .4 : 1 }}
            onClick={() => totalNum > 0 && setStep(2)} disabled={totalNum <= 0}>
            Continue →
          </button>
        </div>
      )}

      {/* ─── STEP 2 ─── */}
      {step === 2 && (
        <div style={card}>
          <span style={sLabel}>Step 2 of 4 — Who's Splitting?</span>
          <p style={{ color: L.sub, fontSize: 13, margin: "0 0 14px" }}>
            Total: <strong style={{ color: L.text }}>{fmt(totalNum)}</strong>
            {desc && <> · <em style={{ color: L.muted }}>{desc}</em></>}
          </p>
          <label style={{ fontSize: 12, fontWeight: 700, color: L.sub, display: "block", marginBottom: 6 }}>Add person</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input ref={nameRef} style={{ ...inp, flex: 1 }} placeholder="Name…"
              value={nameInput} onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPerson()} />
            <button onClick={addPerson} style={{
              width: 46, height: 46, borderRadius: 10, background: L.text,
              border: "none", color: "#fff", fontWeight: 900, fontSize: 24, cursor: "pointer",
            }}>+</button>
          </div>
          {people.map((name, i) => (
            <div key={name} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: L.bg, borderRadius: 40, padding: "8px 12px 8px 10px",
              marginBottom: 8, border: `1px solid ${L.border}`,
            }}>
              <Avatar name={name} color={COLORS[i % COLORS.length]} size={34} />
              <span style={{ fontWeight: 700, color: L.text, flex: 1 }}>{name}</span>
              <button onClick={() => removePerson(name)} style={{ background: "none", border: "none", color: L.muted, fontSize: 18, cursor: "pointer", padding: 0 }}>×</button>
            </div>
          ))}
          {people.length === 0 && <p style={{ textAlign: "center", color: L.muted, fontSize: 13 }}>No people yet…</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={btnSec} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...btnPri, flex: 1, margin: 0, opacity: people.length < 2 ? .4 : 1 }}
              onClick={() => people.length >= 2 && setStep(3)} disabled={people.length < 2}>
              {people.length < 2 ? `Add ${2 - people.length} more` : `Split ${people.length} ways →`}
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 3 ─── */}
      {step === 3 && (
        <div style={card}>
          <span style={sLabel}>Step 3 of 4 — Custom Amounts</span>
          <p style={{ color: L.sub, fontSize: 13, margin: "0 0 14px" }}>
            Enter fixed amounts for whoever paid more. Others auto-split the rest.
          </p>
          {/* Budget bar */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: L.muted }}>Allocated</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: overBudget ? L.danger : L.accent }}>
                {fmt(lockedTotal)} / {fmt(totalNum)}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: L.border, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99, transition: "width .3s",
                background: overBudget ? L.danger : L.accent,
                width: `${Math.min(100, (lockedTotal / totalNum) * 100)}%`,
              }} />
            </div>
            {overBudget && <p style={{ color: L.danger, fontSize: 12, margin: "5px 0 0" }}>⚠️ Over budget by {fmt(lockedTotal - totalNum)}</p>}
          </div>
          {people.map((name, i) => {
            const isAuto = amounts[name] === undefined || amounts[name] === "";
            return (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
                padding: "10px 12px", background: L.bg, borderRadius: 12, border: `1px solid ${L.border}`,
              }}>
                <Avatar name={name} color={COLORS[i % COLORS.length]} size={34} />
                <span style={{ flex: 1, fontWeight: 700, color: L.text, fontSize: 14 }}>{name}</span>
                {isAuto && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: L.accent, background: L.accentBg, padding: "2px 8px", borderRadius: 99 }}>
                    {fmt(splitShare)}
                  </span>
                )}
                <input type="number" min="0" placeholder="custom"
                  value={amounts[name] || ""}
                  onChange={e => setAmount(name, e.target.value)}
                  style={{
                    width: 90, padding: "7px 10px", borderRadius: 8,
                    border: `1.5px solid ${isAuto ? L.inputBorder : L.accent}`,
                    background: "#fff", fontSize: 13, fontWeight: 700,
                    color: L.text, outline: "none", fontFamily: "'Nunito', sans-serif",
                  }} />
                {!isAuto && (
                  <button onClick={() => setAmount(name, "")} style={{ background: "none", border: "none", color: L.muted, cursor: "pointer", fontSize: 15, padding: 0 }} title="Reset">↺</button>
                )}
              </div>
            );
          })}
          {unlockedCount > 0 && (
            <p style={{ textAlign: "center", color: L.muted, fontSize: 12, margin: "4px 0 10px" }}>
              {unlockedCount} person{unlockedCount > 1 ? "s" : ""} auto-split: {fmt(remainder)} ÷ {unlockedCount} = <strong style={{ color: L.accent }}>{fmt(splitShare)}</strong> each
            </p>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button style={btnSec} onClick={() => setStep(2)}>← Back</button>
            <button style={{ ...btnPri, flex: 1, margin: 0, opacity: overBudget ? .4 : 1 }}
              onClick={() => !overBudget && setStep(4)} disabled={overBudget}>
              See Summary →
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 4 ─── */}
      {step === 4 && (
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* ── CAPTURE ZONE ── */}
          <div ref={summaryRef} style={{ background: L.bg, paddingBottom: 8 }}>
            <div style={{ ...card, marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={sLabel}>Summary · {people.length} people</span>
                <span style={{ fontSize: 10, color: L.muted, fontWeight: 700, letterSpacing: .5 }}>SplitEase</span>
              </div>

              {desc && (
                <div style={{ background: L.bg, borderRadius: 10, padding: "9px 12px", marginBottom: 14, border: `1px solid ${L.border}` }}>
                  <p style={{ margin: 0, color: L.sub, fontSize: 13 }}>📝 {desc}</p>
                </div>
              )}

              {people.map((name, i) => (
                <div key={name}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={name} color={COLORS[i % COLORS.length]} size={38} />
                      <span style={{ fontWeight: 700, color: L.text, fontSize: 15 }}>{name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 900, fontSize: 16, color: L.text }}>{fmt(getEff(name))}</span>
                      <button onClick={() => { setQrPerson(name); setQrModal(true); }} style={{
                        background: L.bg, border: `1px solid ${L.border}`,
                        borderRadius: 8, padding: "5px 10px", cursor: "pointer",
                        fontSize: 12, fontWeight: 700, color: L.sub, fontFamily: "'Nunito', sans-serif",
                      }}>📷 QR</button>
                    </div>
                  </div>
                  {i < people.length - 1 && <div style={{ height: 1, background: L.border }} />}
                </div>
              ))}

              {/* Total */}
              <div style={{
                marginTop: 14, padding: "13px 16px", borderRadius: 12, background: L.text,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ color: "rgba(255,255,255,.65)", fontWeight: 700, fontSize: 14 }}>Total</span>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 20 }}>{fmt(totalNum)}</span>
              </div>
            </div>

            {/* QR inside capture */}
            {qrImage && (
              <div style={{ ...card, marginTop: 12, textAlign: "center" }}>
                <span style={sLabel}>Scan to Pay</span>
                <img src={qrImage} alt="QR" style={{ width: "100%", maxHeight: 200, objectFit: "contain", borderRadius: 12 }} />
              </div>
            )}
          </div>

          {/* ── SHARE BUTTON ── */}
          <div style={{ maxWidth: 440, width: "100%", boxSizing: "border-box" }}>
            <button onClick={handleShare} disabled={sharing} style={{
              ...btnPri,
              background: "linear-gradient(135deg,#16A34A,#15803D)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: sharing ? .6 : 1, marginTop: 14,
            }}>
              {sharing ? "⏳ Capturing…" : "📤 Share Summary as Image"}
            </button>

            {/* QR Upload */}
            <div style={{ ...card, marginTop: 12 }}>
              <span style={sLabel}>Payment QR Code</span>
              <p style={{ color: L.muted, fontSize: 12, margin: "0 0 10px" }}>
                Upload your ABA / Wing / KHQR so others can scan to pay you.
              </p>
              <div onClick={() => fileRef.current.click()} style={{
                border: `2px dashed ${qrImage ? L.accent : L.inputBorder}`, borderRadius: 14,
                padding: 18, textAlign: "center", cursor: "pointer",
                background: qrImage ? L.accentBg : L.bg, transition: "all .2s",
              }}>
                {qrImage
                  ? <img src={qrImage} alt="QR" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 10 }} />
                  : (<><div style={{ fontSize: 32 }}>🔳</div><p style={{ color: L.muted, margin: "8px 0 0", fontSize: 13 }}>Tap to upload QR code</p></>)
                }
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const f = e.target.files[0]; if (!f) return;
                  const r = new FileReader(); r.onload = ev => setQrImage(ev.target.result); r.readAsDataURL(f);
                }} />
              </div>
              {qrImage && <button onClick={() => setQrImage(null)} style={{ ...btnSec, width: "100%", marginTop: 8, boxSizing: "border-box" }}>Remove QR</button>}
            </div>

            <button style={{ ...btnSec, width: "100%", marginTop: 8, boxSizing: "border-box" }}
              onClick={() => { setStep(1); setTotal(""); setDesc(""); setPeople([]); setAmounts({}); setQrImage(null); }}>
              🔄 Start Over
            </button>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrModal && (
        <div onClick={() => setQrModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.45)",
          backdropFilter: "blur(6px)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 24, padding: 28,
            maxWidth: 320, width: "90%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,.2)",
          }}>
            <p style={{ color: L.muted, margin: "0 0 2px", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5 }}>Pay to</p>
            <p style={{ color: L.text, fontWeight: 900, fontSize: 22, margin: "0 0 2px" }}>{qrPerson}</p>
            <p style={{ color: L.accent, fontWeight: 900, fontSize: 30, margin: "0 0 16px" }}>
              {qrPerson ? fmt(getEff(qrPerson)) : ""}
            </p>
            {qrImage
              ? <img src={qrImage} alt="QR" style={{ width: "100%", borderRadius: 16, border: `3px solid ${L.border}` }} />
              : <div style={{ padding: 24, border: `2px dashed ${L.border}`, borderRadius: 16, color: L.muted, fontSize: 13 }}>
                  No QR uploaded yet.<br /><span style={{ fontSize: 12 }}>Go back and add one!</span>
                </div>
            }
            <button style={{ ...btnPri, marginTop: 16 }} onClick={() => setQrModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useRef, useEffect } from "react";

const OWNER = "Daro";
const COLORS = ["#FF6B6B","#FBBF24","#34D399","#60A5FA","#A78BFA","#FB923C","#2DD4BF","#F472B6","#84CC16","#F43F5E"];

const TRANSLATIONS = {
  km: {
    appTagline: "បែងចែកវិក្កយបត្រដោយគ្មានភាពស្មុគស្មាញ ✨",
    step1Label: "ចំនួនទឹកប្រាក់",
    step2Label: "អ្នករួមចែក",
    step3Label: "បែងចែក",
    step4Label: "សង្ខេប",
    totalBill: "វិក្កយបត្រសរុប",
    howMuch: "តើវិក្កយបត្រប៉ុន្មាន?",
    description: "ការពិពណ៌នា",
    optional: "(ស្រេចចិត្ត)",
    descPlaceholder: "ឧ. អាហារពេលល្ងាច, ពិធីខួបកំណើត, ទស្សនកិច្ចកែប…",
    continue: "បន្ត",
    whoSplitting: "តើអ្នកណារួមបែងចែក?",
    total: "សរុប",
    countMeIn: "រួមបញ្ចូលខ្ញុំ",
    youreIn: "✓ អ្នកបានចូលរួម!",
    addYourself: "បន្ថែមខ្លួនអ្នក",
    orAddSomeone: "ឬបន្ថែមអ្នកផ្សេង",
    enterName: "បញ្ចូលឈ្មោះ…",
    needMore: (n) => `ត្រូវការ ${n} នាក់ទៀត`,
    splitWays: (n) => `បែងចែក ${n} នាក់ →`,
    back: "← ថយក្រោយ",
    customAmounts: "ចំនួនទឹកប្រាក់កំណត់",
    customAmountsDesc: "កំណត់ចំនួនថេរសម្រាប់អ្នកដែលបង់ច្រើន — ដែលនៅសល់ចែកស្មើ។",
    allocated: "បានបែងចែក",
    overBudget: (n) => `⚠️ លើស ${n}`,
    autoSplit: (n) => `ស្វ័យប្រវត្តិ · ${n}`,
    customPlaceholder: "កំណត់",
    splitSummary: (count, rem, share) => `${count} នាក់ចែក ${rem} → ${share} នីមួយៗ`,
    seeSummary: "មើលសង្ខេប →",
    addReceiptNote: "✏️ បន្ថែមកំណត់ចំណាំ…",
    editLabel: "កែប្រែ",
    savePlaceholder: "ឧ. អាហារពេលល្ងាច, ពិធីខួបកំណើត…",
    save: "រក្សាទុក",
    scanToPay: "ស្កែនដើម្បីទូទាត់",
    billReceipt: "វិក្កយបត្រ",
    scanAndBill: "ស្កែនទូទាត់ · វិក្កយបត្រ",
    qrCode: "លេខ QR",
    receipt: "វិក្កយបត្រ",
    madeWith: "បង្កើតដោយ SplitEase · ដោយ Hang Daro",
    shareBtn: "📤 ចែករំលែកសង្ខេបជារូបភាព",
    capturing: "⏳ កំពុងថត…",
    attachImages: "ភ្ជាប់រូបភាព",
    paymentQr: "🔳 QR ទូទាត់",
    billScreenshot: "🧾 រូបថតវិក្កយបត្រ",
    tapToUpload: "ចុចដើម្បីបញ្ចូល",
    remove: "លុបចេញ",
    bothImagesNote: "រូបភាពទាំងពីរបង្ហាញក្នុងសង្ខេប 📤",
    startOver: "🔄 ចាប់ផ្តើមឡើងវិញ",
    builtBy: "បង្កើតដោយ ❤️",
    payTo: "បង់ទៅ",
    noQr: "🔳\n\nមិនទាន់មាន QR ទេ។",
    addQrHint: "ត្រឡប់ទៅបន្ថែម!",
    close: "បិទ",
    you: "អ្នក",
    alertSaved: "✅ រូបភាពបានរក្សាទុក! ចែករំលែកទៅ Telegram ពីឯកសារ។",
    alertError: "មិនអាចថតបាន។ សូមថតអេក្រង់ជំនួស។",
    atLeast2: "បន្ថែមយ៉ាងតិច 2 នាក់ដើម្បីបែងចែក",
  },
  en: {
    appTagline: "Split bills without the drama ✨",
    step1Label: "Amount",
    step2Label: "People",
    step3Label: "Split",
    step4Label: "Summary",
    totalBill: "Total Bill",
    howMuch: "How much is the bill?",
    description: "Description",
    optional: "(optional)",
    descPlaceholder: "e.g. Dinner at Topaz, Birthday party, Trip to Kep…",
    continue: "Continue",
    whoSplitting: "Who's Splitting?",
    total: "Total",
    countMeIn: "Count me in",
    youreIn: "✓ You're in!",
    addYourself: "Add yourself",
    orAddSomeone: "OR ADD SOMEONE",
    enterName: "Enter name…",
    needMore: (n) => `Need ${n} more`,
    splitWays: (n) => `Split ${n} ways →`,
    back: "← Back",
    customAmounts: "Custom Amounts",
    customAmountsDesc: "Set a fixed amount for anyone who paid more — the rest is split evenly.",
    allocated: "Allocated",
    overBudget: (n) => `⚠️ Over budget by ${n}`,
    autoSplit: (n) => `auto · ${n}`,
    customPlaceholder: "custom",
    splitSummary: (count, rem, share) => `${count} person${count > 1 ? "s" : ""} split ${rem} → ${share} each`,
    seeSummary: "See Summary →",
    addReceiptNote: "✏️ Add a receipt note…",
    editLabel: "edit",
    savePlaceholder: "e.g. Dinner at Topaz, Birthday party…",
    save: "Save",
    scanToPay: "Scan to Pay",
    billReceipt: "Bill Receipt",
    scanAndBill: "Scan to Pay · Bill Receipt",
    qrCode: "QR Code",
    receipt: "Receipt",
    madeWith: "Made with SplitEase · by Hang Daro",
    shareBtn: "📤 Share Summary as Image",
    capturing: "⏳ Capturing…",
    attachImages: "Attach Images",
    paymentQr: "🔳 Payment QR",
    billScreenshot: "🧾 Bill Screenshot",
    tapToUpload: "Tap to upload",
    remove: "Remove",
    bothImagesNote: "Both images appear in the shared summary 📤",
    startOver: "🔄 Start Over",
    builtBy: "Built with ❤️ by",
    payTo: "Pay to",
    noQr: "🔳\n\nNo QR uploaded yet.",
    addQrHint: "Go back and add one!",
    close: "Close",
    you: "you",
    alertSaved: "✅ Image saved! Share it to Telegram from your Files.",
    alertError: "Couldn't capture. Try a screenshot instead.",
    atLeast2: "Add at least 2 people to split the bill",
  },
};

const L = {
  bg: "#F7F5F2",
  card: "#FFFFFF",
  cardBorder: "rgba(0,0,0,.07)",
  shadow: "0 4px 32px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04)",
  shadowHover: "0 8px 40px rgba(0,0,0,.13)",
  text: "#18181B",
  sub: "#71717A",
  muted: "#A1A1AA",
  accent: "#22C55E",
  accentDark: "#16A34A",
  accentBg: "#F0FDF4",
  accentBorder: "#BBF7D0",
  danger: "#EF4444",
  dangerBg: "#FEF2F2",
  input: "#FAFAF9",
  inputBorder: "#E4E4E7",
  pill: "#F4F4F5",
};

function Avatar({ name, color, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${color}, ${color}cc)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: size * 0.4, color: "#fff", flexShrink: 0,
      boxShadow: `0 3px 10px ${color}44`,
      letterSpacing: "-0.5px",
    }}>
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

function StepBar({ current, labels }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "20px 0 0" }}>
      {labels.map((label, i) => {
        const s = i + 1;
        const done = current > s;
        const active = current === s;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 4 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? L.accentDark : active ? L.accent : L.inputBorder,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: done || active ? "#fff" : L.muted,
                transition: "all .3s", boxShadow: active ? `0 0 0 4px ${L.accentBg}` : "none",
              }}>
                {done ? "✓" : s}
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: active ? L.accentDark : L.muted, whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {s < 4 && (
              <div style={{ flex: 1, height: 2, background: done ? L.accentDark : L.inputBorder, margin: "0 4px", marginBottom: 18, transition: "background .3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BillSplitter() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("km");
  const t = TRANSLATIONS[lang];
  const [total, setTotal] = useState("");
  const [desc, setDesc] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [people, setPeople] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [qrImage, setQrImage] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [qrPerson, setQrPerson] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [includedMe, setIncludedMe] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState("");
  const fileRef = useRef();
  const billRef = useRef();
  const nameRef = useRef();
  const summaryRef = useRef();
  const descInputRef = useRef();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Hanuman:wght@400;700;900&display=swap";
    document.head.appendChild(link);
  }, []);

  const totalNum = parseFloat(total) || 0;

  const addPerson = (name) => {
    const n = (name || nameInput).trim();
    if (!n || people.includes(n)) return;
    setPeople(p => [...p, n]);
    setNameInput("");
    nameRef.current?.focus();
  };

  const includeMe = () => {
    if (includedMe || people.includes(OWNER)) return;
    setPeople(p => [...p, OWNER]);
    setIncludedMe(true);
  };

  const removePerson = (name) => {
    setPeople(p => p.filter(x => x !== name));
    setAmounts(a => { const b = { ...a }; delete b[name]; return b; });
    if (name === OWNER) setIncludedMe(false);
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
        scale: 3, useCORS: true, backgroundColor: "#FFFFFF", logging: false,
      });
      if (navigator.share && navigator.canShare) {
        const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
        const file = new File([blob], "splitease-summary.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: "SplitEase", text: desc ? `Bill split: ${desc}` : "Here's our bill split! 🍽", files: [file] });
          setSharing(false); return;
        }
      }
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "splitease-summary.png";
      a.click();
      alert(t.alertSaved);
    } catch (e) {
      if (e?.name !== "AbortError") alert(t.alertError);
    }
    setSharing(false);
  };

  // ── shared style tokens ──
  const ff = lang === "km" ? "'Hanuman', 'Plus Jakarta Sans', sans-serif" : "'Plus Jakarta Sans', sans-serif";
  const card = {
    background: L.card, borderRadius: 24, boxShadow: L.shadow,
    padding: "26px 24px", width: "100%", maxWidth: 460,
    boxSizing: "border-box", border: `1px solid ${L.cardBorder}`,
  };
  const sLabel = {
    fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
    color: L.muted, marginBottom: 16, display: "flex", alignItems: "center", gap: 6,
  };
  const inp = {
    width: "100%", boxSizing: "border-box", background: L.input,
    border: `1.5px solid ${L.inputBorder}`, borderRadius: 12,
    padding: "13px 15px", color: L.text, fontSize: 15, outline: "none", fontFamily: ff,
    transition: "border-color .2s",
  };
  const btnPrimary = (extra = {}) => ({
    width: "100%", padding: "14px 20px", borderRadius: 14, background: L.text,
    color: "#fff", fontWeight: 800, fontSize: 15, border: "none",
    cursor: "pointer", fontFamily: ff, letterSpacing: "-0.2px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "transform .15s, box-shadow .15s",
    ...extra,
  });
  const btnGhost = (extra = {}) => ({
    padding: "12px 18px", borderRadius: 12, background: "transparent",
    color: L.sub, fontWeight: 700, fontSize: 14,
    border: `1.5px solid ${L.inputBorder}`, cursor: "pointer", fontFamily: ff,
    ...extra,
  });

  return (
    <div style={{ minHeight: "100vh", background: L.bg, fontFamily: ff, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 80px" }}>

      {/* ── HEADER ── */}
      <div style={{ width: "100%", maxWidth: 460, textAlign: "center", padding: "40px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 20, padding: "10px 20px", boxShadow: L.shadow, border: `1px solid ${L.cardBorder}` }}>
            <span style={{ fontSize: 26 }}>🍽</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: L.text, letterSpacing: "-0.5px", lineHeight: 1.1 }}>SplitEase</div>
              <div style={{ fontSize: 10, color: L.muted, fontWeight: 600, letterSpacing: .5 }}>by Hang Daro</div>
            </div>
          </div>
          {/* Language Toggle */}
          <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: 4, boxShadow: L.shadow, border: `1px solid ${L.cardBorder}`, gap: 2 }}>
            {["km", "en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "6px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                fontFamily: ff, fontWeight: 800, fontSize: 12,
                background: lang === l ? L.text : "transparent",
                color: lang === l ? "#fff" : L.muted,
                transition: "all .2s",
              }}>
                {l === "km" ? "ខ្មែរ" : "EN"}
              </button>
            ))}
          </div>
        </div>
        <p style={{ color: L.sub, fontSize: 13, margin: 0, fontWeight: 500 }}>{t.appTagline}</p>
        <StepBar current={step} labels={[t.step1Label, t.step2Label, t.step3Label, t.step4Label]} />
      </div>

      {/* ── STEP 1: TOTAL ── */}
      {step === 1 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}><span>💰</span> {t.totalBill}</div>

          <label style={{ fontSize: 12, fontWeight: 700, color: L.sub, display: "block", marginBottom: 8 }}>{t.howMuch}</label>
          <div style={{ position: "relative", marginBottom: 20 }}>
            <input
              style={{ ...inp, fontSize: 36, fontWeight: 900, paddingRight: 14, letterSpacing: "-1px", textAlign: "center" }}
              type="number" min="0" placeholder="0.00"
              value={total} onChange={e => setTotal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && totalNum > 0 && setStep(2)}
              autoFocus
            />
          </div>

          <label style={{ fontSize: 12, fontWeight: 700, color: L.sub, display: "block", marginBottom: 8 }}>
            {t.description} <span style={{ color: L.muted, fontWeight: 500 }}>{t.optional}</span>
          </label>
          <textarea
            style={{ ...inp, resize: "none", minHeight: 72, fontSize: 14, lineHeight: 1.5 }}
            placeholder={t.descPlaceholder}
            value={desc} onChange={e => setDesc(e.target.value)} rows={2}
          />

          <button style={btnPrimary({ marginTop: 20, opacity: totalNum <= 0 ? .4 : 1, background: totalNum > 0 ? L.text : L.muted })}
            onClick={() => totalNum > 0 && setStep(2)} disabled={totalNum <= 0}>
            {t.continue} <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      )}

      {/* ── STEP 2: PEOPLE ── */}
      {step === 2 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}><span>👥</span> {t.whoSplitting}</div>

          <div style={{ background: L.accentBg, border: `1px solid ${L.accentBorder}`, borderRadius: 12, padding: "10px 14px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: L.accentDark }}>{t.total}: <strong>{fmt(totalNum)}</strong>{desc && <em style={{ fontWeight: 400, color: L.accentDark, opacity: .8 }}> · {desc}</em>}</span>
          </div>

          {/* Include me button */}
          <button
            onClick={includeMe}
            disabled={includedMe}
            style={{
              width: "100%", padding: "11px 16px", borderRadius: 12, marginBottom: 14,
              background: includedMe ? L.accentBg : "#fff",
              border: `2px ${includedMe ? "solid" : "dashed"} ${includedMe ? L.accentBorder : L.inputBorder}`,
              cursor: includedMe ? "default" : "pointer", fontFamily: ff,
              display: "flex", alignItems: "center", gap: 10, transition: "all .2s",
            }}
          >
            <Avatar name={OWNER} color={COLORS[0]} size={32} />
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: includedMe ? L.accentDark : L.text }}>
                {includedMe ? t.youreIn : t.countMeIn}
              </div>
              <div style={{ fontSize: 11, color: L.muted, fontWeight: 500 }}>{t.addYourself} ({OWNER})</div>
            </div>
            {!includedMe && <span style={{ fontSize: 18 }}>👋</span>}
            {includedMe && <span style={{ fontSize: 16, color: L.accentDark }}>✅</span>}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 1, background: L.inputBorder }} />
            <span style={{ fontSize: 11, color: L.muted, fontWeight: 600 }}>{t.orAddSomeone}</span>
            <div style={{ flex: 1, height: 1, background: L.inputBorder }} />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              ref={nameRef}
              style={{ ...inp, flex: 1 }}
              placeholder={t.enterName}
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addPerson()}
            />
            <button onClick={() => addPerson()} style={{
              width: 48, height: 48, borderRadius: 12, background: L.text, border: "none",
              color: "#fff", fontWeight: 900, fontSize: 26, cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          </div>

          <div style={{ marginBottom: 4 }}>
            {people.map((name, i) => (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: name === OWNER ? L.accentBg : L.pill,
                border: `1px solid ${name === OWNER ? L.accentBorder : "transparent"}`,
                borderRadius: 40, padding: "8px 12px 8px 8px", marginBottom: 8,
                transition: "all .2s",
              }}>
                <Avatar name={name} color={COLORS[i % COLORS.length]} size={34} />
                <span style={{ fontWeight: 700, color: name === OWNER ? L.accentDark : L.text, flex: 1, fontSize: 14 }}>
                  {name} {name === OWNER && <span style={{ fontSize: 11, fontWeight: 600, color: L.accentDark }}>({t.you})</span>}
                </span>
                <button onClick={() => removePerson(name)} style={{
                  background: "none", border: "none", color: L.muted,
                  fontSize: 20, cursor: "pointer", padding: "0 2px", lineHeight: 1,
                }}>×</button>
              </div>
            ))}
            {people.length === 0 && (
              <p style={{ textAlign: "center", color: L.muted, fontSize: 13, padding: "8px 0" }}>{t.atLeast2}</p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={btnGhost()} onClick={() => setStep(1)}>{t.back}</button>
            <button
              style={{ ...btnPrimary({ flex: 1, opacity: people.length < 2 ? .4 : 1 }), marginTop: 0 }}
              onClick={() => people.length >= 2 && setStep(3)} disabled={people.length < 2}>
              {people.length < 2 ? t.needMore(2 - people.length) : t.splitWays(people.length)}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: CUSTOM AMOUNTS ── */}
      {step === 3 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}><span>⚖️</span> {t.customAmounts}</div>
          <p style={{ color: L.sub, fontSize: 13, margin: "0 0 18px", fontWeight: 500 }}>
            {t.customAmountsDesc}
          </p>

          {/* Budget bar */}
          <div style={{ background: L.pill, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: L.sub }}>{t.allocated}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: overBudget ? L.danger : L.accentDark }}>
                {fmt(lockedTotal)} / {fmt(totalNum)}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: L.inputBorder, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99, transition: "width .4s cubic-bezier(.4,0,.2,1)",
                background: overBudget ? L.danger : `linear-gradient(90deg, ${L.accent}, ${L.accentDark})`,
                width: `${Math.min(100, (lockedTotal / totalNum) * 100)}%`,
              }} />
            </div>
            {overBudget && (
              <p style={{ color: L.danger, fontSize: 12, margin: "8px 0 0", fontWeight: 600 }}>{t.overBudget(fmt(lockedTotal - totalNum))}</p>
            )}
          </div>

          {people.map((name, i) => {
            const isAuto = amounts[name] === undefined || amounts[name] === "";
            const isMe = name === OWNER;
            return (
              <div key={name} style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                padding: "12px 14px",
                background: isMe ? L.accentBg : L.input,
                borderRadius: 14,
                border: `1.5px solid ${isMe ? L.accentBorder : isAuto ? "transparent" : L.accent}`,
                transition: "all .2s",
              }}>
                <Avatar name={name} color={COLORS[i % COLORS.length]} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, color: isMe ? L.accentDark : L.text, fontSize: 14 }}>
                    {name} {isMe && <span style={{ fontSize: 10, fontWeight: 600 }}>({t.you})</span>}
                  </div>
                  {isAuto && <div style={{ fontSize: 11, color: L.accent, fontWeight: 700 }}>{t.autoSplit(fmt(splitShare))}</div>}
                </div>
                <input
                  type="number" min="0" placeholder={t.customPlaceholder}
                  value={amounts[name] || ""}
                  onChange={e => setAmount(name, e.target.value)}
                  style={{
                    width: 90, padding: "8px 10px", borderRadius: 10,
                    border: `1.5px solid ${isAuto ? L.inputBorder : L.accent}`,
                    background: "#fff", fontSize: 14, fontWeight: 800,
                    color: L.text, outline: "none", fontFamily: ff, textAlign: "right",
                  }}
                />
                {!isAuto && (
                  <button onClick={() => setAmount(name, "")} style={{ background: "none", border: "none", color: L.muted, cursor: "pointer", fontSize: 16, padding: "0 2px" }} title="Reset">↺</button>
                )}
              </div>
            );
          })}

          {unlockedCount > 0 && (
            <div style={{ textAlign: "center", background: L.accentBg, border: `1px solid ${L.accentBorder}`, borderRadius: 10, padding: "8px 14px", margin: "4px 0 14px" }}>
              <span style={{ color: L.accentDark, fontSize: 13, fontWeight: 700 }}>
                {t.splitSummary(unlockedCount, fmt(remainder), fmt(splitShare))}
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button style={btnGhost()} onClick={() => setStep(2)}>{t.back}</button>
            <button
              style={{ ...btnPrimary({ flex: 1, opacity: overBudget ? .4 : 1 }), marginTop: 0 }}
              onClick={() => !overBudget && setStep(4)} disabled={overBudget}>
              {t.seeSummary}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: SUMMARY ── */}
      {step === 4 && (
        <div style={{ width: "100%", maxWidth: 460 }}>

          {/* ── CAPTURE ZONE ── */}
          <div ref={summaryRef} style={{ background: "#FFFFFF", borderRadius: 24, overflow: "hidden", border: `1px solid ${L.cardBorder}`, boxShadow: L.shadow, marginTop: 24 }}>
            {/* Capture header */}
            <div style={{ background: L.text, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "-0.3px" }}>🍽 SplitEase</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 600, letterSpacing: .5, marginTop: 1 }}>by Hang Daro</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>TOTAL</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>{fmt(totalNum)}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px" }}>
              {/* Editable description */}
              {editingDesc ? (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      ref={descInputRef}
                      value={descDraft}
                      onChange={e => setDescDraft(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") { setDesc(descDraft); setEditingDesc(false); }
                        if (e.key === "Escape") setEditingDesc(false);
                      }}
                      placeholder={t.savePlaceholder}
                      style={{
                        flex: 1, padding: "10px 13px", borderRadius: 10, fontFamily: ff,
                        border: `1.5px solid ${L.accent}`, background: L.accentBg,
                        fontSize: 13, fontWeight: 600, color: L.accentDark, outline: "none",
                      }}
                      autoFocus
                    />
                    <button onClick={() => { setDesc(descDraft); setEditingDesc(false); }} style={{
                      padding: "10px 14px", borderRadius: 10, background: L.accent, border: "none",
                      color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: ff,
                    }}>{t.save}</button>
                    <button onClick={() => setEditingDesc(false)} style={{
                      padding: "10px 12px", borderRadius: 10, background: "transparent",
                      border: `1.5px solid ${L.inputBorder}`, color: L.muted,
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: ff,
                    }}>✕</button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => { setDescDraft(desc); setEditingDesc(true); }}
                  style={{
                    background: desc ? L.accentBg : L.pill,
                    border: `1px dashed ${desc ? L.accentBorder : L.inputBorder}`,
                    borderRadius: 12, padding: "10px 14px", marginBottom: 18,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all .2s",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: desc ? L.accentDark : L.muted }}>
                    {desc ? `📝 ${desc}` : t.addReceiptNote}
                  </span>
                  <span style={{ fontSize: 11, color: L.muted, fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>{t.editLabel}</span>
                </div>
              )}

              {people.map((name, i) => {
                const isMe = name === OWNER;
                return (
                  <div key={name}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar name={name} color={COLORS[i % COLORS.length]} size={40} />
                        <div>
                          <div style={{ fontWeight: 800, color: L.text, fontSize: 15, letterSpacing: "-0.2px" }}>
                            {name} {isMe && <span style={{ fontSize: 10, color: L.accentDark, fontWeight: 700, background: L.accentBg, padding: "1px 6px", borderRadius: 99 }}>{t.you}</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontWeight: 900, fontSize: 17, color: L.text, letterSpacing: "-0.3px" }}>{fmt(getEff(name))}</span>
                        <button onClick={() => { setQrPerson(name); setQrModal(true); }} style={{
                          background: L.pill, border: `1px solid ${L.inputBorder}`, borderRadius: 10,
                          padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700,
                          color: L.sub, fontFamily: ff, transition: "all .15s",
                        }}>📷 QR</button>
                      </div>
                    </div>
                    {i < people.length - 1 && <div style={{ height: 1, background: L.cardBorder }} />}
                  </div>
                );
              })}
            </div>

            {/* QR + Bill Screenshot inside capture — side by side if both present */}
            {(qrImage || billImage) && (
              <div style={{ padding: "0 24px 20px" }}>
                <div style={{ borderTop: `1px solid ${L.cardBorder}`, paddingTop: 16, marginBottom: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: L.muted, letterSpacing: 1.5, textTransform: "uppercase" }}>
                    {qrImage && billImage ? t.scanAndBill : qrImage ? t.scanToPay : t.billReceipt}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "flex-start" }}>
                  {qrImage && (
                    <div style={{ flex: billImage ? 1 : "none", textAlign: "center" }}>
                      {billImage && <div style={{ fontSize: 10, fontWeight: 700, color: L.muted, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{t.qrCode}</div>}
                      <img src={qrImage} alt="QR" style={{ width: billImage ? "100%" : "60%", maxWidth: 200, borderRadius: 12, border: `2px solid ${L.inputBorder}` }} />
                    </div>
                  )}
                  {billImage && (
                    <div style={{ flex: qrImage ? 1 : "none", textAlign: "center" }}>
                      {qrImage && <div style={{ fontSize: 10, fontWeight: 700, color: L.muted, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{t.receipt}</div>}
                      <img src={billImage} alt="Bill" style={{ width: qrImage ? "100%" : "60%", maxWidth: 200, borderRadius: 12, border: `2px solid ${L.inputBorder}` }} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Capture footer */}
            <div style={{ background: L.pill, padding: "12px 24px", display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: L.muted, fontWeight: 600 }}>{t.madeWith}</span>
            </div>
          </div>

          {/* ── ACTIONS (outside capture) ── */}
          <div style={{ marginTop: 14 }}>
            <button onClick={handleShare} disabled={sharing} style={btnPrimary({
              background: `linear-gradient(135deg, ${L.accent}, ${L.accentDark})`,
              boxShadow: `0 4px 20px ${L.accent}44`,
              opacity: sharing ? .7 : 1,
            })}>
              {sharing ? t.capturing : <><span style={{ fontSize: 18 }}>📤</span> {t.shareBtn}</>}
            </button>

            {/* Upload Cards — side by side */}
            <div style={{ ...card, marginTop: 14, padding: "20px 22px" }}>
              <div style={sLabel}><span>🖼</span> {t.attachImages}</div>
              <div style={{ display: "flex", gap: 10 }}>

                {/* QR Upload */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: L.sub, marginBottom: 8 }}>{t.paymentQr}</div>
                  <div onClick={() => fileRef.current.click()} style={{
                    border: `2px dashed ${qrImage ? L.accent : L.inputBorder}`,
                    borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer",
                    background: qrImage ? L.accentBg : L.input, transition: "all .2s", minHeight: 110,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    {qrImage ? (
                      <img src={qrImage} alt="QR" style={{ maxWidth: "100%", maxHeight: 90, borderRadius: 8 }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 28 }}>🔳</div>
                        <p style={{ color: L.muted, margin: "6px 0 0", fontSize: 11, fontWeight: 500 }}>{t.tapToUpload}</p>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const f = e.target.files[0]; if (!f) return;
                      const r = new FileReader(); r.onload = ev => setQrImage(ev.target.result); r.readAsDataURL(f);
                    }} />
                  </div>
                  {qrImage && (
                    <button onClick={() => setQrImage(null)} style={{ ...btnGhost({ width: "100%", marginTop: 6, boxSizing: "border-box", fontSize: 12, padding: "7px 10px" }) }}>{t.remove}</button>
                  )}
                </div>

                {/* Bill Screenshot Upload */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: L.sub, marginBottom: 8 }}>{t.billScreenshot}</div>
                  <div onClick={() => billRef.current.click()} style={{
                    border: `2px dashed ${billImage ? L.accent : L.inputBorder}`,
                    borderRadius: 14, padding: "14px 10px", textAlign: "center", cursor: "pointer",
                    background: billImage ? L.accentBg : L.input, transition: "all .2s", minHeight: 110,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  }}>
                    {billImage ? (
                      <img src={billImage} alt="Bill" style={{ maxWidth: "100%", maxHeight: 90, borderRadius: 8 }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 28 }}>🧾</div>
                        <p style={{ color: L.muted, margin: "6px 0 0", fontSize: 11, fontWeight: 500 }}>{t.tapToUpload}</p>
                      </>
                    )}
                    <input ref={billRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                      const f = e.target.files[0]; if (!f) return;
                      const r = new FileReader(); r.onload = ev => setBillImage(ev.target.result); r.readAsDataURL(f);
                    }} />
                  </div>
                  {billImage && (
                    <button onClick={() => setBillImage(null)} style={{ ...btnGhost({ width: "100%", marginTop: 6, boxSizing: "border-box", fontSize: 12, padding: "7px 10px" }) }}>{t.remove}</button>
                  )}
                </div>

              </div>
              <p style={{ color: L.muted, fontSize: 11, margin: "12px 0 0", fontWeight: 500, textAlign: "center" }}>
                {t.bothImagesNote}
              </p>
            </div>

            <button style={{ ...btnGhost({ width: "100%", marginTop: 10, boxSizing: "border-box" }) }}
              onClick={() => { setStep(1); setTotal(""); setDesc(""); setPeople([]); setAmounts({}); setQrImage(null); setBillImage(null); setIncludedMe(false); }}>
              {t.startOver}
            </button>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ marginTop: 48, textAlign: "center" }}>
        <p style={{ color: L.muted, fontSize: 12, fontWeight: 500, margin: 0 }}>
          {t.builtBy} <strong style={{ color: L.sub }}>Hang Daro</strong>
        </p>
      </div>

      {/* ── QR MODAL ── */}
      {qrModal && (
        <div onClick={() => setQrModal(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
          backdropFilter: "blur(8px)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "#fff", borderRadius: 28, padding: "32px 28px",
            maxWidth: 340, width: "90%", textAlign: "center",
            boxShadow: "0 30px 80px rgba(0,0,0,.25)",
          }}>
            <div style={{ fontSize: 13, color: L.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>{t.payTo}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: L.text, letterSpacing: "-0.5px", marginBottom: 2 }}>
              {qrPerson} {qrPerson === OWNER && <span style={{ fontSize: 12, color: L.accentDark }}>({t.you})</span>}
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: L.accentDark, letterSpacing: "-1px", marginBottom: 20 }}>
              {qrPerson ? fmt(getEff(qrPerson)) : ""}
            </div>
            {qrImage ? (
              <img src={qrImage} alt="QR" style={{ width: "100%", borderRadius: 18, border: `3px solid ${L.inputBorder}` }} />
            ) : (
              <div style={{ padding: "28px", border: `2px dashed ${L.inputBorder}`, borderRadius: 18, color: L.muted, fontSize: 14 }}>
                🔳<br /><br />{t.noQr}<br />
                <span style={{ fontSize: 12 }}>{t.addQrHint}</span>
              </div>
            )}
            <button style={btnPrimary({ marginTop: 20 })} onClick={() => setQrModal(false)}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}
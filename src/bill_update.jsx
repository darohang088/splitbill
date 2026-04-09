import { useState, useRef, useEffect } from "react";

const OWNER = "Me";
const COLORS = [
  "#FF6B6B",
  "#FBBF24",
  "#34D399",
  "#60A5FA",
  "#A78BFA",
  "#FB923C",
  "#2DD4BF",
  "#F472B6",
  "#84CC16",
  "#F43F5E",
];

// ── Your friend list ──────────────────────────────────────────────────────────
const CONTACTS = [
  { name: "Bong Sak", nickname: "Fan ozawa69", emoji: "🐼" },
  { name: "bong hong", nickname: "Tongue Emperor", emoji: "👅" },
  { name: "Daro", nickname: "មហាចោរ​", emoji: "🔥" },
  { name: "Colin", nickname: "songsa yisunshin", emoji: "💋" },
  { name: "Chea Hour", nickname: "មុខក័យ សំដីឡូយ", emoji: "😰" },
  { name: "Thinh", nickname: "Kmeng kohork", emoji: "🙃" },
  { name: "Mengche", nickname: "Tongue prince", emoji: "👅👑" },
  { name: "Smey", nickname: "kmeng nhean six", emoji: "🍆🍑😩👉👌💦" },
];

const T = {
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
  customAmountsDesc:
    "Set a fixed amount for anyone who paid more — the rest is split evenly.",
  allocated: "Allocated",
  overBudget: (n) => `⚠️ Over by ${n}`,
  autoSplit: (n) => `auto · ${n}`,
  customPlaceholder: "custom",
  splitSummary: (count, rem, share) =>
    `${count} person${count > 1 ? "s" : ""} split ${rem} → ${share} each`,
  seeSummary: "See Summary →",
  addReceiptNote: "✏️ Add a note…",
  editLabel: "edit",
  savePlaceholder: "e.g. Dinner at Topaz, Birthday party…",
  save: "Save",
  scanToPay: "Scan to Pay",
  billReceipt: "Bill Receipt",
  madeWith: "Made with SplitEase · by Hang Daro",
  shareBtn: "📤 Share Summary",
  attachImages: "Attach Images",
  paymentQr: "🔳 Payment QR",
  billScreenshot: "🧾 Bill Screenshot",
  tapToUpload: "Tap to upload",
  remove: "Remove",
  bothImagesNote: "Both images appear in the shared summary 📤",
  startOver: "🔄 Start Over",
  builtBy: "Built with ❤️ by",
  payTo: "Pay to",
  noQr: "No QR uploaded yet.",
  addQrHint: "Go back and add one!",
  close: "Close",
  alertError: "Couldn't share. Try a screenshot instead.",
  atLeast2: "Add at least 2 people to split the bill",
};

const L = {
  bg: "#F7F5F2",
  card: "#FFFFFF",
  cardBorder: "rgba(0,0,0,.07)",
  shadow: "0 4px 32px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04)",
  text: "#18181B",
  sub: "#71717A",
  muted: "#A1A1AA",
  accent: "#22C55E",
  accentDark: "#16A34A",
  accentBg: "#F0FDF4",
  accentBorder: "#BBF7D0",
  danger: "#EF4444",
  input: "#FAFAF9",
  inputBorder: "#E4E4E7",
  pill: "#F4F4F5",
};

function Avatar({ name, color, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: size * 0.4,
        color: "#fff",
        flexShrink: 0,
        boxShadow: `0 3px 10px ${color}44`,
        letterSpacing: "-0.5px",
      }}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

function StepBar({ current }) {
  const labels = [T.step1Label, T.step2Label, T.step3Label, T.step4Label];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        margin: "20px 0 0",
      }}
    >
      {labels.map((label, i) => {
        const s = i + 1;
        const done = current > s;
        const active = current === s;
        return (
          <div
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              flex: s < 4 ? 1 : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done
                    ? L.accentDark
                    : active
                    ? L.accent
                    : L.inputBorder,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 900,
                  color: done || active ? "#fff" : L.muted,
                  transition: "all .3s",
                  boxShadow: active ? `0 0 0 4px ${L.accentBg}` : "none",
                }}
              >
                {done ? "✓" : s}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: active ? L.accentDark : L.muted,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {s < 4 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? L.accentDark : L.inputBorder,
                  margin: "0 4px",
                  marginBottom: 18,
                  transition: "background .3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  const canvas = await window.html2canvas(node, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  return new Promise((res) =>
    canvas.toBlob(
      (b) => res(new File([b], filename, { type: "image/png" })),
      "image/png"
    )
  );
}

// ── Contacts Bottom Sheet ─────────────────────────────────────────────────────
function ContactsBottomSheet({ open, onClose, onAdd, alreadyAdded }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const ff = "'Plus Jakarta Sans', sans-serif";

  // Reset selection when sheet opens
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected([]);
      setSearch("");
    }
  }, [open]);

  const filtered = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nickname.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleAdd = () => {
    onAdd(selected);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          backdropFilter: "blur(6px)",
          zIndex: 900,
          animation: "fadeIn .2s ease",
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#fff",
          borderRadius: "28px 28px 0 0",
          zIndex: 901,
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp .3s cubic-bezier(.32,1,.6,1)",
          boxShadow: "0 -8px 40px rgba(0,0,0,.15)",
          fontFamily: ff,
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
          @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
        `}</style>

        {/* Handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 0 0",
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 99,
              background: L.inputBorder,
            }}
          />
        </div>

        {/* Header */}
        <div style={{ padding: "14px 20px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: L.text }}>
                👥 Select Friends
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: L.muted,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {selected.length === 0
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
                background: L.pill,
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: L.sub,
              }}
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 15,
                opacity: 0.5,
              }}
            >
              🔍
            </span>
            <input
              placeholder="Search name or nickname…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 14px 11px 36px",
                borderRadius: 12,
                border: `1.5px solid ${L.inputBorder}`,
                background: L.input,
                fontSize: 14,
                fontFamily: ff,
                outline: "none",
                color: L.text,
              }}
            />
          </div>
        </div>

        {/* Contact list */}
        <div style={{ overflowY: "auto", flex: 1, padding: "0 20px" }}>
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: L.muted,
                fontSize: 14,
              }}
            >
              No results
            </div>
          )}
          {filtered.map((contact) => {
            const isSelected = selected.includes(contact.name);
            const isAlready = alreadyAdded.includes(contact.name);
            const colorIdx = CONTACTS.indexOf(contact) + 1; // offset from "You" color

            return (
              <div
                key={contact.name}
                onClick={() => !isAlready && toggle(contact.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 16,
                  marginBottom: 6,
                  background: isAlready
                    ? L.pill
                    : isSelected
                    ? L.accentBg
                    : "transparent",
                  border: `1.5px solid ${
                    isSelected && !isAlready ? L.accentBorder : "transparent"
                  }`,
                  cursor: isAlready ? "default" : "pointer",
                  opacity: isAlready ? 0.5 : 1,
                  transition: "all .15s",
                }}
              >
                {/* Avatar */}
                <Avatar
                  name={contact.name}
                  color={COLORS[colorIdx % COLORS.length]}
                  size={42}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: isSelected ? L.accentDark : L.text,
                      }}
                    >
                      {contact.name}
                    </span>
                    <span style={{ fontSize: 13 }}>{contact.emoji}</span>
                    {isAlready && (
                      <span
                        style={{
                          fontSize: 10,
                          background: L.pill,
                          borderRadius: 99,
                          padding: "2px 8px",
                          color: L.muted,
                          fontWeight: 700,
                        }}
                      >
                        Already added
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isSelected ? L.accent : L.muted,
                      fontWeight: 500,
                      marginTop: 1,
                    }}
                  >
                    {contact.nickname}
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    flexShrink: 0,
                    border: `2px solid ${
                      isSelected ? L.accent : L.inputBorder
                    }`,
                    background: isSelected ? L.accent : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .15s",
                  }}
                >
                  {isSelected && (
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

          {/* spacer for button */}
          <div style={{ height: 20 }} />
        </div>

        {/* CTA */}
        <div
          style={{
            padding: "12px 20px",
            paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            borderTop: `1px solid ${L.cardBorder}`,
          }}
        >
          {selected.length > 0 && (
            <button
              onClick={handleAdd}
              style={{
                width: "100%",
                padding: "15px 20px",
                borderRadius: 16,
                background: `linear-gradient(135deg, ${L.accent}, ${L.accentDark})`,
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                border: "none",
                cursor: "pointer",
                fontFamily: ff,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: `0 6px 20px ${L.accent}55`,
              }}
            >
              <span>👥</span>
              Add {selected.length}{" "}
              {selected.length === 1 ? "person" : "people"}
              <span
                style={{
                  background: "rgba(255,255,255,.25)",
                  borderRadius: 99,
                  padding: "2px 10px",
                  fontSize: 13,
                }}
              >
                {selected.map((s) => s.split(" ")[0]).join(", ")}
              </span>
            </button>
          )}
          {selected.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: L.muted,
                fontSize: 13,
                fontWeight: 500,
                padding: "6px 0",
              }}
            >
              Select at least one friend to add
            </div>
          )}
        </div>
      </div>
    </>
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
  const [billImage, setBillImage] = useState(null);
  const [qrModal, setQrModal] = useState(false);
  const [qrPerson, setQrPerson] = useState(null);
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
  }, []);

  const totalNum = parseFloat(total) || 0;
  const ff = "'Plus Jakarta Sans', sans-serif";

  const addPerson = (name) => {
    const n = (name || nameInput).trim();
    if (!n || people.includes(n)) return;
    setPeople((p) => [...p, n]);
    setNameInput("");
    nameRef.current?.focus();
  };

  const addFromContacts = (names) => {
    setPeople((prev) => {
      const toAdd = names.filter((n) => !prev.includes(n));
      return [...prev, ...toAdd];
    });
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
  const fmt = (n) => Number(n).toFixed(2);

  const panelCount = 1 + (qrImage ? 1 : 0) + (billImage ? 1 : 0);

  const handleShare = async () => {
    setSharing(true);
    try {
      await loadHtml2Canvas();
      const files = [];
      const f1 = await nodeToFile(summaryRef.current, "splitease-summary.png");
      files.push(f1);
      if (qrImage && qrRef.current) {
        const f2 = await nodeToFile(qrRef.current, "splitease-qr.png");
        files.push(f2);
      }
      if (billImage && billPanelRef.current) {
        const f3 = await nodeToFile(billPanelRef.current, "splitease-bill.png");
        files.push(f3);
      }
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
      if (e?.name !== "AbortError") alert(T.alertError);
    }
    setSharing(false);
  };

  const card = {
    background: L.card,
    borderRadius: 24,
    boxShadow: L.shadow,
    padding: "26px 24px",
    width: "100%",
    maxWidth: 460,
    boxSizing: "border-box",
    border: `1px solid ${L.cardBorder}`,
  };
  const sLabel = {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: L.muted,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };
  const inp = {
    width: "100%",
    boxSizing: "border-box",
    background: L.input,
    border: `1.5px solid ${L.inputBorder}`,
    borderRadius: 12,
    padding: "13px 15px",
    color: L.text,
    fontSize: 15,
    outline: "none",
    fontFamily: ff,
  };
  const btnPrimary = (extra = {}) => ({
    width: "100%",
    padding: "14px 20px",
    borderRadius: 14,
    background: L.text,
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    fontFamily: ff,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...extra,
  });
  const btnGhost = (extra = {}) => ({
    padding: "12px 18px",
    borderRadius: 12,
    background: "transparent",
    color: L.sub,
    fontWeight: 700,
    fontSize: 14,
    border: `1.5px solid ${L.inputBorder}`,
    cursor: "pointer",
    fontFamily: ff,
    ...extra,
  });

  const panelHeader = (extra = {}) => ({
    background: L.text,
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...extra,
  });
  const panelFooter = {
    background: L.pill,
    padding: "8px 16px",
    textAlign: "center",
  };
  const panelWrap = (extra = {}) => ({
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    border: `1px solid ${L.cardBorder}`,
    fontFamily: ff,
    ...extra,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: L.bg,
        fontFamily: ff,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 16px 80px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          textAlign: "center",
          padding: "40px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              borderRadius: 20,
              padding: "10px 20px",
              boxShadow: L.shadow,
              border: `1px solid ${L.cardBorder}`,
            }}
          >
            <span style={{ fontSize: 26 }}>🍽</span>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: L.text,
                  letterSpacing: "-0.5px",
                  lineHeight: 1.1,
                }}
              >
                SplitEase
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: L.muted,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                by Hang Daro
              </div>
            </div>
          </div>
        </div>
        <p style={{ color: L.sub, fontSize: 13, margin: 0, fontWeight: 500 }}>
          {T.appTagline}
        </p>
        <StepBar current={step} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}>
            <span>💰</span> {T.totalBill}
          </div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: L.sub,
              display: "block",
              marginBottom: 8,
            }}
          >
            {T.howMuch}
          </label>
          <div style={{ marginBottom: 20 }}>
            <input
              style={{
                ...inp,
                fontSize: 36,
                fontWeight: 900,
                letterSpacing: "-1px",
                textAlign: "center",
              }}
              type="number"
              min="0"
              placeholder="0.00"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && totalNum > 0 && setStep(2)}
              autoFocus
            />
          </div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: L.sub,
              display: "block",
              marginBottom: 8,
            }}
          >
            {T.description}{" "}
            <span style={{ color: L.muted, fontWeight: 500 }}>
              {T.optional}
            </span>
          </label>
          <textarea
            style={{
              ...inp,
              resize: "none",
              minHeight: 72,
              fontSize: 14,
              lineHeight: 1.5,
            }}
            placeholder={T.descPlaceholder}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={2}
          />
          <button
            style={btnPrimary({
              marginTop: 20,
              opacity: totalNum <= 0 ? 0.4 : 1,
              background: totalNum > 0 ? L.text : L.muted,
            })}
            onClick={() => totalNum > 0 && setStep(2)}
            disabled={totalNum <= 0}
          >
            {T.continue} <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}>
            <span>👥</span> {T.whoSplitting}
          </div>
          <div
            style={{
              background: L.accentBg,
              border: `1px solid ${L.accentBorder}`,
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 18,
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 600, color: L.accentDark }}
            >
              {T.total}: <strong>{fmt(totalNum)}</strong>
              {desc && (
                <em style={{ fontWeight: 400, opacity: 0.8 }}> · {desc}</em>
              )}
            </span>
          </div>

          {/* Count Me In */}
          <button
            onClick={includeMe}
            disabled={includedMe}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: 12,
              marginBottom: 14,
              background: includedMe ? L.accentBg : "#fff",
              border: `2px ${includedMe ? "solid" : "dashed"} ${
                includedMe ? L.accentBorder : L.inputBorder
              }`,
              cursor: includedMe ? "default" : "pointer",
              fontFamily: ff,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar name="Y" color={COLORS[0]} size={32} />
            <div style={{ textAlign: "left", flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: includedMe ? L.accentDark : L.text,
                }}
              >
                {includedMe ? T.youreIn : T.countMeIn}
              </div>
              <div style={{ fontSize: 11, color: L.muted, fontWeight: 500 }}>
                {T.addYourself}
              </div>
            </div>
            {!includedMe && <span style={{ fontSize: 18 }}>👋</span>}
            {includedMe && <span style={{ fontSize: 16 }}>✅</span>}
          </button>

          {/* ── SELECT FROM CONTACTS button ── */}
          <button
            onClick={() => setShowContacts(true)}
            style={{
              width: "100%",
              padding: "11px 16px",
              borderRadius: 12,
              marginBottom: 14,
              background: "#fff",
              border: `2px solid ${L.text}`,
              cursor: "pointer",
              fontFamily: ff,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxSizing: "border-box",
            }}
          >
            {/* Mini avatars preview */}
            <div style={{ display: "flex", flexShrink: 0 }}>
              {CONTACTS.slice(0, 3).map((c, i) => (
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
              <div style={{ fontSize: 14, fontWeight: 800, color: L.text }}>
                Select from contacts
              </div>
              <div style={{ fontSize: 11, color: L.muted, fontWeight: 500 }}>
                {CONTACTS.length} friends available
              </div>
            </div>
            <span style={{ fontSize: 20 }}>→</span>
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div style={{ flex: 1, height: 1, background: L.inputBorder }} />
            <span style={{ fontSize: 11, color: L.muted, fontWeight: 600 }}>
              {T.orAddSomeone}
            </span>
            <div style={{ flex: 1, height: 1, background: L.inputBorder }} />
          </div>

          {/* Manual name input */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <input
              ref={nameRef}
              style={{ ...inp, flex: 1 }}
              placeholder={T.enterName}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPerson()}
            />
            <button
              onClick={() => addPerson()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: L.text,
                border: "none",
                color: "#fff",
                fontWeight: 900,
                fontSize: 26,
                cursor: "pointer",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              +
            </button>
          </div>

          {/* People list */}
          <div style={{ marginBottom: 4 }}>
            {people.map((name, i) => (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: name === OWNER ? L.accentBg : L.pill,
                  border: `1px solid ${
                    name === OWNER ? L.accentBorder : "transparent"
                  }`,
                  borderRadius: 40,
                  padding: "8px 12px 8px 8px",
                  marginBottom: 8,
                }}
              >
                <Avatar
                  name={name === OWNER ? "Y" : name}
                  color={COLORS[i % COLORS.length]}
                  size={34}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: name === OWNER ? L.accentDark : L.text,
                      fontSize: 14,
                    }}
                  >
                    {name === OWNER ? "You" : name}
                  </span>
                  {/* Show nickname if it's a contact */}
                  {CONTACTS.find((c) => c.name === name) && (
                    <div
                      style={{ fontSize: 11, color: L.muted, fontWeight: 500 }}
                    >
                      {CONTACTS.find((c) => c.name === name).nickname}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removePerson(name)}
                  style={{
                    background: "none",
                    border: "none",
                    color: L.muted,
                    fontSize: 20,
                    cursor: "pointer",
                    padding: "0 2px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {people.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: L.muted,
                  fontSize: 13,
                  padding: "8px 0",
                }}
              >
                {T.atLeast2}
              </p>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={btnGhost()} onClick={() => setStep(1)}>
              {T.back}
            </button>
            <button
              style={{
                ...btnPrimary({
                  flex: 1,
                  opacity: people.length < 2 ? 0.4 : 1,
                }),
                marginTop: 0,
              }}
              onClick={() => people.length >= 2 && setStep(3)}
              disabled={people.length < 2}
            >
              {people.length < 2
                ? T.needMore(2 - people.length)
                : T.splitWays(people.length)}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div style={{ ...card, marginTop: 24 }}>
          <div style={sLabel}>
            <span>⚖️</span> {T.customAmounts}
          </div>
          <p
            style={{
              color: L.sub,
              fontSize: 13,
              margin: "0 0 18px",
              fontWeight: 500,
            }}
          >
            {T.customAmountsDesc}
          </p>
          <div
            style={{
              background: L.pill,
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: L.sub }}>
                {T.allocated}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: overBudget ? L.danger : L.accentDark,
                }}
              >
                {fmt(lockedTotal)} / {fmt(totalNum)}
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 99,
                background: L.inputBorder,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 99,
                  transition: "width .4s",
                  background: overBudget
                    ? L.danger
                    : `linear-gradient(90deg, ${L.accent}, ${L.accentDark})`,
                  width: `${Math.min(100, (lockedTotal / totalNum) * 100)}%`,
                }}
              />
            </div>
            {overBudget && (
              <p
                style={{
                  color: L.danger,
                  fontSize: 12,
                  margin: "8px 0 0",
                  fontWeight: 600,
                }}
              >
                {T.overBudget(fmt(lockedTotal - totalNum))}
              </p>
            )}
          </div>
          {people.map((name, i) => {
            const isAuto = amounts[name] === undefined || amounts[name] === "";
            const isMe = name === OWNER;
            const contact = CONTACTS.find((c) => c.name === name);
            return (
              <div
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                  padding: "12px 14px",
                  background: isMe ? L.accentBg : L.input,
                  borderRadius: 14,
                  border: `1.5px solid ${
                    isMe ? L.accentBorder : isAuto ? "transparent" : L.accent
                  }`,
                }}
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
                      color: isMe ? L.accentDark : L.text,
                      fontSize: 14,
                    }}
                  >
                    {isMe ? "You" : name}
                  </div>
                  {contact && (
                    <div
                      style={{ fontSize: 11, color: L.muted, fontWeight: 500 }}
                    >
                      {contact.nickname}
                    </div>
                  )}
                  {isAuto && (
                    <div
                      style={{ fontSize: 11, color: L.accent, fontWeight: 700 }}
                    >
                      {T.autoSplit(fmt(splitShare))}
                    </div>
                  )}
                </div>
                <input
                  type="number"
                  min="0"
                  placeholder={T.customPlaceholder}
                  value={amounts[name] || ""}
                  onChange={(e) => setAmount(name, e.target.value)}
                  style={{
                    width: 90,
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: `1.5px solid ${isAuto ? L.inputBorder : L.accent}`,
                    background: "#fff",
                    fontSize: 14,
                    fontWeight: 800,
                    color: L.text,
                    outline: "none",
                    fontFamily: ff,
                    textAlign: "right",
                  }}
                />
                {!isAuto && (
                  <button
                    onClick={() => setAmount(name, "")}
                    style={{
                      background: "none",
                      border: "none",
                      color: L.muted,
                      cursor: "pointer",
                      fontSize: 16,
                      padding: "0 2px",
                    }}
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
                background: L.accentBg,
                border: `1px solid ${L.accentBorder}`,
                borderRadius: 10,
                padding: "8px 14px",
                margin: "4px 0 14px",
              }}
            >
              <span
                style={{ color: L.accentDark, fontSize: 13, fontWeight: 700 }}
              >
                {T.splitSummary(unlockedCount, fmt(remainder), fmt(splitShare))}
              </span>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={btnGhost()} onClick={() => setStep(2)}>
              {T.back}
            </button>
            <button
              style={{
                ...btnPrimary({ flex: 1, opacity: overBudget ? 0.4 : 1 }),
                marginTop: 0,
              }}
              onClick={() => !overBudget && setStep(4)}
              disabled={overBudget}
            >
              {T.seeSummary}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div ref={summaryRef} style={panelWrap({ marginTop: 24 })}>
            <div style={panelHeader()}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                  🍽 SplitEase
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,.45)",
                    fontWeight: 600,
                  }}
                >
                  by Hang Daro
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,.45)",
                    fontWeight: 600,
                  }}
                >
                  TOTAL
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                  {fmt(totalNum)}
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              {desc && (
                <div
                  style={{
                    background: L.accentBg,
                    border: `1px solid ${L.accentBorder}`,
                    borderRadius: 10,
                    padding: "8px 12px",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: L.accentDark,
                    }}
                  >
                    📝 {desc}
                  </span>
                </div>
              )}
              {people.map((name, i) => {
                const isMe = name === OWNER;
                const contact = CONTACTS.find((c) => c.name === name);
                return (
                  <div key={name}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar
                          name={isMe ? "Y" : name}
                          color={COLORS[i % COLORS.length]}
                          size={34}
                        />
                        <div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: L.text,
                              fontSize: 15,
                            }}
                          >
                            {isMe ? "You" : name}
                          </div>
                          {contact && (
                            <div
                              style={{
                                fontSize: 11,
                                color: L.muted,
                                fontWeight: 500,
                              }}
                            >
                              {contact.nickname}
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        style={{ fontWeight: 900, fontSize: 16, color: L.text }}
                      >
                        {fmt(getEff(name))}
                      </span>
                    </div>
                    {i < people.length - 1 && (
                      <div style={{ height: 1, background: L.cardBorder }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div style={panelFooter}>
              <span style={{ fontSize: 10, color: L.muted, fontWeight: 600 }}>
                {T.madeWith}
              </span>
            </div>
          </div>

          {qrImage && (
            <div ref={qrRef} style={panelWrap({ marginTop: 12 })}>
              <div style={panelHeader()}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>
                  🔳 {T.scanToPay}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                  {fmt(totalNum)}
                </div>
              </div>
              <div
                style={{
                  padding: "16px 18px",
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
                      color: L.accentDark,
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
                    borderRadius: 12,
                    border: `2px solid ${L.inputBorder}`,
                  }}
                />
              </div>
              <div style={panelFooter}>
                <span style={{ fontSize: 10, color: L.muted, fontWeight: 600 }}>
                  {T.madeWith}
                </span>
              </div>
            </div>
          )}

          {billImage && (
            <div ref={billPanelRef} style={panelWrap({ marginTop: 12 })}>
              <div style={panelHeader()}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>
                  🧾 {T.billReceipt}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
                  {fmt(totalNum)}
                </div>
              </div>
              <div
                style={{
                  padding: "16px 18px",
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
                      color: L.accentDark,
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
                    borderRadius: 12,
                    border: `2px solid ${L.inputBorder}`,
                  }}
                />
              </div>
              <div style={panelFooter}>
                <span style={{ fontSize: 10, color: L.muted, fontWeight: 600 }}>
                  {T.madeWith}
                </span>
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            {editingDesc ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setDesc(descDraft);
                      setEditingDesc(false);
                    }
                    if (e.key === "Escape") setEditingDesc(false);
                  }}
                  placeholder={T.savePlaceholder}
                  style={{
                    flex: 1,
                    padding: "10px 13px",
                    borderRadius: 10,
                    fontFamily: ff,
                    border: `1.5px solid ${L.accent}`,
                    background: L.accentBg,
                    fontSize: 13,
                    fontWeight: 600,
                    color: L.accentDark,
                    outline: "none",
                  }}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setDesc(descDraft);
                    setEditingDesc(false);
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: L.accent,
                    border: "none",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: ff,
                  }}
                >
                  {T.save}
                </button>
                <button
                  onClick={() => setEditingDesc(false)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "transparent",
                    border: `1.5px solid ${L.inputBorder}`,
                    color: L.muted,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: ff,
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => {
                  setDescDraft(desc);
                  setEditingDesc(true);
                }}
                style={{
                  background: desc ? L.accentBg : L.pill,
                  border: `1px dashed ${desc ? L.accentBorder : L.inputBorder}`,
                  borderRadius: 12,
                  padding: "10px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: desc ? L.accentDark : L.muted,
                  }}
                >
                  {desc ? `📝 ${desc}` : T.addReceiptNote}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: L.muted,
                    fontWeight: 600,
                    marginLeft: 8,
                  }}
                >
                  {T.editLabel}
                </span>
              </div>
            )}
          </div>

          <div style={{ ...card, marginTop: 12, padding: "16px 20px" }}>
            <div style={sLabel}>
              <span>📷</span> Individual QR
            </div>
            {people.map((name, i) => {
              const isMe = name === OWNER;
              return (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom:
                      i < people.length - 1
                        ? `1px solid ${L.cardBorder}`
                        : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <Avatar
                      name={isMe ? "Y" : name}
                      color={COLORS[i % COLORS.length]}
                      size={34}
                    />
                    <span
                      style={{ fontWeight: 700, fontSize: 14, color: L.text }}
                    >
                      {isMe ? "You" : name}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontWeight: 900, fontSize: 15 }}>
                      {fmt(getEff(name))}
                    </span>
                    <button
                      onClick={() => {
                        setQrPerson(name);
                        setQrModal(true);
                      }}
                      style={{
                        background: L.pill,
                        border: `1px solid ${L.inputBorder}`,
                        borderRadius: 10,
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        color: L.sub,
                        fontFamily: ff,
                      }}
                    >
                      📷 QR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 14 }}>
            <button
              onClick={handleShare}
              disabled={sharing}
              style={btnPrimary({
                background: `linear-gradient(135deg, ${L.accent}, ${L.accentDark})`,
                boxShadow: `0 4px 20px ${L.accent}44`,
                opacity: sharing ? 0.7 : 1,
              })}
            >
              {sharing ? (
                <>
                  <span>⏳</span> Capturing {panelCount} images…
                </>
              ) : (
                <>
                  <span style={{ fontSize: 18 }}>📤</span> {T.shareBtn}
                  <span
                    style={{
                      background: "rgba(255,255,255,.25)",
                      borderRadius: 99,
                      padding: "2px 8px",
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {panelCount} {panelCount === 1 ? "image" : "images"}
                  </span>
                </>
              )}
            </button>

            <div style={{ ...card, marginTop: 14, padding: "20px 22px" }}>
              <div style={sLabel}>
                <span>🖼</span> {T.attachImages}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: L.sub,
                      marginBottom: 8,
                    }}
                  >
                    {T.paymentQr}
                  </div>
                  <div
                    onClick={() => fileRef.current.click()}
                    style={{
                      border: `2px dashed ${
                        qrImage ? L.accent : L.inputBorder
                      }`,
                      borderRadius: 14,
                      padding: "14px 10px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: qrImage ? L.accentBg : L.input,
                      minHeight: 110,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {qrImage ? (
                      <img
                        src={qrImage}
                        alt="QR"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 90,
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <>
                        <div style={{ fontSize: 28 }}>🔳</div>
                        <p
                          style={{
                            color: L.muted,
                            margin: "6px 0 0",
                            fontSize: 11,
                          }}
                        >
                          {T.tapToUpload}
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
                      onClick={() => setQrImage(null)}
                      style={{
                        ...btnGhost({
                          width: "100%",
                          marginTop: 6,
                          boxSizing: "border-box",
                          fontSize: 12,
                          padding: "7px 10px",
                        }),
                      }}
                    >
                      {T.remove}
                    </button>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: L.sub,
                      marginBottom: 8,
                    }}
                  >
                    {T.billScreenshot}
                  </div>
                  <div
                    onClick={() => billRef.current.click()}
                    style={{
                      border: `2px dashed ${
                        billImage ? L.accent : L.inputBorder
                      }`,
                      borderRadius: 14,
                      padding: "14px 10px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: billImage ? L.accentBg : L.input,
                      minHeight: 110,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {billImage ? (
                      <img
                        src={billImage}
                        alt="Bill"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 90,
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <>
                        <div style={{ fontSize: 28 }}>🧾</div>
                        <p
                          style={{
                            color: L.muted,
                            margin: "6px 0 0",
                            fontSize: 11,
                          }}
                        >
                          {T.tapToUpload}
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
                      onClick={() => setBillImage(null)}
                      style={{
                        ...btnGhost({
                          width: "100%",
                          marginTop: 6,
                          boxSizing: "border-box",
                          fontSize: 12,
                          padding: "7px 10px",
                        }),
                      }}
                    >
                      {T.remove}
                    </button>
                  )}
                </div>
              </div>
              <p
                style={{
                  color: L.muted,
                  fontSize: 11,
                  margin: "12px 0 0",
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {T.bothImagesNote}
              </p>
            </div>

            <button
              style={{
                ...btnGhost({
                  width: "100%",
                  marginTop: 10,
                  boxSizing: "border-box",
                }),
              }}
              onClick={() => {
                setStep(1);
                setTotal("");
                setDesc("");
                setPeople([]);
                setAmounts({});
                setQrImage(null);
                setBillImage(null);
                setIncludedMe(false);
              }}
            >
              {T.startOver}
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ marginTop: 48, textAlign: "center" }}>
        <p style={{ color: L.muted, fontSize: 12, fontWeight: 500, margin: 0 }}>
          {T.builtBy} <strong style={{ color: L.sub }}>Hang Daro</strong>
        </p>
      </div>

      {/* QR MODAL */}
      {qrModal && (
        <div
          onClick={() => setQrModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 28,
              padding: "32px 28px",
              maxWidth: 340,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 30px 80px rgba(0,0,0,.25)",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: L.muted,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {T.payTo}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: L.text,
                marginBottom: 2,
              }}
            >
              {qrPerson === OWNER ? "You" : qrPerson}
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: L.accentDark,
                letterSpacing: "-1px",
                marginBottom: 20,
              }}
            >
              {qrPerson ? fmt(getEff(qrPerson)) : ""}
            </div>
            {qrImage ? (
              <img
                src={qrImage}
                alt="QR"
                style={{
                  width: "100%",
                  borderRadius: 18,
                  border: `3px solid ${L.inputBorder}`,
                }}
              />
            ) : (
              <div
                style={{
                  padding: "28px",
                  border: `2px dashed ${L.inputBorder}`,
                  borderRadius: 18,
                  color: L.muted,
                  fontSize: 14,
                }}
              >
                🔳
                <br />
                <br />
                {T.noQr}
                <br />
                <span style={{ fontSize: 12 }}>{T.addQrHint}</span>
              </div>
            )}
            <button
              style={btnPrimary({ marginTop: 20 })}
              onClick={() => setQrModal(false)}
            >
              {T.close}
            </button>
          </div>
        </div>
      )}

      {/* CONTACTS BOTTOM SHEET */}
      <ContactsBottomSheet
        open={showContacts}
        onClose={() => setShowContacts(false)}
        onAdd={addFromContacts}
        alreadyAdded={people}
      />
    </div>
  );
}

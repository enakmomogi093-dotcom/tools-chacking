import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Check, Clock3, Copy, MessageCircle, Search, ShieldCheck, Trash2, Wifi, XCircle } from "lucide-react";

const HISTORY_KEY = "wa-kenz-history-v1";

function normalizeNumber(raw, countryCode) {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && countryCode === "62") digits = "62" + digits.slice(1);
  else if (!digits.startsWith(countryCode) && raw.trim().startsWith("0")) digits = countryCode + digits.slice(1);
  else if (!raw.trim().startsWith("+") && !digits.startsWith(countryCode) && countryCode) digits = countryCode + digits;
  return digits;
}

function validateNumber(number) {
  // General international E.164 length check; this does not verify WhatsApp registration.
  return /^\d{8,15}$/.test(number) && !number.startsWith("0");
}

function prettyNumber(number) {
  return number ? `+${number}` : "";
}

export default function App() {
  const [countryCode, setCountryCode] = useState("62");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
    catch { return []; }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
  }, [history]);

  const normalized = useMemo(() => normalizeNumber(phone, countryCode), [phone, countryCode]);

  function checkNumber(event) {
    event.preventDefault();
    if (!phone.trim()) {
      setResult({ type: "empty", message: "Masukkan nomor terlebih dahulu." });
      return;
    }
    if (!validateNumber(normalized)) {
      setResult({ type: "invalid", message: "Format nomor tidak valid. Gunakan 8–15 digit termasuk kode negara." });
      return;
    }
    const item = {
      number: normalized,
      status: "Format valid",
      checkedAt: new Date().toISOString(),
      id: `${Date.now()}-${normalized}`
    };
    setResult({
      type: "valid",
      number: normalized,
      message: "Format nomor valid. Status akun WhatsApp belum dapat diverifikasi."
    });
    setHistory(current => [item, ...current.filter(entry => entry.number !== normalized)].slice(0, 8));
  }

  function openWhatsApp(number = normalized) {
    if (!validateNumber(number)) return;
    window.open(`https://wa.me/${number}`, "_blank", "noopener,noreferrer");
  }

  async function copyNumber() {
    if (!normalized) return;
    try {
      await navigator.clipboard.writeText(prettyNumber(normalized));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="WA Checker Kenz home">
          <span className="brand-mark"><MessageCircle size={21} /></span>
          <span>KENZ<span className="brand-accent">TOOLS</span></span>
        </a>
        <span className="top-status"><span className="live-dot" /> SYSTEM ONLINE</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><ShieldCheck size={14} /> WHATSAPP NUMBER UTILITY</div>
        <h1>WA CHECKER <span>KENZ</span></h1>
        <p className="subtitle">Periksa format nomor dengan cepat. Sederhana, aman, dan transparan.</p>
      </section>

      <section className="main-grid">
        <div className="panel checker-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-kicker">NUMBER VALIDATOR</div>
              <h2>Check nomor WhatsApp</h2>
            </div>
            <div className="heading-icon"><Activity size={20} /></div>
          </div>

          <form onSubmit={checkNumber}>
            <label htmlFor="phone">NOMOR TELEPON</label>
            <div className="phone-control">
              <div className="country-select">
                <span>+</span>
                <select value={countryCode} onChange={e => setCountryCode(e.target.value)} aria-label="Kode negara">
                  <option value="62">62 ID</option>
                  <option value="60">60 MY</option>
                  <option value="65">65 SG</option>
                  <option value="1">1 US</option>
                  <option value="44">44 UK</option>
                  <option value="91">91 IN</option>
                  <option value="61">61 AU</option>
                </select>
              </div>
              <input
                id="phone"
                value={phone}
                onChange={e => { setPhone(e.target.value); setResult(null); }}
                placeholder="81234567890"
                inputMode="tel"
                autoComplete="tel"
              />
              {phone && <button type="button" className="clear-input" onClick={() => { setPhone(""); setResult(null); }} aria-label="Hapus nomor"><XCircle size={17} /></button>}
            </div>
            <div className="number-hint">Contoh Indonesia: 81234567890 atau 081234567890</div>
            <button className="primary-btn" type="submit"><Search size={18} /> CHECK NUMBER <ArrowUpRight size={17} /></button>
          </form>

          {result && (
            <div className={`result-card ${result.type}`}>
              {result.type === "valid" ? <Check size={20} /> : <XCircle size={20} />}
              <div className="result-copy">
                <strong>{result.type === "valid" ? "FORMAT NOMOR VALID" : result.type === "invalid" ? "FORMAT TIDAK VALID" : "NOMOR KOSONG"}</strong>
                <span>{result.message}</span>
                {result.type === "valid" && <div className="result-actions">
                  <button type="button" className="small-btn" onClick={() => openWhatsApp(result.number)}><MessageCircle size={15} /> OPEN WHATSAPP</button>
                  <button type="button" className="small-btn secondary" onClick={copyNumber}><Copy size={15} /> {copied ? "COPIED" : "COPY"}</button>
                </div>}
              </div>
            </div>
          )}

          <div className="notice">
            <ShieldCheck size={17} />
            <p><b>Info penting:</b> Status aktif, banned, atau dinonaktifkan tidak bisa dipastikan melalui API publik WhatsApp. Hasil di atas hanya memeriksa format nomor, bukan status akun.</p>
          </div>
        </div>

        <aside className="side-column">
          <div className="mini-panel status-panel">
            <div className="mini-title"><Wifi size={16} /> STATUS PEMERIKSAAN</div>
            <div className="status-illustration"><div className="pulse-ring"><ShieldCheck size={31} /></div></div>
            <h3>Privacy first</h3>
            <p>Nomor diperiksa langsung di browser. Tidak dikirim ke server aplikasi.</p>
            <div className="status-line"><span className="live-dot" /> LOCAL VALIDATION READY</div>
          </div>
          <div className="mini-panel guide-panel">
            <div className="mini-title"><Activity size={16} /> CARA KERJA</div>
            <div className="guide-step"><span>01</span><p>Masukkan nomor beserta kode negara.</p></div>
            <div className="guide-step"><span>02</span><p>Tekan tombol Check Number.</p></div>
            <div className="guide-step"><span>03</span><p>Lihat validitas format atau buka chat WhatsApp.</p></div>
          </div>
        </aside>
      </section>

      <section className="history-panel">
        <div className="history-heading">
          <div><div className="panel-kicker">RECENT ACTIVITY</div><h2>Riwayat pengecekan</h2></div>
          <button className="clear-history" onClick={clearHistory} disabled={!history.length}><Trash2 size={15} /> Hapus</button>
        </div>
        {history.length ? <div className="history-list">
          {history.map(item => <div className="history-row" key={item.id}>
            <div className="history-icon"><MessageCircle size={17} /></div>
            <div className="history-number"><strong>{prettyNumber(item.number)}</strong><span><Clock3 size={12} /> {new Date(item.checkedAt).toLocaleString("id-ID")}</span></div>
            <span className="valid-pill"><Check size={12} /> FORMAT VALID</span>
            <button className="open-icon" onClick={() => openWhatsApp(item.number)} aria-label={`Buka chat ${item.number}`}><ArrowUpRight size={17} /></button>
          </div>)}
        </div> : <div className="empty-history"><Clock3 size={20} /><span>Belum ada riwayat pengecekan.</span></div>}
      </section>

      <footer><span>© {new Date().getFullYear()} WA CHECKER KENZ</span><span>MADE FOR SIMPLE NUMBER VALIDATION</span></footer>
    </main>
  );
}

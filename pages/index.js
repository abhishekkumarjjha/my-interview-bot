import { useState, useRef, useEffect } from 'react';

// ============================================================
// DESIGN TOKENS
// ============================================================
const C = {
  bg:        '#080c14',
  surface:   '#0d1220',
  surface2:  '#111827',
  border:    '#1e2d45',
  accent:    '#3b82f6',
  accentDim: '#1d4ed8',
  text:      '#e2e8f0',
  muted:     '#64748b',
  muted2:    '#334155',
};

// ============================================================
// QUICK CHIPS — general portfolio questions
// ============================================================
const CHIPS = [
  "What's your background?",
  "What makes you different from other AI candidates?",
  "What projects have you built?",
  "How do you approach AI safety in production?",
  "Salary expectations and availability?",
  "How was this bot built?",
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi — I'm Avi's interview agent. Ask me about his background, what he'd build for your company, how he thinks about AI safety in production, his projects, or how this bot was built."
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef(null);

  // ── on mount: scroll to top + fade in ───────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setVisible(true), 80);
  }, []);

  // ── auto-scroll on new messages only ────────────────────
  useEffect(() => {
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // ── fade-in helper ──────────────────────────────────────
  const fi = (delay) => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  });

  // ── send message ────────────────────────────────────────
  async function send() {
    if (!input.trim() || loading) return;
    const userMsg  = { role: 'user', content: input.trim() };
    const next     = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages(p => [...p, {
        role:    'assistant',
        content: data.reply || 'Something went wrong. Try again.',
      }]);
    } catch {
      setMessages(p => [...p, {
        role:    'assistant',
        content: 'Connection error. Try again.',
      }]);
    }
    setLoading(false);
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bg}; color: ${C.text}; font-family: 'IBM Plex Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
        ::selection { background: ${C.accent}33; }

        /* ── nav links ── */
        .nav-link {
          font-size: .75rem; color: ${C.muted};
          text-decoration: none; letter-spacing: .06em; transition: color .2s;
        }
        .nav-link:hover { color: ${C.text}; }

        /* ── tags ── */
        .tag {
          display: inline-block; font-size: .68rem; padding: 3px 10px;
          border-radius: 99px; border: 1px solid ${C.border};
          color: ${C.muted}; background: ${C.surface}; letter-spacing: .04em;
        }

        /* ── chips ── */
        .chip {
          font-family: 'IBM Plex Mono', monospace; font-size: .72rem;
          padding: 5px 12px; border: 1px solid ${C.border}; border-radius: 99px;
          background: transparent; color: ${C.muted}; cursor: pointer;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .chip:hover { border-color: ${C.accent}88; color: ${C.accent}; background: ${C.accent}11; }

        /* ── chat input ── */
        .chat-input {
          flex: 1; background: ${C.surface}; border: 1px solid ${C.border};
          border-radius: 6px; padding: 10px 14px; color: ${C.text};
          font-size: .875rem; font-family: 'IBM Plex Mono', monospace;
          outline: none; transition: border-color .2s;
        }
        .chat-input:focus { border-color: ${C.accent}88; }
        .chat-input::placeholder { color: ${C.muted2}; }

        /* ── send button ── */
        .send-btn {
          background: ${C.accent}; border: none; border-radius: 6px;
          padding: 10px 18px; color: #fff; font-size: .8rem;
          font-family: 'IBM Plex Mono', monospace; cursor: pointer;
          transition: background .2s, transform .1s; letter-spacing: .04em;
        }
        .send-btn:hover  { background: ${C.accentDim}; }
        .send-btn:active { transform: scale(.97); }
        .send-btn:disabled { opacity: .4; cursor: not-allowed; }

        /* ── typing dots ── */
        @keyframes pulse {
          0%,100% { opacity:.3; transform:scale(.8); }
          50%      { opacity:1;  transform:scale(1);  }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg }}>

        {/* ============================================================
            NAV
        ============================================================ */}
        <nav style={{
          ...fi(0),
          padding: '1.25rem 2rem',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0,
          background: `${C.bg}ee`, backdropFilter: 'blur(12px)', zIndex: 10,
        }}>
          <span style={{ fontSize: '.85rem', color: C.accent, fontWeight: 500, letterSpacing: '.06em' }}>
            AVI.JHA
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#about" className="nav-link">about</a>
            <a href="#chat"  className="nav-link">chat</a>
          </div>
        </nav>

        {/* ============================================================
            MAIN
        ============================================================ */}
        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '0 2rem 6rem' }}>

          {/* ── HERO ── */}
          <section id="about" style={{ paddingTop: '5rem', paddingBottom: '4rem' }}>

            {/* available badge */}
            <div style={{ ...fi(.1), marginBottom: '1rem' }}>
              <span style={{ fontSize: '.72rem', color: C.accent, letterSpacing: '.1em' }}>
                AVAILABLE FOR HIRE
              </span>
            </div>

            {/* name */}
            <h1 style={{
              ...fi(.2),
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem,5vw,3rem)',
              fontWeight: 800, lineHeight: 1.1,
              letterSpacing: '-.02em', color: C.text,
              marginBottom: '1.25rem',
            }}>
              Abhishek<br />
              <span style={{ color: C.accent }}>Kumar Jha</span>
            </h1>

            {/* one-liner */}
            <p style={{
              ...fi(.3),
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(1rem,2.5vw,1.15rem)',
              lineHeight: 1.55, marginBottom: '.75rem',
              color: C.muted, fontWeight: 400,
            }}>
              I broke Grok at xAI.<br />
              <span style={{ color: C.text }}>Now I build things that don't break.</span>
            </p>

            {/* safety line */}
            <p style={{
              ...fi(.35),
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(.85rem,2vw,.95rem)',
              color: C.muted, marginBottom: '1.5rem', lineHeight: 1.5,
            }}>
              Built with safety evaluation baked in —{' '}
              <span style={{ color: C.accent }}>not bolted on after.</span>
            </p>

            {/* tags */}
            <div style={{ ...fi(.4), display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '2.5rem' }}>
              {['AI Safety', 'Operations', 'Finance', 'Workflow Automation'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>

            {/* divider */}
            <div style={{
              ...fi(.42),
              width: '40px', height: '1px',
              background: C.accent, opacity: .6, marginBottom: '2rem',
            }} />

            {/* ── ABOUT PARAGRAPH ── */}
            <div style={{ ...fi(.45) }}>
              <p style={{ fontSize: '.875rem', color: C.muted, lineHeight: 1.95 }}>
                I spent six months at xAI mapping exactly how LLMs fail in production —
                40–50 high-severity jailbreak reports on a live system with 64M+ users.
                Before that, years running operational workflows for 10,000+ customers at Suzuki,
                building financial models in clinical research, and teaching data analytics to
                350,000+ learners across 100+ countries.
              </p>
              <br />
              <p style={{ fontSize: '.875rem', color: C.muted, lineHeight: 1.95 }}>
                MS in Business Analytics from UT Arlington, GPA 3.82. Currently completing
                BlueDot AI Safety certification.
              </p>
              <br />
              <p style={{ fontSize: '.875rem', color: C.muted, lineHeight: 1.95 }}>
                {/* highlighted closing line */}
                <span style={{ color: C.text, fontWeight: 600 }}>
                  Most builders ship the workflow. I ship the workflow plus the safety
                  and evaluation layer that keeps it from breaking when real users hit it.
                </span>
              </p>
            </div>

          </section>

          {/* ============================================================
              CHAT SECTION
          ============================================================ */}
          <section id="chat" style={{ ...fi(.55) }}>

            {/* section label */}
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: '.7rem',
              letterSpacing: '.12em', color: C.accent,
              marginBottom: '.5rem', fontWeight: 600,
            }}>
              INTERVIEW AGENT
            </h2>
            <p style={{ fontSize: '.775rem', color: C.muted, marginBottom: '1.5rem' }}>
              Powered by Claude. Ask anything — or use the prompts below.
            </p>

            <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>

              {/* ── chat header ── */}
              <div style={{
                padding: '.875rem 1.25rem',
                borderBottom: `1px solid ${C.border}`,
                background: C.surface2,
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#22c55e', boxShadow: '0 0 6px #22c55e88',
                }} />
                <span style={{ fontSize: '.75rem', color: C.muted, letterSpacing: '.04em' }}>
                  avi-agent · online
                </span>
              </div>

              {/* ── messages ── */}
              <div style={{
                height: '380px', overflowY: 'auto',
                padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: '12px',
                background: C.surface,
              }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '84%',
                      padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      fontSize: '.825rem', lineHeight: 1.75,
                      fontFamily: "'IBM Plex Mono', monospace",
                      background: m.role === 'user' ? `${C.accent}22` : C.surface2,
                      color:      m.role === 'user' ? '#93c5fd'       : C.text,
                      border:     `1px solid ${m.role === 'user' ? C.accent + '44' : C.border}`,
                    }}>
                      {/* ── render line breaks ── */}
                      {m.content.split('\n').map((line, j) => (
                        <span key={j}>
                          {line}
                          {j < m.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                {/* ── typing indicator ── */}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '10px 16px', borderRadius: '10px 10px 10px 2px',
                      background: C.surface2, border: `1px solid ${C.border}`,
                      display: 'flex', gap: '4px', alignItems: 'center',
                    }}>
                      {[0, .2, .4].map((d, i) => (
                        <div key={i} style={{
                          width: '5px', height: '5px', borderRadius: '50%',
                          background: C.accent, opacity: .6,
                          animation: `pulse 1.2s ease-in-out ${d}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ── quick chips ── */}
              <div style={{
                padding: '.875rem 1.25rem',
                borderTop: `1px solid ${C.border}`,
                borderBottom: `1px solid ${C.border}`,
                display: 'flex', flexWrap: 'wrap', gap: '8px',
                background: C.surface,
              }}>
                {CHIPS.map(q => (
                  <button key={q} className="chip" onClick={() => setInput(q)}>{q}</button>
                ))}
              </div>

              {/* ── input row ── */}
              <div style={{
                padding: '.875rem 1.25rem',
                display: 'flex', gap: '8px',
                background: C.surface2,
              }}>
                <input
                  className="chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder="Ask anything..."
                />
                <button className="send-btn" onClick={send} disabled={loading}>
                  {loading ? '...' : 'send →'}
                </button>
              </div>

            </div>
          </section>

        </main>

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer style={{
          borderTop: `1px solid ${C.border}`,
          padding: '1.5rem 2rem',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <span style={{ fontSize: '.7rem', color: C.muted2 }}>avi-jha.vercel.app</span>
          <span style={{ fontSize: '.7rem', color: C.muted2 }}>built with Next.js + Anthropic API</span>
        </footer>

      </div>
    </>
  );
}

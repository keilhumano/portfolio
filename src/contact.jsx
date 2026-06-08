/* eslint-disable */
// Contact page, typographic, minimal, no form

const GREETINGS = ["hello", "hola", "bonjour", "hallo", "こんにちは"];

function RotatingWord() {
  const [i, setI] = React.useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % GREETINGS.length);
    }, 2000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="rotating-word" aria-live="polite">
      <span key={i} className="rotating-word-inner">{GREETINGS[i]}</span>
    </span>
  );
}

function Contact({ go }) {
  useReveal();
  return (
    <div className="contact shell-inner page-enter" data-screen-label="03 Contact">
      <SectionLabel num="// 03" label="Direct · contact" right="no form · just write" />

      <div className="row1 fade-in">
        <h1>
          <span className="italic">say</span> <RotatingWord /><span className="em">,</span><br />
          or come <span className="italic">find</span> me.
        </h1>
        <div className="status">
          <span><Brk breath>[ status ]</Brk></span>
          <b>Open to relocate, 2026 / Q3</b>
          <span style={{ marginTop: 8, display: "block" }}><span className="live"><span className="dot"></span> live in Tegucigalpa</span></span>
        </div>
      </div>

      <div className="contact-grid">
        <div className="item">
          <h6>// email</h6>
          <a href="mailto:keilhumano@gmail.com" className="hoverable" data-snd-hover="1">
            keilhumano@gmail.com
          </a>
          <span className="v" style={{ color: "var(--muted)", fontSize: 14 }}>preferred · 24h reply</span>
        </div>
        <div className="item">
          <h6>// based</h6>
          <span className="v">
            Tegucigalpa, Honduras
            <small>UTC−6 · open to relocate</small>
          </span>
        </div>
        <div className="item">
          <h6>// elsewhere</h6>
          <a href="https://www.linkedin.com/in/keilhumano/" target="_blank" rel="noopener" className="hoverable" data-snd-hover="1">LinkedIn</a>

        </div>
        <div className="item">
          <h6>// looking for</h6>
          <span className="v" style={{ fontSize: 17, lineHeight: 1.4 }}>
            Senior product roles in EN / ES. Remote considered for the right team. Preference for LATAM or EU.
          </span>
        </div>
      </div>

      <p className="signoff fade-in">I read everything. I reply to most of it. Cold notes welcome, especially from people doing work in language preservation, sound design, or anything that sits at the seam between cultural craft and software, wrecking the norms of design but keeping it cute.


      </p>

      <div style={{ marginTop: 60, paddingTop: 30, borderTop: "1px dotted var(--rule)", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
        <span>// keilchinchilla.com / contact</span>
        <span>~~ no form, on purpose</span>
        <span>v1.0 · 2026</span>
      </div>

      <Footer go={go} />
    </div>);

}

window.Contact = Contact;
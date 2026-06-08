/* eslint-disable */
// About page, magazine-feature pacing.
// Five sections: Background · Chase/Won't · Influences · Looking for · Colophon.
// Prose is placeholder at intended length; visual rhythm and pacing are final.

// ── Hover-to-reveal images ───────────────────────────────────
// Specific words in the Background prose, and every item in Influences,
// reveal a small image on hover (image-only echo of the home PreviewDeck).
const AB = "assets/aboutmestuff/";
const IMG = {
  lago:          AB + "nearellagodeyojoa.png",
  ds:            AB + "DSi.png",
  kindle:        AB + "KindleFire.png",
  city:          AB + "movedtothecity.png",
  endlessness:   AB + "endlessness%20nala.png",
  immunity:      AB + "immunity.png",
  choke:         AB + "choke%20enough.png",
  aphex:         AB + "aphex.png",
  fouragreements:AB + "thefouragreements.png",
  quieroque:     AB + "quieroque.png",
  amarodepender: AB + "amarodepender.png",
  hxh:           AB + "hxh.png",
  loslobos:      AB + "los%20lobos.png",
  evangelion:    AB + "the%20end%20of%20eva.png",
  catchingfire:  AB + "catching%20fire.png",
  ytumama:       AB + "ytumamatambien.png",
};

const RevealCtx = React.createContext(null);

// Provider: tracks the cursor, holds the active image src, renders the
// floating card once via portal, and (on touch) handles tap-to-dismiss.
function AboutReveal({ children }) {
  const [active, setActive] = React.useState(null);
  const cursorRef = React.useRef({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: none)").matches;
  });

  React.useEffect(() => {
    const m = (e) => { cursorRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", m, { passive: true });
    return () => window.removeEventListener("mousemove", m);
  }, []);

  React.useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(hover: none)");
    const cb = (e) => setIsTouch(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", cb);
    else if (mq.addListener) mq.addListener(cb);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", cb);
      else if (mq.removeListener) mq.removeListener(cb);
    };
  }, []);

  // Preload so the first hover doesn't pop in.
  React.useEffect(() => {
    Object.values(IMG).forEach((src) => { const i = new Image(); i.src = src; });
  }, []);

  return (
    <RevealCtx.Provider value={{ active, setActive, isTouch }}>
      {children}
      <AboutRevealLayer active={active} cursorRef={cursorRef} isTouch={isTouch}
        onDismiss={() => setActive(null)} />
    </RevealCtx.Provider>
  );
}

function AboutRevealLayer({ active, cursorRef, isTouch, onDismiss }) {
  const anchorRef = React.useRef(null);
  // Keep the last src mounted so the card can fade OUT instead of vanishing.
  const [displaySrc, setDisplaySrc] = React.useState(null);
  React.useEffect(() => { if (active) setDisplaySrc(active); }, [active]);

  React.useEffect(() => {
    if (isTouch) {
      const el = anchorRef.current;
      if (el) el.style.transform = "";
      return;
    }
    let raf, stop = false;
    const tick = () => {
      const el = anchorRef.current;
      if (el) {
        const { x, y } = cursorRef.current || { x: 0, y: 0 };
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (!stop) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { stop = true; cancelAnimationFrame(raf); };
  }, [isTouch]);

  const node = (
    <div className={"about-reveal" + (isTouch ? " mobile" : "")} aria-hidden="true">
      {isTouch && active ? (
        <div className="about-reveal-scrim"
          onClick={(e) => { e.stopPropagation(); onDismiss && onDismiss(); }}></div>
      ) : null}
      <div ref={anchorRef} className="about-reveal-anchor">
        <div className={"about-reveal-card" + (active ? " in" : "")}>
          {displaySrc ? (
            <img className="about-reveal-img" src={displaySrc} alt="" draggable="false" />
          ) : null}
        </div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(node, document.body);
}

// Inline highlighted word (Background section): accent + semibold + reveal.
function RevealWord({ src, children }) {
  return <Revealable src={src} className="reveal-word">{children}</Revealable>;
}

// Influences row: an <li> that reveals its image (no text highlight).
function RevealLi({ src, title, meta }) {
  return (
    <Revealable src={src} as="li" className="reveal-inf">
      <em>{title}</em><span className="meta">{meta}</span>
    </Revealable>
  );
}

function Revealable({ src, children, className, as }) {
  const ctx = React.useContext(RevealCtx);
  const setActive = ctx ? ctx.setActive : () => {};
  const isTouch = ctx ? ctx.isTouch : false;
  const isActive = ctx ? ctx.active === src : false;
  const Tag = as || "span";

  const handlers = isTouch
    ? { onClick: (e) => {
        e.stopPropagation();
        if (typeof Sound !== "undefined") Sound.click();
        setActive(isActive ? null : src);
      } }
    : { onMouseEnter: () => setActive(src), onMouseLeave: () => setActive(null) };

  return (
    <Tag className={className + " hoverable" + (isActive ? " is-active" : "")}
      data-snd-hover="1" {...handlers}>
      {children}
    </Tag>
  );
}

function About({ go }) {
  useReveal();
  return (
    <AboutReveal>
    <div className="about shell-inner page-enter" data-screen-label="02 About">
      <SectionLabel num="// 02" label="About · personal index" right="five sections · a slower read" />

      <section className="about-hero">
        <div className="about-hero-text">
          <h1 className="fade-in">
            So, who's behind this whole thing?
          </h1>
          <p className="lede fade-in">
            My name is Keil. Yes, strange name, it's pronounced like "kale". <br />
            I am a user, as well as a designer for fellow users.
          </p>
        </div>
        <figure className="about-portrait fade-in">
          <span className="tag">[ the designer · Tegucigalpa ]</span>
          <img src="assets/keil-photo.png" alt="Keil Chinchilla, seated, working on a laptop" decoding="async" />
        </figure>
      </section>

      {/* ── 01, Background ───────────────────────────────────── */}
      <section className="about-section">
        <aside className="side fade-in">
          <span>// 01</span><br/>
          <b>Background</b><br/>
          how I got here
        </aside>
        <div className="fade-in">
          <h3>The screen was where the interesting thing happened.</h3>
          <div className="body">
            <p>I grew up near <RevealWord src={IMG.lago}>Lago de Yojoa</RevealWord>, in a quiet part of Honduras where the internet was thin and the gadgets I owned were the only screens around. I dissected every one of them. I would spend hours inside the menus of my <RevealWord src={IMG.ds}>Nintendo DS</RevealWord>, my <RevealWord src={IMG.kindle}>Kindle</RevealWord>, anything with an interface, pushing the device to see what it could do, mapping out where each setting lived, figuring out why some screens felt good to use and others didn't. I didn't know the word <em>interface</em> yet. I just knew the screen was where the interesting thing happened.</p>

            <p>I <RevealWord src={IMG.city}>moved to the city</RevealWord> at fifteen and started university young. I dropped out for a year or two, started freelancing, started posting work on Behance, and that's how I got pulled into the industry. A few clients found me there, the freelance work turned into a full-time role, and I've been designing for paying clients ever since.</p>

            <p>Years later, I went back and finished my degree. My thesis was a prototype for an app to teach <strong>Miskitu</strong>, an endangered indigenous language of Honduras, built in collaboration with two Miskito linguists. It's the project I'm most proud of, and the one that clarified what I actually care about as a designer: the screen is still the interesting thing, but the reason it matters is that there's a person on the other side of it.</p>

            <p>I'm a web designer, a UX/UI designer, a product designer. Part of me wants to be an artist, but the same brain that loves a beautiful image also wants to know why it works. <em>Design is where both of those things get to be true.</em></p>
          </div>
        </div>
      </section>

      {/* ── 02, What I chase, what I won't ───────────────────── */}
      <section className="about-section">
        <aside className="side fade-in">
          <span>// 02</span><br/>
          <b>What I chase</b><br/>
          working principles
        </aside>
        <div className="fade-in">
          <h3>What I chase, what I won't.</h3>

          <div className="about-twin">
            <div className="twin-col">
              <h6><span className="orn brace">{`{`}</span> what I chase</h6>
              <p>I asked two friends what my values are. They didn't fully agree. One said <em>compassion, determination, friendship.</em> The other said <em>growth, friendship, determination.</em> Both said friendship and determination, which I'll take as a strong signal.</p>

              <p>I'd add one more, which is harder to put on a list: I care a lot about being a person. I consider myself a <strong>full-time human</strong>. The people on the other side of the screens I design are also full-time humans, and the work is more interesting and more honest when I remember that.</p>

              <p>Most of what I value (the human connection, the growth, the friendships I keep close) comes from the same place: a belief that being a thoughtful person is the prerequisite for being a useful designer.</p>

              <div className="friend">
                <span>// the two friends, agreed on</span>
                <em>"friendship and determination."</em>
              </div>
            </div>

            <div className="twin-col">
              <h6><span className="orn wave">~~</span> what I won't</h6>
              <p><strong>Dark patterns.</strong> Dishonest interfaces that trick people into things they didn't ask for. Teams that are opaque or unkind. Work that makes me feel stuck.</p>

              <p>I've been at my best when I'm growing, when I'm around people I trust, and when the work is built on something true. <em>That's the bar.</em></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03, Influences ───────────────────────────────────── */}
      <section className="about-section">
        <aside className="side fade-in">
          <span>// 03</span><br/>
          <b>Influences</b><br/>
          ongoing list
        </aside>
        <div className="fade-in" style={{width: "100%"}}>
          <h3>Influences, on rotation.</h3>
          <div className="body" style={{marginBottom: 18}}>
            <p>A few of the things that shape my work, in the order I keep coming back to them.</p>
          </div>

          <div className="influences-grid three">
            <div className="inf-card">
              <h6>// vinyl on the table</h6>
              <ul>
                <RevealLi src={IMG.endlessness} title="Endlessness" meta="Nala Sinephro · 2024" />
                <RevealLi src={IMG.immunity} title="Immunity" meta="Clairo · 2019" />
                <RevealLi src={IMG.choke} title="Choke Enough" meta="Oklou · 2024" />
                <RevealLi src={IMG.aphex} title="Selected Ambient Works 85–92" meta="Aphex Twin · 1992" />
              </ul>

              {/* v2, live last.fm slot. Hidden for now until last.fm wiring lands. */}
              {false ? (
              <div className="lastfm-slot" aria-hidden="true">
                <span className="label"><span className="acc">~~~</span> currently spinning</span>
                <span className="note">live · last.fm · v2</span>
              </div>
              ) : null}
            </div>

            <div className="inf-card">
              <h6>// books on the shelf</h6>
              <ul>
                <RevealLi src={IMG.fouragreements} title="The Four Agreements" meta="Don Miguel Ruiz · 1997" />
                <RevealLi src={IMG.quieroque} title="Quiero que me consuma la estética" meta="Stefano Llinás Lamboglia · 2022" />
                <RevealLi src={IMG.amarodepender} title="Amar o Depender" meta="Walter Riso · 2003" />
                <RevealLi src={IMG.hxh} title="Hunter × Hunter" meta="Yoshihiro Togashi · 1998" />
              </ul>
            </div>

            <div className="inf-card">
              <h6>// films</h6>
              <ul>
                <RevealLi src={IMG.loslobos} title="Los Lobos" meta="Samuel Kishi · 2019" />
                <RevealLi src={IMG.evangelion} title="The End of Evangelion" meta="Hideaki Anno · 1997" />
                <RevealLi src={IMG.catchingfire} title="The Hunger Games: Catching Fire" meta="Francis Lawrence · 2013" />
                <RevealLi src={IMG.ytumama} title="Y Tu Mamá También" meta="Alfonso Cuarón · 2001" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04, What I'm looking for ─────────────────────────── */}
      <section className="about-section">
        <aside className="side fade-in">
          <span>// 04</span><br/>
          <b>Looking for</b><br/>
          2026 onward
        </aside>
        <div className="fade-in">
          <h3>What I'm looking for, plainly.</h3>

          <p className="about-status">
            <span className="acc">→ </span>A <strong>senior product design</strong> role, on a team
            that takes craft seriously and ships work it can stand behind.
          </p>
          <p className="about-status">
            Open to relocate. Preference for <strong>Latin America</strong> or <strong>Europe</strong>.
            Remote considered for the right team.
          </p>

          <div className="about-status-meta">
            <span className="chip" data-state="live">● open to work</span>
            <span className="chip">senior / staff</span>
            <span className="chip">LATAM · EU</span>
            <span className="chip">starting Q2 2026</span>
          </div>

          <div style={{marginTop: 26}}>
            <a href="assets/aboutmestuff/CV%20-%20Keil%20Chinchilla.pdf" target="_blank" rel="noopener" download className="cv-link hoverable" data-snd-hover="1">
              Download CV · PDF · 84kb <span className="arrow">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 05, Colophon ─────────────────────────────────────── */}
      <section className="about-section" id="colophon" style={{borderBottom: 0}}>
        <aside className="side fade-in">
          <span>// 05</span><br/>
          <b>Colophon</b><br/>
          this site
        </aside>
        <div className="fade-in">
          <h3>Colophon.</h3>

          <div className="colophon">
            <span className="preamble">A small note, in the manner of a well-made book.</span>

            <dl>
              <dt>Typefaces</dt>
              <dd><em>Inter Tight</em> (display) · <em>EB Garamond</em> (italics, prose) · <em>JetBrains Mono</em> (chrome &amp; system labels)</dd>

              <dt>Design</dt>
              <dd>designed with <em>Claude Design</em>, in the open</dd>

              <dt>Build</dt>
              <dd>built with <em>Claude Code</em>, static HTML, no framework</dd>

              <dt>Sound</dt>
              <dd>Tone.js, composed live in the browser; the ambient bed was written to evoke Nala Sinephro's <em>Endlessness</em></dd>

              <dt>Hosting</dt>
              <dd>GitHub Pages</dd>

              <dt>Year</dt>
              <dd>2026 · v1.0</dd>

              <dt>Made in</dt>
              <dd>Tegucigalpa, Honduras, with too many yogurt and fruit bowls, the rain and the sunshine at the window, and the records on the right.</dd>
            </dl>

            <div className="signoff">
              <span className="acc">~~~</span> if you read this far, thank you. that's the whole point.
            </div>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
    </AboutReveal>
  );
}

window.About = About;

/* eslint-disable */
// App, router + tweaks + sound + welcome gate

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#c84a2a",
  "motionNotes": false,
  "showSysReadout": true
}/*EDITMODE-END*/;

const SESSION_KEY_WELCOMED = "keil.welcomed";
const SESSION_KEY_SOUND    = "keil.soundOn";

function App() {
  const [route, setRoute] = React.useState({ page: "home", slug: null });

  // Sound + welcome both persist across in-session navigation (sessionStorage)
  const [welcomed, setWelcomed] = React.useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY_WELCOMED) === "1"; }
    catch (e) { return false; }
  });
  const [soundOn, setSoundOnState] = React.useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY_SOUND) === "1"; }
    catch (e) { return false; }
  });

  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);

  const setSoundOn = (v) => {
    setSoundOnState(v);
    try { sessionStorage.setItem(SESSION_KEY_SOUND, v ? "1" : "0"); } catch (e) {}
  };

  // theme + accent
  React.useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", tweaks.accent);
  }, [tweaks.accent]);
  React.useEffect(() => {
    document.body.dataset.motionNotes = tweaks.motionNotes ? "on" : "off";
  }, [tweaks.motionNotes]);

  // If sound was on from a previous in-session page, re-enable on mount.
  React.useEffect(() => {
    if (welcomed && soundOn && !Sound.isOn()) {
      Sound.enable();
    }
  }, []); // run once

  // Sound zone + palette follow route + theme
  React.useEffect(() => {
    let z = "home";
    if (route.page === "about")   z = "about";
    if (route.page === "contact") z = "contact";
    if (route.page === "case")    z = (route.slug === "voxally") ? "case-voxally" : "case-miskit";
    Sound.setZone(z, tweaks.theme);
  }, [route.page, route.slug, tweaks.theme]);

  // smooth scroll (Lenis if available)
  const lenisRef = React.useRef(null);
  React.useEffect(() => {
    if (typeof Lenis === "undefined") return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, smoothTouch: false, easing: t => 1 - Math.pow(1 - t, 3) });
    lenisRef.current = lenis;
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, []);

  const resetScroll = () => {
    // Lenis hijacks the document scroller, so window.scrollTo alone isn't
    // reliable — Lenis will animate back from its remembered target. Stop
    // any in-flight animation, snap Lenis to 0, then also nudge the native
    // scrollers as a belt-and-braces fallback.
    const lenis = lenisRef.current;
    if (lenis) {
      try { lenis.stop(); } catch (e) {}
      try { lenis.scrollTo(0, { immediate: true, force: true, lock: true }); } catch (e) {}
      try { lenis.start(); } catch (e) {}
    }
    try { window.scrollTo(0, 0); } catch (e) {}
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const go = (page, slug) => {
    // Reset scroll BEFORE the new page mounts so the user never sees the
    // previous page's scroll position carried over.
    resetScroll();
    if (page === "case") setRoute({ page, slug: slug || "miskitapp" });
    else setRoute({ page, slug: null });
    // And again after the new page commits, in case anything (Lenis raf,
    // layout shift, hash) tried to restore scroll in the interim.
    requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
  };

  const toggleSound = async () => {
    if (soundOn) { Sound.disable(); setSoundOn(false); }
    else { await Sound.enable(); setSoundOn(true); }
  };

  const toggleTheme = () => {
    setTweaks("theme", tweaks.theme === "dark" ? "light" : "dark");
  };

  // Welcome gate handlers
  const enterWithSound = async () => {
    await Sound.enable();
    setSoundOn(true);
    completeWelcome();
  };
  const enterMuted = async () => {
    // Start audio context silently so the user can flip sound on later
    // without a second consent click.
    await Sound.warmup();
    setSoundOn(false);
    completeWelcome();
  };
  const completeWelcome = () => {
    try { sessionStorage.setItem(SESSION_KEY_WELCOMED, "1"); } catch (e) {}
    setWelcomed(true);
  };

  // Hide the rest of the app behind the welcome gate on first visit.
  if (!welcomed) {
    return <WelcomeScreen onEnter={enterWithSound} onEnterMuted={enterMuted} />;
  }

  return (
    <React.Fragment>
      <Cursor />
      <div className="shell">
        <TopBar route={route} go={go}
                soundOn={soundOn} toggleSound={toggleSound}
                theme={tweaks.theme} toggleTheme={toggleTheme} />

        {route.page === "home"    ? <Home go={go} /> : null}
        {route.page === "about"   ? <About go={go} /> : null}
        {route.page === "contact" ? <Contact go={go} /> : null}
        {route.page === "case"    ? <CaseStudy go={go} slug={route.slug} /> : null}
      </div>

      {tweaks.showSysReadout ? <SysReadout route={route} /> : null}

      <TweaksUI tweaks={tweaks} setTweaks={setTweaks} />
    </React.Fragment>
  );
}

// ── Welcome / boot screen ────────────────────────────────────
// First-load gate. Doubles as the sound-consent gesture.
// Primary path: [ ENTER ] (sound on). Secondary: "enter muted".
function WelcomeScreen({ onEnter, onEnterMuted }) {
  // Each boot line gets a side annotation (status / timing / payload) so the
  // sequence reads like a real warming-up of a system, not pure decoration.
  const BOOT = [
    { msg: "initializing portfolio runtime",   side: "v1.0 · static · 0 deps" },
    { msg: "loading index · 03 entries",       side: "3 case studies" },
    { msg: "preparing ambient sound layer",    side: "Tone.js · pad in F lydian" },
    { msg: "calibrating cursor + parallax",    side: "lerp 0.06 · 6px max" },
    { msg: "system online · awaiting input",   side: "tap ENTER below" },
  ];
  const [bootLines, setBootLines] = React.useState([]);
  const [ready, setReady] = React.useState(false);
  const [clock, setClock] = React.useState(() => new Date());

  // type the boot lines in, then reveal the entry controls
  React.useEffect(() => {
    let i = 0;
    const t = setTimeout(function tick() {
      if (i < BOOT.length) {
        setBootLines((prev) => [...prev, BOOT[i]]);
        i += 1;
        setTimeout(tick, 260 + Math.random() * 120);
      } else {
        setTimeout(() => setReady(true), 220);
      }
    }, 280);
    return () => clearTimeout(t);
  }, []);

  // live clock in the bracket chrome
  React.useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ENTER on keyboard = sound on (matches the diegetic intent: this IS the door)
  React.useEffect(() => {
    if (!ready) return;
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onEnter(); }
      if (e.key === "Escape" || e.key === "m" || e.key === "M") { e.preventDefault(); onEnterMuted(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, onEnter, onEnterMuted]);

  const tg = clock.toLocaleTimeString("en-GB", { hour12: false, timeZone: "America/Tegucigalpa" });

  return (
    <div className="welcome" data-ready={ready}>
      <div className="welcome-chrome">
        <span className="seg">[ <b>KEIL · CHINCHILLA</b> / PORTFOLIO · v1 ]</span>
        <span className="seg">[ TGU · {tg} ]</span>
      </div>

      {/* Quiet corner anchor, gives the screen a visual identity beyond
          text, without pretending to be a logo. CSS-only crosshair mark. */}
      <div className="welcome-mark" aria-hidden="true">
        <div className="cross"></div>
        <div className="mark-meta mono">
          <span>// 14° 4′ N</span>
          <span>// 87° 12′ W</span>
          <span>// elev. 990m</span>
        </div>
      </div>

      <main className="welcome-stage">
        <div className="welcome-boot mono" aria-live="polite">
          {bootLines.map((line, i) => (
            <div key={i} className="boot-line">
              <span className="caret">›</span>
              <span className="msg">{line.msg}</span>
              <span className="side">{line.side}</span>
            </div>
          ))}
          {!ready ? <div className="boot-line cursor-blink"><span className="caret">›</span> <span className="blink">_</span></div> : null}
        </div>

        <div className="welcome-entry" data-show={ready}>
          <div className="welcome-message mono">
            <span className="acc">~~~</span> this site has sound. you can turn it off anytime.
          </div>

          <button
            className="welcome-enter hoverable"
            onClick={onEnter}
            data-snd-hover="0">
            <span className="bk">[</span>
            <span className="word">ENTER</span>
            <span className="bk">]</span>
            <span className="hint mono">↵ sound on</span>
          </button>

          <button
            className="welcome-muted hoverable"
            onClick={onEnterMuted}>
            <span>enter muted</span>
            <span className="hint mono">esc · continue without sound</span>
          </button>
        </div>
      </main>

      <div className="welcome-foot mono">
        <span>// made in tegucigalpa / made for anywhere</span>
        <span className="acc">● online</span>
      </div>
    </div>
  );
}

// ── Tweaks panel ────────────────────────────────────────────
function TweaksUI({ tweaks, setTweaks }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme">
        <TweakRadio
          label="Mode"
          value={tweaks.theme}
          onChange={(v) => setTweaks("theme", v)}
          options={[{ value: "light", label: "Paper" }, { value: "dark", label: "Ink" }]}
        />
        <TweakColor
          label="Accent"
          value={tweaks.accent}
          onChange={(v) => setTweaks("accent", v)}
          options={[
            "#c84a2a", /* oxide red */
            "#3a5a3a", /* moss */
            "#3a4a8a", /* prussian */
            "#a8862e", /* ochre */
          ]}
        />
      </TweakSection>

      <TweakSection label="Annotations">
        <TweakToggle
          label="Show motion notes"
          value={tweaks.motionNotes}
          onChange={(v) => setTweaks("motionNotes", v)}
        />
        <TweakToggle
          label="System readout"
          value={tweaks.showSysReadout}
          onChange={(v) => setTweaks("showSysReadout", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

// Mount
// NOTE: When loaded via `<script type="text/babel">` (babel-standalone),
// React 18's concurrent `createRoot().render()` silently never commits its
// first render in this exact eval/timing context, the call resolves clean,
// no errors fire, but #app stays empty. The same code path works fine when
// called from a separate user-gesture eval, ruling out a code bug.
//
// React 18 still exposes the legacy `ReactDOM.render` API (synchronous,
// pre-concurrent). It commits immediately on the same call stack, sidesteps
// the concurrent scheduler entirely, and renders the welcome screen on first
// paint as intended. The "ReactDOM.render is no longer supported in React 18"
// console warning is the cost of admission; we accept it for reliability.
ReactDOM.render(<App />, document.getElementById("app"));

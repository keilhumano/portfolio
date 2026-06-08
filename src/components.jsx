/* eslint-disable */
// Shared components: Nav, Footer, Cursor, system labels, sound engine

// ── Sound engine v2 ──────────────────────────────────────────
// section-bound pads · zone instrumentation · theme-bound palette.
const Sound = (() => {
  let started = false;
  let on = false;
  let masterGain = null;
  let padBus = null;
  let reverb = null;
  let activePad = null;  // { synth, gain, chord, zone }
  let zone = "home";     // home | case-miskit | case-voxally | about | contact
  let palette = "light";

  // chord palettes per zone × theme
  const CHORDS = {
    light: {
      home:          ["C3","G3","D4","A4"],
      "case-miskit": ["A2","E3","B3","F#4"], // contemplative
      "case-voxally":["D3","A3","E4","B4"],  // more open
      about:         ["F2","C3","G3","D4"],  // warm
      contact:       ["G2","D3","A3","E4"],  // sparse
    },
    dark: {
      home:          ["A2","E3","B3","F#4"], // minor-leaning
      "case-miskit": ["F2","C3","G3","D4","Ab3"],
      "case-voxally":["E2","B2","F#3","A3"],
      about:         ["D2","A2","E3","F3"],
      contact:       ["G2","D3","Bb3","F4"],
    },
  };

  // hover scale per zone (one-shot accents)
  const SCALES = {
    home:          ["G4","A4","C5","D5","E5","G5","A5","C6"],   // pentatonic
    "case-miskit": ["F4","A4","C5","E5","F5","A5"],             // woodwind-ish
    "case-voxally":["C5","E5","G5","C6"],                       // tight, percussive feel
    about:         ["E4","G4","B4","D5","E5","G5"],             // Rhodes-y
    contact:       ["C5","G5","C6"],                            // sparse bell
    nav:           ["E5","F5","G5","A5","B5"],                  // marimba scale across nav
  };

  function ensure() {
    if (started || typeof Tone === "undefined") return;
    masterGain = new Tone.Gain(0).toDestination();
    reverb = new Tone.Reverb({ decay: 4, wet: 0.35 }).connect(masterGain);
    padBus = new Tone.Gain(0).connect(reverb);
    reverb.generate?.();
    started = true;
  }

  async function enable() {
    if (typeof Tone === "undefined") return;
    await Tone.start();
    ensure();
    on = true;
    masterGain.gain.rampTo(1, 0.5);
    setZone(zone, palette); // start the current zone pad
  }

  // start the audio context but keep silent, used by "enter muted"
  // so a later toggle-on doesn't need another consent gesture.
  async function warmup() {
    if (typeof Tone === "undefined") return;
    try { await Tone.start(); ensure(); } catch (e) {}
  }

  function disable() {
    on = false;
    if (!started) return;
    masterGain && masterGain.gain.rampTo(0, 0.6);
    fadeOutPad(0.6);
  }

  function fadeOutPad(t = 0.8) {
    if (!activePad) return;
    const { synth, gain } = activePad;
    gain.gain.rampTo(0, t);
    setTimeout(() => { try { synth.releaseAll(); synth.dispose(); gain.dispose(); } catch(e){} }, (t + 0.3) * 1000);
    activePad = null;
  }

  function setZone(nextZone, nextPalette) {
    zone = nextZone || zone;
    palette = nextPalette || palette;
    if (!on || !started) return;
    // crossfade pad to next chord
    const chord = (CHORDS[palette]?.[zone]) || CHORDS.light.home;
    const wet = palette === "dark" ? 0.55 : 0.32;
    try { reverb.wet.rampTo(wet, 0.6); } catch(e){}
    const newGain = new Tone.Gain(0).connect(padBus);
    const newSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: palette === "dark" ? "triangle" : "sine" },
      envelope: { attack: 1.5, decay: 0.8, sustain: 0.7, release: 4 },
      volume: -8,
    }).connect(newGain);
    newSynth.triggerAttack(chord, undefined, 0.18);
    newGain.gain.rampTo(0.05, 0.8);

    fadeOutPad(0.8);
    activePad = { synth: newSynth, gain: newGain, chord, zone };
  }

  // brief silence (the Nuevo Cuento beat): drop pad, restore after `ms`.
  function holdSilence(ms = 1000) {
    if (!on || !started || !activePad) return;
    const { gain } = activePad;
    const prev = 0.05;
    gain.gain.rampTo(0, 0.4);
    setTimeout(() => { try { gain.gain.rampTo(prev, 0.8); } catch(e){} }, ms + 400);
  }

  // hover hum / pluck, per kind × palette
  function hover(seedOrOpts = 0) {
    if (!on || !started) return;
    const opts = (typeof seedOrOpts === "object") ? seedOrOpts : { seed: seedOrOpts };
    const kind = opts.kind || zone;
    const scale = SCALES[opts.kind] || SCALES[zone] || SCALES.home;
    const idx = Math.abs(opts.seed || 0) % scale.length;
    let note = opts.note || scale[idx];
    if (palette === "dark") {
      // shift one octave down for some zones to add weight
      if (kind === "case-miskit" || kind === "about") {
        note = note.replace(/(\d)$/, (m, d) => Math.max(2, parseInt(d, 10) - 1));
      }
    }
    try {
      // base instrument + dark variant
      let synth;
      const decay = palette === "dark" ? 0.9 : 0.5;
      const release = palette === "dark" ? 1.0 : 0.6;
      const vol = -30;
      if (kind === "nav") {
        // marimba → vibraphone (AM mod gives the chorused tremolo)
        synth = palette === "dark"
          ? new Tone.AMSynth({ harmonicity: 2.5, modulation: { type: "sine" }, envelope: { attack: 0.01, decay: 0.7, sustain: 0, release: 1.2 }, volume: vol - 2 })
          : new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.02, decay, sustain: 0, release }, volume: vol });
      } else if (kind === "brand") {
        // Keil / Home, short saxy phrase on a C major chord, random each hover
        const cMaj = palette === "dark"
          ? ["C3","E3","G3","C4","E4","G4"]
          : ["C4","E4","G4","C5","E5","G5"];
        const start = Math.floor(Math.random() * (cMaj.length - 1));
        // phrase: 2–3 chord tones; sometimes start with a passing approach
        const variants = [
          [cMaj[start], cMaj[(start + 1) % cMaj.length]],
          [cMaj[start], cMaj[(start + 1) % cMaj.length], cMaj[(start + 2) % cMaj.length]],
          [cMaj[(start + 1) % cMaj.length], cMaj[start]],
        ];
        const notes = variants[Math.floor(Math.random() * variants.length)];
        const sax = new Tone.FMSynth({
          harmonicity: 3,
          modulationIndex: palette === "dark" ? 10 : 14,
          oscillator: { type: "sawtooth" },
          modulation: { type: "square" },
          envelope:           { attack: 0.06, decay: 0.18, sustain: 0.55, release: 0.45 },
          modulationEnvelope: { attack: 0.25, decay: 0.10, sustain: 0.80, release: 0.55 },
          volume: vol + 2,
        }).connect(reverb);
        notes.forEach((n, i) => setTimeout(() => {
          try { sax.triggerAttackRelease(n, palette === "dark" ? 0.22 : 0.18); } catch (err) {}
        }, i * 150));
        setTimeout(() => sax.dispose(), 1800);
        return;
      } else if (kind === "theme") {
        // Light/Dark toggle, quick crystalline blip (high glass tone)
        note = palette === "dark" ? "F#5" : "B5";
        synth = new Tone.FMSynth({
          harmonicity: 3.01,
          modulationIndex: 6,
          envelope: { attack: 0.002, decay: 0.18, sustain: 0, release: 0.25 },
          modulationEnvelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
          volume: vol - 4,
        });
      } else if (kind === "soundtoggle") {
        // Sound on/off, soft breathy noise burst (pink), the "audio" sound
        synth = new Tone.NoiseSynth({
          noise: { type: "pink" },
          envelope: { attack: 0.012, decay: 0.18, sustain: 0, release: 0.2 },
          volume: vol - 4,
        });
        synth.connect(reverb);
        synth.triggerAttackRelease(palette === "dark" ? 0.18 : 0.14);
        setTimeout(() => synth.dispose(), 1200);
        return;
      } else if (kind === "footer") {
        // Footer, closed hi-hat tick + smooth low sub-bass
        try {
          const hpf = new Tone.Filter({ type: "highpass", frequency: 7000, Q: 0.7 }).connect(reverb);
          const hat = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.045, sustain: 0, release: 0.04 },
            volume: vol - 2,
          }).connect(hpf);
          hat.triggerAttackRelease(0.03);
          setTimeout(() => { try { hat.dispose(); hpf.dispose(); } catch (err) {} }, 500);
        } catch (err) {}
        const bassScale = palette === "dark" ? ["E1","G1","A1","C2","D2"] : ["A1","C2","D2","E2","G2"];
        note = opts.note || bassScale[Math.abs(opts.seed || 0) % bassScale.length];
        const bass = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.18, decay: 0.6, sustain: 0.05, release: 1.4 },
          volume: vol + 2,
        }).connect(reverb);
        // Bass lands a hair after the hat, like a kit hit
        setTimeout(() => {
          try { bass.triggerAttackRelease(note, palette === "dark" ? 0.7 : 0.5); } catch (err) {}
        }, 90);
        setTimeout(() => bass.dispose(), 2600);
        return;
      } else if (kind === "case-miskit") {
        // flute/clarinet → bass clarinet (FM, breathy)
        synth = palette === "dark"
          ? new Tone.FMSynth({ harmonicity: 1.2, modulationIndex: 8, envelope: { attack: 0.06, decay: 0.8, sustain: 0, release: 1.4 }, volume: vol - 1 })
          : new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.04, decay: 0.6, sustain: 0, release: 0.8 }, volume: vol });
      } else if (kind === "case-voxally") {
        // muted electronic kick → same with sidechain-ish duck via shorter env
        synth = new Tone.MembraneSynth({ pitchDecay: palette === "dark" ? 0.05 : 0.03, octaves: 1.5, envelope: { attack: 0.001, decay: palette === "dark" ? 0.3 : 0.2, sustain: 0, release: 0.2 }, volume: vol - 2 });
      } else if (kind === "about") {
        // Rhodes → felt piano (softer attack)
        synth = palette === "dark"
          ? new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.08, decay: 0.9, sustain: 0, release: 1.4 }, volume: vol - 1 })
          : new Tone.AMSynth({ harmonicity: 3, modulation: { type: "sine" }, envelope: { attack: 0.02, decay: 0.6, sustain: 0, release: 0.9 }, volume: vol });
      } else if (kind === "contact") {
        // bell → Tibetan bowl (sine with long tail)
        synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.04, decay: palette === "dark" ? 1.6 : 0.9, sustain: 0, release: palette === "dark" ? 2.2 : 1.0 }, volume: vol - 2 });
      } else {
        // home / default: sine pluck; dark = slower
        synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: palette === "dark" ? 0.05 : 0.02, decay, sustain: 0, release }, volume: vol });
      }
      synth.connect(reverb);
      synth.triggerAttackRelease(note, palette === "dark" ? 0.32 : 0.22);
      setTimeout(() => synth.dispose(), 2200);
    } catch(e){}
  }

  // sustained hum (hero "Keil" hover), dark = lower octave, longer tail
  let sustainVoice = null;
  function sustain(note = "C4") {
    if (!on || !started) return;
    sustainStop();
    try {
      const n = palette === "dark" ? note.replace(/(\d)$/, (m, d) => Math.max(2, parseInt(d, 10) - 1)) : note;
      sustainVoice = new Tone.Synth({
        oscillator: { type: "sine" },
        envelope: { attack: palette === "dark" ? 0.9 : 0.6, decay: 0.4, sustain: 1, release: palette === "dark" ? 1.8 : 1.2 },
        volume: palette === "dark" ? -24 : -22,
      }).connect(reverb);
      sustainVoice.triggerAttack(n);
    } catch(e){}
  }
  function sustainStop() {
    if (sustainVoice) { try { sustainVoice.triggerRelease(); } catch(e){} ; const s = sustainVoice; setTimeout(() => s.dispose(), 1800); sustainVoice = null; }
  }

  function click(kind) {
    if (!on || !started) return;
    const k = kind || zone;
    try {
      if (k === "case-voxally" || k === "case-miskit" || k === "home" || k === "nav") {
        const v = new Tone.MembraneSynth({
          pitchDecay: palette === "dark" ? 0.04 : 0.02,
          octaves: palette === "dark" ? 2.6 : 2,
          envelope: { attack: 0.001, decay: palette === "dark" ? 0.32 : 0.18, sustain: 0, release: palette === "dark" ? 0.18 : 0.1 },
          volume: -22,
        }).connect(reverb);
        v.triggerAttackRelease(
          k === "case-voxally" ? (palette === "dark" ? "E1" : "G1") :
          (palette === "dark" ? "A1" : "C2"),
          0.06
        );
        setTimeout(() => v.dispose(), 1200);
      } else if (k === "about") {
        const v = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: palette === "dark" ? "triangle" : "sine" },
          envelope: { attack: 0.02, decay: 0.6, sustain: 0, release: palette === "dark" ? 1.6 : 1.0 },
          volume: -24,
        }).connect(reverb);
        v.triggerAttackRelease(palette === "dark" ? ["A2","C3","E3"] : ["C3","E3","G3"], 0.3);
        setTimeout(() => v.dispose(), 2000);
      } else { // contact
        if (palette === "dark") {
          // low brass swell, short
          const v = new Tone.FMSynth({ harmonicity: 1.5, modulationIndex: 4, envelope: { attack: 0.15, decay: 0.4, sustain: 0, release: 0.5 }, volume: -22 }).connect(reverb);
          v.triggerAttackRelease("C3", 0.4);
          setTimeout(() => v.dispose(), 1600);
        } else {
          const v = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.8, sustain: 0, release: 1 }, volume: -22 }).connect(reverb);
          v.triggerAttackRelease("C6", 0.18);
          setTimeout(() => v.dispose(), 1500);
        }
      }
    } catch(e){}
  }

  // very quiet paper-shuffle for hover preview cards
  function shuffle() {
    if (!on || !started || typeof Tone === "undefined") return;
    try {
      const noise = new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.05 },
        volume: -38,
      }).connect(reverb);
      noise.triggerAttackRelease(0.1);
      setTimeout(() => noise.dispose(), 800);
    } catch(e){}
  }

  // ── Synth arpeggio (Next Entry button) ──────────────────────
  // Distinctly synthy, sawtooth + lowpass filter sweep, detuned.
  // Different vocabulary from the harp accent layer.
  function synthArp(opts = {}) {
    if (!on || !started || typeof Tone === "undefined") return;
    const lightScale = ["C4","E4","G4","B4","C5","D5","E5","G5","B5"];
    const darkScale  = ["A3","C4","E4","G4","A4","C5","E5","G5","A5"];
    const scale = palette === "dark" ? darkScale : lightScale;
    const start = Math.abs(opts.seed || 0) % (scale.length - 4);
    const notes = [
      scale[start],
      scale[start + 2],
      scale[start + 4],
      scale[start + 3],
      scale[start + 2],
    ];
    try {
      const lead = new Tone.MonoSynth({
        oscillator: { type: "sawtooth" },
        filter: { Q: 4, type: "lowpass" },
        filterEnvelope: {
          attack: 0.004,
          decay: 0.18,
          sustain: 0.35,
          release: 0.4,
          baseFrequency: palette === "dark" ? 280 : 420,
          octaves: 3.2,
        },
        envelope: { attack: 0.005, decay: 0.12, sustain: 0.25, release: 0.35 },
        volume: -26,
      }).connect(reverb);
      notes.forEach((n, i) => setTimeout(() => {
        try { lead.triggerAttackRelease(n, 0.1); } catch (err) {}
      }, i * 75));
      setTimeout(() => lead.dispose(), 1600);
    } catch (err) {}
  }

  // ── Harp accents (case-study layer) ─────────────────────────
  // PluckSynth gives a believable harp/koto. Dark mode = higher dampening
  // (felted strings). Sustained mode = single note, slow attack.
  const HARP_SCALE_LIGHT = ["E4","G4","A4","C5","D5","E5","G5","A5","C6","D6"];
  const HARP_SCALE_DARK  = ["D4","F4","G4","A4","C5","D5","F5","G5","A5","C6"];
  function harp(opts = {}) {
    if (!on || !started || typeof Tone === "undefined") return;
    const scale = palette === "dark" ? HARP_SCALE_DARK : HARP_SCALE_LIGHT;
    const startIdx = (opts.seed != null) ? Math.abs(opts.seed) % (scale.length - 4) : 0;
    const sustained = !!opts.sustained;
    const baseVol = -36; // 6dB below the hover instrument (-30)
    try {
      if (sustained) {
        const v = new Tone.PluckSynth({
          attackNoise: palette === "dark" ? 0.6 : 1,
          dampening:   palette === "dark" ? 2200 : 3500,
          resonance:   palette === "dark" ? 0.78 : 0.92,
          volume: baseVol - (palette === "dark" ? 4 : 2),
        }).connect(reverb);
        // small "in" gain ramp to fake fade-in
        const g = new Tone.Gain(0).connect(reverb);
        v.disconnect(); v.connect(g);
        g.gain.rampTo(1, 0.4);
        v.triggerAttack(scale[startIdx]);
        setTimeout(() => { try { g.gain.rampTo(0, 0.6); v.dispose(); g.dispose(); } catch(e){} }, 1400);
      } else {
        const notes = [
          scale[startIdx],
          scale[startIdx + 2],
          scale[startIdx + 3],
          scale[startIdx + 4],
        ];
        const v = new Tone.PluckSynth({
          attackNoise: palette === "dark" ? 0.5 : 1,
          dampening:   palette === "dark" ? 2400 : 4000,
          resonance:   palette === "dark" ? 0.7 : 0.9,
          volume: baseVol,
        }).connect(reverb);
        notes.forEach((n, i) => setTimeout(() => { try { v.triggerAttack(n); } catch(e){} }, i * 110));
        setTimeout(() => v.dispose(), 1400);
      }
    } catch(e){}
  }

  return { enable, disable, warmup, hover, click, sustain, sustainStop, setZone, holdSilence, shuffle, harp, synthArp, isOn: () => on };
})();
window.Sound = Sound;

// ── small primitives ─────────────────────────────────────────
function Brk({ children, breath, rot }) {
  return (
    <span className={"mono" + (breath ? " bk-breath" : "") + (rot ? " bk-rot" : "")}>
      {children}
    </span>
  );
}

function SectionLabel({ num, label, right }) {
  return (
    <div className="section-label">
      <span className="num mono">{num}</span>
      <span className="bk mono">[</span>
      <span className="mono">{label}</span>
      <span className="bk mono">]</span>
      <span className="rule"></span>
      {right ? <span className="mono">{right}</span> : null}
    </div>
  );
}

// ── Reading progress (case-study only) ───────────────────────
function ReadingProgress({ enabled }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) { setPct(0); return; }
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [enabled]);
  if (!enabled) return null;
  return (
    <span className="read-progress" aria-hidden="true">
      <span>[ read ]</span>
      <span className="track" style={{ "--p": pct + "%" }}></span>
      <span className="pct">{Math.round(pct)}%</span>
    </span>
  );
}
window.ReadingProgress = ReadingProgress;

// ── Top nav ──────────────────────────────────────────────────
function TopBar({ route, go, soundOn, toggleSound, theme, toggleTheme }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const links = [
    { id: "home",    label: "Projects" },
    { id: "about",   label: "About" },
    { id: "contact", label: "Contact" },
  ];
  const onCase = route.page === "case";
  return (
    <React.Fragment>
      <header className="topbar" data-case={onCase ? "true" : "false"}>
        <div className="left">
          <a className="brand hoverable" onClick={() => { Sound.click(); go("home"); }}
             data-snd-hover="1">
            <span className="glyph">◆</span>
            <span>Keil&nbsp;Chinchilla</span>
            <span className="muted" style={{marginLeft: 6}}>/ ux × ui</span>
          </a>
          <ReadingProgress enabled={onCase} />
        </div>
        <nav className="mid">
          {links.map(l => (
            <a key={l.id}
               className="navlink hoverable"
               data-active={route.page === l.id}
               onClick={() => { Sound.click(); go(l.id); }}
               data-snd-hover="1">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="right">
          <button className="theme-toggle hoverable" onClick={() => { Sound.click(); toggleTheme(); }} data-snd-hover="1">
            <span>{theme === "dark" ? "◐ dark" : "◑ light"}</span>
          </button>
          <button className="sound-toggle hoverable" data-on={soundOn}
                  onClick={() => { Sound.click(); toggleSound(); }} data-snd-hover="1"
                  aria-label={soundOn ? "Sound on, click to mute" : "Sound off, click to enable"}
                  title={soundOn ? "sound on" : "sound off"}>
            <span className="sound-icon" aria-hidden="true">
              <span className="spk"></span>
              <span className="wv wv-1"></span>
              <span className="wv wv-2"></span>
              <span className="wv wv-3"></span>
              <span className="slash"></span>
            </span>
            <span className="sound-label">{soundOn ? "sound on" : "muted"}</span>
          </button>
        </div>
        <button className="menu-btn hoverable" onClick={() => { Sound.click(); setDrawerOpen(true); }} data-snd-hover="1">
          [ menu ] <span style={{marginLeft: 2}}>≡</span>
        </button>
      </header>

      <aside className="drawer" data-open={drawerOpen} aria-hidden={!drawerOpen}>
        <div className="top">
          <span>[ index ]</span>
          <button className="close hoverable" onClick={() => { Sound.click(); setDrawerOpen(false); }}>×</button>
        </div>
        <div className="links">
          {links.map((l, i) => (
            <a key={l.id}
               data-num={String(i + 1).padStart(2, "0")}
               data-active={route.page === l.id}
               onClick={() => { Sound.click(); setDrawerOpen(false); go(l.id); }}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="toggles">
          <button className="hoverable" onClick={() => { Sound.click(); toggleTheme(); }}>
            {theme === "dark" ? "◐ dark" : "◑ light"}
          </button>
          <button className="hoverable" data-on={soundOn}
                  onClick={() => { Sound.click(); toggleSound(); }}
                  aria-label={soundOn ? "Sound on, click to mute" : "Sound off, click to enable"}>
            <span className="sound-icon" aria-hidden="true" style={{marginRight: 8}}>
              <span className="spk"></span>
              <span className="wv wv-1"></span>
              <span className="wv wv-2"></span>
              <span className="wv wv-3"></span>
              <span className="slash"></span>
            </span>
            {soundOn ? "sound on" : "muted"}
          </button>
        </div>
      </aside>
    </React.Fragment>
  );
}

// ── Footer ───────────────────────────────────────────────────
function Footer({ go }) {
  return (
    <footer className="footer">
      <div>
        <div className="signature">
          Designed and built by Keil Chinchilla, in Tegucigalpa.
          <span className="small">v1.0, 2026, Made in Honduras, made for anywhere.</span>
        </div>
      </div>
      <div>
        <h6>Index</h6>
        <a onClick={() => go("home")} className="hoverable" data-snd-hover="1">Projects</a>
        <a onClick={() => go("about")} className="hoverable" data-snd-hover="1">About</a>
        <a onClick={() => go("contact")} className="hoverable" data-snd-hover="1">Contact</a>
      </div>
      <div>
        <h6>Elsewhere</h6>
        <a href="https://www.linkedin.com/in/keilhumano/" target="_blank" rel="noopener" className="hoverable" data-snd-hover="1">LinkedIn ↗</a>
       
      </div>
      <div>
        <h6>System</h6>
        <a className="hoverable" data-snd-hover="1">EN / ES (soon)</a>
        <a className="hoverable" data-snd-hover="1">Reduced motion</a>
        <a className="hoverable" data-snd-hover="1">Colophon</a>
      </div>
    </footer>
  );
}

// ── Custom cursor ────────────────────────────────────────────
function Cursor() {
  const ref = React.useRef(null);
  const [mode, setMode] = React.useState("default");
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf;
    const tick = () => {
      x += (tx - x) * 0.25; y += (ty - y) * 0.25;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onOver = (e) => {
      const t = e.target.closest("[data-snd-hover], a, button, .hoverable, .idx-row, .cs-next");
      if (!t) { setMode("default"); return; }
      if (t.classList.contains("idx-row") || t.classList.contains("cs-next")) setMode("link");
      else setMode("hover");
      if (t.matches("[data-snd-hover='1']")) {
        const seed = (t.textContent || "").length;
        // zone-aware kind hints
        const isBrand    = t.classList.contains("brand");
        const isTheme    = t.classList.contains("theme-toggle");
        const isSndTog   = t.classList.contains("sound-toggle");
        const isNavLink  = t.classList.contains("navlink");
        const isCSNext   = t.classList.contains("cs-next");
        const isCaseRail = !!t.closest(".case-rail");
        const isFooter   = !!t.closest(".footer");
        const isPrev     = t.classList.contains("idx-row");
        const isHero     = t.classList.contains("hero-cutout");
        if (isBrand)         Sound.hover({ kind: "brand", seed });
        else if (isTheme)    Sound.hover({ kind: "theme", seed });
        else if (isSndTog)   Sound.hover({ kind: "soundtoggle", seed });
        else if (isNavLink)  Sound.hover({ kind: "nav", seed });
        else if (isCSNext)   Sound.synthArp({ seed });
        else if (isCaseRail) Sound.hover({ kind: "case-voxally", seed });
        else if (isFooter)   Sound.hover({ kind: "footer", seed });
        else if (isPrev) { Sound.hover({ seed }); Sound.shuffle(); }
        else if (isHero) Sound.sustain("C4");
        else Sound.hover({ seed });
      }
    };
    const onOut = (e) => {
      setMode("default");
      const t = e.target?.closest?.(".hero-cutout");
      if (t) Sound.sustainStop();
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div ref={ref} className="cursor" data-mode={mode}></div>;
}

// ── System readout ───────────────────────────────────────────
function SysReadout({ route }) {
  const [t, setT] = React.useState(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const tg = t.toLocaleTimeString("en-GB", { hour12: false, timeZone: "America/Tegucigalpa" });
  const labels = { home: "Index / Projects", about: "Personal / About",
                   contact: "Direct / Contact", case: "Case / Detail" };
  return (
    <div className="sys">
      <span className="seg">[ <b>TGU</b> · {tg} ]</span>
      <span className="seg">{labels[route.page]} {route.slug ? `· ${route.slug}` : ""}</span>
      <span className="seg">~~ system: online</span>
    </div>
  );
}

// ── Fade-in observer hook ────────────────────────────────────
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".fade-in");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── In-page anchor scroll (case study side nav) ──────────────
function smoothToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

// Export to window
Object.assign(window, {
  Sound, Brk, SectionLabel, TopBar, Footer, Cursor, SysReadout, useReveal, smoothToId,
});

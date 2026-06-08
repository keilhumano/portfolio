/* eslint-disable */
// Homepage: Hero + Projects index

const PROJECTS = [
{
  n: "01", slug: "miskitapp", name: "MiskitApp", year: "2025", tag: "Cultural preservation × mobile app",
  desc: "An interactive platform for learning Miskitu, an endangered indigenous language of Honduras. Research-led; oral tradition reframed as the reward loop.",
  meta: "Sole designer · Research · iOS prototype · Bilingual UX",
  thumb: "1894 → 1985 → 2025",
  previews: [
    { img: "assets/preview-miskitapp-1.png", label: "Inicio · 1894 engraving" },
    { img: "assets/preview-miskitapp-2.png", label: "Lección 1 · question state" },
    { img: "assets/preview-miskitapp-3.png", label: "Galería · El Sapo Orgulloso" }
  ]
},
{
  n: "02", slug: "voxally", name: "Voxally", year: "2026", tag: "Accessibility marketplace × mobile app",
  desc: "A marketplace connecting Deaf creators with interpreters for ASL, BASL, captioning, and voiceover. Reviewed a fast-moving AI-scaffolded build, redesigned the broken parts, shipped what was missing.",
  meta: "UX/UI designer (Acklen Avenue) · iOS + Android · Live on the stores",
  thumb: "Stewardship, not authorship",
  previews: [
    { img: "assets/preview-voxally-1.png", label: "Interpreter · vertical video" },
    { img: "assets/preview-voxally-2.png", label: "Upload · get transcription" },
    { img: "assets/preview-voxally-3.png", label: "App icon · Icon Composer" }
  ]
},
{
  n: "03", slug: "onepoint", name: "OnePointPartitions", short: "OPP", year: "2024", tag: "B2B quoting × 3D configurator",
  desc: "A quoting tool for commercial bathroom partitions, with a real-time 3D configurator that works on a phone. Co-designed Phase 1; led design on Phase 2.",
  meta: "UX/UI Designer → Design Lead · Web · Acklen Avenue",
  thumb: "62% on mobile · 3D on a phone",
  previews: [
    { img: "assets/preview-opp-1.png", label: "Mobile · stall layout" },
    { img: "assets/preview-opp-2.png", label: "Configurator · 2D / 3D" },
    { img: "assets/preview-opp-3.png", label: "Order portal · Phase 2" }
  ]
}];


function Home({ go }) {
  const [openId, setOpenId] = React.useState(null);
  const [filter, setFilter] = React.useState("all");
  const [grouped, setGrouped] = React.useState(false);
  const [activePreview, setActivePreview] = React.useState(null);   // slug
  const [tapStage, setTapStage] = React.useState(null);             // mobile: slug of project tap-revealed
  const [isTouch, setIsTouch] = React.useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: none)").matches;
  });
  const cursorRef = React.useRef({ x: 0, y: 0 });                   // continuously updated
  useReveal();

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

  // Dismiss helper, called by the mobile scrim and by the row-different-slug guard.
  const dismissPreview = React.useCallback(() => {
    setTapStage(null);
    setActivePreview(null);
    setOpenId(null);
  }, []);

  const filtered = PROJECTS.filter((p) =>
  filter === "all" ? true :
  filter === "lab" ? p.lab :
  !p.lab
  );

  // Deck-of-three: ultra-tight cluster around the cursor.
  // 180px-wide cards centered at r=92–95px from cursor → nearest edges sit
  // 2–5px from the cursor center. Small angular jitter so it reads as a
  // hand of cards fanned at the fingertip, not three discrete thumbnails.
  const dealRef = React.useRef({ slug: null, deals: [] });
  const dealFor = (slug) => {
    if (dealRef.current.slug === slug) return dealRef.current.deals;
    const seed = (s) => { let h = 0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) | 0; return h; };
    const rand = (() => {
      let s = Math.abs(seed(slug + Date.now())) | 0;
      return () => { s = (s * 1664525 + 1013904223) | 0; return ((s >>> 0) % 10000) / 10000; };
    })();
    const slice = (Math.PI * 2) / 3;
    const baseAngle = rand() * Math.PI * 2;
    const deals = [0,1,2].map((i) => {
      const angle = baseAngle + i * slice + (rand() - 0.5) * 0.25; // ±~7° jitter
      const r = 100 + rand() * 4; // 100–104 → edges 10–14px from cursor
      return {
        dx: Math.cos(angle) * r,
        dy: Math.sin(angle) * r,
        rot: (rand() * 16 - 8),
      };
    });
    dealRef.current = { slug, deals };
    return deals;
  };

  return (
    <div className="page-enter">

      {/* HERO */}
      <section className="hero" data-screen-label="01 Home / Hero">
        <div className="hero-headline fade-in">
          <span className="l1">hey, my name is</span>
          <span className="name">Keil</span>
          <span className="l3">but you might be more <em>interested</em> in what i do.</span>
          {/* motion notes */}
          <span className="mnote" style={{ top: "-12px", right: "-6px" }}>
            <span className="num">M-01</span> scroll-reveal · type arrives in three pieces, staggered 120ms.
          </span>
          <span className="mnote" style={{ bottom: "30%", left: "-4px" }}>
            <span className="num">M-02</span> name letter-by-letter on mount, ease-out 600ms.
          </span>
        </div>

        <div className="hero-figure fade-in">
          <div className="hero-cutout hoverable" data-snd-hover="1">
            <img className="cutout-img cutout-img--light" src="assets/keil-portrait.png" alt="Keil Chinchilla, illustrated portrait" />
            <img className="cutout-img cutout-img--dark" src="assets/keil-portrait-dark.png" alt="" aria-hidden="true" />
            <span className="mnote" style={{ top: 14, right: 14, display: undefined }}>
              <span className="num">M-03</span> parallax on cursor · 6px max offset, lerp 0.06.
            </span>
          </div>
          <div className="hero-figure-meta">
            <div className="row"><span>[ designer ]</span><b>Keil&nbsp;Chinchilla</b></div>
            <div className="row"><span>[ based ]</span><b>TGU, HONDURAS</b></div>
            <div className="row"><span></span><b>OPEN TO RELOCATE · EUR | LATAM.</b></div>
            <div className="row"><span>[ since ]</span><b>5+ years shipping</b></div>
          </div>
        </div>

        <div className="hero-foot">
          <span><Brk breath>[ 00 ]</Brk> &nbsp;Index online · last updated 2026.05.14</span>
          <span className="scrollcue">scroll to read <span className="arrow">↓</span></span>
        </div>
      </section>

      {/* PROJECTS INDEX */}
      <section className="idx" data-screen-label="01 Home / Index">
        <SectionLabel num="// 01" label="Selected Work" right={`${PROJECTS.length} entries · scroll or click`} />

        <div className="idx-filter mono">
          <button className="hoverable" data-active={filter === "all"} onClick={() => {Sound.click();setFilter("all");}} data-snd-hover="1">all</button>
          <span style={{flex: 1}}></span>
          <button className="hoverable" data-active={grouped} onClick={() => {Sound.click();setGrouped(g => !g);}} data-snd-hover="1">
            {grouped ? "[·] group by year" : "[ ] group by year"}
          </button>
        </div>

        {(() => {
          if (!grouped) {
            return filtered.map((p) => <ProjectRow key={p.slug} p={p}
              openId={openId} setOpenId={setOpenId}
              setActivePreview={setActivePreview}
              isTouch={isTouch} tapStage={tapStage} setTapStage={setTapStage}
              go={go} />);
          }
          const byYear = {};
          filtered.forEach(p => { (byYear[p.year] = byYear[p.year] || []).push(p); });
          const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));
          return years.map(y => (
            <React.Fragment key={y}>
              <div className="idx-year">
                <span>// {y}</span>
                <span className="rule"></span>
                <span className="count">{byYear[y].length} entr{byYear[y].length === 1 ? "y" : "ies"}</span>
              </div>
              {byYear[y].map(p => <ProjectRow key={p.slug} p={p}
                openId={openId} setOpenId={setOpenId}
                setActivePreview={setActivePreview}
                isTouch={isTouch} tapStage={tapStage} setTapStage={setTapStage}
                go={go} />)}
            </React.Fragment>
          ));
        })()}

        <div className="section-label" style={{ paddingTop: 28 }}>
          <span className="bk mono">{`{`}</span>
          <span className="mono">end of index · {filtered.length} of {PROJECTS.length} shown</span>
          <span className="bk mono">{`}`}</span>
          <span className="rule"></span>
          <span className="mono">archive opens 2026 ↗</span>
        </div>
      </section>

      <Footer go={go} />

      <PreviewDeck
        active={activePreview}
        project={PROJECTS.find(p => p.slug === activePreview)}
        cursorRef={cursorRef}
        deals={activePreview ? dealFor(activePreview) : (dealRef.current.deals || [])}
        isTouch={isTouch}
        go={go}
        onDismiss={dismissPreview}
      />
    </div>);

}

function PreviewDeck({ active, project, cursorRef, deals, isTouch, go, onDismiss }) {
  // CRITICAL: rendered via portal directly into <body> so no ancestor's
  // `transform` (page-enter animation, etc.) can corrupt this element's
  // position: fixed coordinate space. That was the bug, cards landed
  // hundreds of px off because the deck was nested inside a transformed
  // .page-enter wrapper that became the containing block.
  const cards = (project?.previews || [null, null, null]).slice(0, 3);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    // Mobile/touch mode: anchor stays at viewport center via CSS, no cursor tracking.
    if (isTouch) {
      const el = anchorRef.current;
      if (el) el.style.transform = "";
      return;
    }
    let raf;
    let stop = false;
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
    <div className={"preview-deck" + (isTouch ? " mobile" : "") + (isTouch && active ? " active" : "")} aria-hidden="true">
      {isTouch && active ? (
        <div
          className="preview-scrim"
          onClick={(e) => {
            e.stopPropagation();
            Sound.click();
            onDismiss && onDismiss();
          }}
        ></div>
      ) : null}
      <div ref={anchorRef} className="preview-anchor">
        {cards.map((c, i) => {
          const d = deals[i] || { dx: 0, dy: 0, rot: 0 };
          const style = {
            "--dx":  (active ? d.dx  : 0) + "px",
            "--dy":  (active ? d.dy  : 0) + "px",
            "--rot": d.rot + "deg",
            transitionDelay: (active ? i * 60 : (2 - i) * 50) + "ms",
          };
          return (
            <div key={i} className={"preview-card" + (active ? " in" : "")} style={style}>
              {c && typeof c === "object" && c.img ? (
                <img className="preview-img" src={c.img} alt={c.label || ""} draggable="false" />
              ) : (
                <span className="center">{(typeof c === "string" ? c : c && c.label) || "preview"}</span>
              )}
              <span className="lbl">
                <b>{project ? (project.short || project.name) : ""}</b>
                <span>0{i + 1}/03</span>
              </span>
            </div>
          );
        })}
        {isTouch && active && project ? (
          <button
            className="preview-open"
            onClick={(e) => { e.stopPropagation(); Sound.click(); go("case", project.slug); }}>
            <span className="name">{project.name}</span>
            <span className="cta"><span className="arrow">→</span> Open case study</span>
          </button>
        ) : null}
      </div>
    </div>
  );
  return ReactDOM.createPortal(node, document.body);
}

window.Home = Home;
window.PROJECTS = PROJECTS;

function ProjectRow({ p, openId, setOpenId, setActivePreview, isTouch, tapStage, setTapStage, go }) {
  return (
    <div
      className="idx-row hoverable"
      data-open={openId === p.slug}
      onMouseEnter={() => {
        if (isTouch) return;
        setOpenId(p.slug);
        setActivePreview(p.slug);
      }}
      onMouseLeave={() => {
        if (isTouch) return;
        setOpenId((prev) => prev === p.slug ? null : prev);
        setActivePreview((prev) => prev === p.slug ? null : prev);
      }}
      onClick={() => {
        Sound.click();
        if (isTouch) {
          if (tapStage === p.slug) {
            go("case", p.slug);
            return;
          }
          setTapStage(p.slug);
          setOpenId(p.slug);
          setActivePreview(p.slug);
          return;
        }
        go("case", p.slug);
      }}
      data-snd-hover="1">
      <span className="num">
        <span className="bk">[</span> {p.n}{p.lab ? <span style={{ color: "var(--accent)" }}>·L</span> : ""} <span className="bk">]</span>
      </span>
      <span className="title">{p.name}</span>
      <span className="tag">── {p.tag}</span>
      <span className="year">── {p.year}</span>
      <span className="arrow">→</span>

      <div className="idx-expand">
        <span className="empty"></span>
        <span className="desc">
          {p.desc}
          <span className="meta">{p.meta}</span>
        </span>
        <span className="thumb" data-label={p.thumb}></span>
      </div>
    </div>
  );
}
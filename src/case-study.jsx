/* eslint-disable */
// Case study page, content-agnostic template
// Renders MiskitApp (full content) and demos Voxally as the reusable template

// ── Section primitives (reusable) ────────────────────────────
function CSCover({ meta, title, tagline, year, role, context }) {
  return (
    <section className="cs-cover" id="cover" data-screen-label="Case / Cover">
      <div className="top">
        <span><Brk breath>{`{`}</Brk> case study · {meta.n}</span>
        <span>filed under · <b>{meta.tags}</b></span>
        <span>last viewed · today</span>
      </div>
      <h1 className="title fade-in">
        {title}
        <span className="small">{tagline}</span>
      </h1>
      <div className="bot">
        <span><Brk>[ role ]</Brk> &nbsp;{role}</span>
        <span><Brk>[ year ]</Brk> &nbsp;{year}</span>
        <span><Brk>[ context ]</Brk> &nbsp;{context}</span>
        <span className="mono">scroll ↓</span>
      </div>
      <span className="mnote" style={{top: 80, right: 30, display: undefined}}>
        <span className="num">M-04</span> title letters arrive in three waves over 1.4s; <br/>then a 600ms beat of stillness before the next section.
      </span>
    </section>
  );
}

function CSBody({ num, name, h2, children, id }) {
  return (
    <section className="cs-section" id={id} data-screen-label={`Case / ${name}`}>
      <aside className="side fade-in">
        <span className="num">// {num}</span>
        <span className="name">{name}</span>
      </aside>
      <div className="fade-in">
        {h2 ? <h2 className="cs-h2">{h2}</h2> : null}
        <div className="cs-body">{children}</div>
      </div>
    </section>
  );
}

function CSPull({ children, who, translation, photo, photoCaption }) {
  return (
    <section className={"cs-pull" + (photo ? " has-photo" : "")} data-screen-label="Case / Pull quote">
      <div className="shell" style={{padding: 0}}>
        <div className="pull-inner">
          <div className="pull-text">
            <blockquote className="fade-in">
              <span className="qm">“</span>{children}<span className="qm">”</span>
            </blockquote>
            <div className="cite fade-in">
              <span className="who">{who}</span>
            </div>
            {translation ? <div className="translation fade-in">{translation}</div> : null}
          </div>
          {photo ? (
            <figure className="pull-photo fade-in">
              <span className="corner tl">[ portrait ]</span>
              <span className="corner br">{photoCaption || "portrait.png"}</span>
              <img src={photo} alt={who || ""} loading="lazy" />
            </figure>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CSFullbleed({ id, label, title, climax, caption, motion, children, video, poster, aspect, fit }) {
  return (
    <section className={"cs-fullbleed" + (climax ? " climax" : "")} id={id} data-screen-label={`Case / ${label || "Visual"}`}>
      <div className={"frame fade-in" + (video ? " has-video" : "")} style={aspect ? { aspectRatio: aspect } : undefined}>
        <span className="corner tl">[ {label || "FIG"} ]</span>
        <span className="corner tr">~~ ~~ ~~</span>
        <span className="corner bl">{caption?.code || "01.png"}</span>
        <span className="corner br">{caption?.dim || "1284 × 2778"}</span>
        {video ? (
          <video
            className="cs-video"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            poster={poster || undefined}
            style={fit ? { objectFit: fit } : undefined}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <div className="center">
            <span>full bleed placeholder</span>
            <b>{title}</b>
          </div>
        )}
        {children}
        {motion ? <span className="mnote" style={{top: 50, left: 50, display: undefined}}>{motion}</span> : null}
      </div>
      {caption?.text ? (
        <div className="caption">
          <span className="label">{caption.text}</span>
          <span>{caption.right || "·"}</span>
        </div>
      ) : null}
    </section>
  );
}

function CSPair({ id, panels }) {
  return (
    <section className="cs-pair" id={id} data-screen-label="Case / Side-by-side">
      {panels.map((p, i) => (
        <div key={i} className={"panel fade-in" + (p.img ? " has-shot" : "")}>
          <span className="label">[ {p.label} ]</span>
          <div style={{position: "absolute", bottom: 12, right: 12, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", zIndex: 2}}>{p.code}</div>
          {p.img ? (
            <img className="cs-shot" src={p.img} alt={p.title} loading="lazy" />
          ) : (
            <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)"}}>
              <span>placeholder</span>
              <b style={{color: "var(--ink-2)", fontWeight: 500, fontSize: 14}}>{p.title}</b>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

// Before / After diptych. Different vibe than CSPair, labeled, compared.
function CSDiptych({ id, label, title, summary, before, after }) {
  return (
    <section className="cs-diptych" id={id} data-screen-label={`Case / Diptych · ${label}`}>
      {(label || title) ? (
        <div className="cs-diptych-head fade-in">
          <span className="lbl">[ {label} ]</span>
          {title ? <h3 className="ttl">{title}</h3> : null}
          {summary ? <p className="sum">{summary}</p> : null}
        </div>
      ) : null}
      <div className="cs-diptych-grid">
        <div className={"panel fade-in" + (before.img ? " has-shot" : "")} data-state="before">
          <span className="stamp">[ BEFORE ]</span>
          {before.img ? (
            <img className="cs-shot" src={before.img} alt={before.title} loading="lazy" />
          ) : (
            <div className="center">
              <span>placeholder</span>
              <b>{before.title}</b>
              {before.note ? <span className="note">{before.note}</span> : null}
            </div>
          )}
          {before.img && (before.title || before.note) ? (
            <span className="shotnote">
              {before.title ? <b>{before.title}</b> : null}
              {before.note ? <em>{before.note}</em> : null}
            </span>
          ) : null}
        </div>
        <div className={"panel fade-in" + (after.img ? " has-shot" : "")} data-state="after">
          <span className="stamp">[ AFTER ]</span>
          {after.img ? (
            <img className="cs-shot" src={after.img} alt={after.title} loading="lazy" style={after.fit ? { objectFit: "cover", objectPosition: after.fit } : undefined} />
          ) : (
            <div className="center">
              <span>placeholder</span>
              <b>{after.title}</b>
              {after.note ? <span className="note">{after.note}</span> : null}
            </div>
          )}
          {after.img && (after.title || after.note) ? (
            <span className="shotnote">
              {after.title ? <b>{after.title}</b> : null}
              {after.note ? <em>{after.note}</em> : null}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// Horizontal sequence of screens (e.g. SLPCP consent flow, 3-4 steps).
// Pass `screens` (array of {img, cap, note}) to render a scrollable row of real
// device screenshots with arrows between them, instead of the device + text steps.
function CSSequence({ id, label, title, summary, steps, device, deviceCaption, screens }) {
  if (screens && screens.length) {
    return (
      <section className="cs-sequence" id={id} data-screen-label={`Case / Sequence · ${label}`}>
        {(label || title) ? (
          <div className="cs-diptych-head fade-in">
            <span className="lbl">[ {label} ]</span>
            {title ? <h3 className="ttl">{title}</h3> : null}
            {summary ? <p className="sum">{summary}</p> : null}
          </div>
        ) : null}
        <div className={"cs-screengrid cols-" + Math.min(screens.length, 3)}>
          {screens.map((s, i) => (
            <figure className="cs-screengrid-shot fade-in" key={i}>
              <div className="frame">
                <span className="step">[ {String(i + 1).padStart(2, "0")} ]</span>
                <img src={s.img} alt={s.cap || `Screen ${i + 1}`} loading="lazy" />
              </div>
              <figcaption>
                <b>{s.cap}</b>
                {s.note ? <span>{s.note}</span> : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }
  return (
    <section className="cs-sequence" id={id} data-screen-label={`Case / Sequence · ${label}`}>
      {(label || title) ? (
        <div className="cs-diptych-head fade-in">
          <span className="lbl">[ {label} ]</span>
          {title ? <h3 className="ttl">{title}</h3> : null}
          {summary ? <p className="sum">{summary}</p> : null}
        </div>
      ) : null}
      <div className={"cs-sequence-body" + (device ? " has-device" : "")}>
        {device ? (
          <figure className="cs-sequence-device fade-in">
            <span className="corner tl">[ entry point ]</span>
            <span className="corner br">{deviceCaption || "slpcp.png"}</span>
            <img src={device} alt={title || "SLPCP entry point"} loading="lazy" />
          </figure>
        ) : null}
        <div className="cs-sequence-row">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="panel fade-in">
                <span className="step">[ Step {String(i + 1).padStart(2, "0")} ]</span>
                <div className="center">
                  <b>{s.title}</b>
                  {s.note ? <span className="note">{s.note}</span> : null}
                </div>
              </div>
              {i < steps.length - 1 ? <span className="arrow mono">→</span> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

// Asset row, store icons, email templates, things that aren't full-bleed but earn a row.
function CSAssetRow({ id, label, title, summary, items }) {
  return (
    <section className="cs-assetrow" id={id} data-screen-label={`Case / Assets · ${label}`}>
      {(label || title) ? (
        <div className="cs-diptych-head fade-in">
          <span className="lbl">[ {label} ]</span>
          {title ? <h3 className="ttl">{title}</h3> : null}
          {summary ? <p className="sum">{summary}</p> : null}
        </div>
      ) : null}
      <div className="cs-assetrow-grid">
        {items.map((it, i) => (
          <div key={i} className={"panel fade-in panel-" + (it.kind || "default") + (it.img ? " has-shot" : "")}>
            <span className="kind">[ {it.kind || "asset"} ]</span>
            {it.img ? (
              <img className="cs-asset-img" src={it.img} alt={it.title} loading="lazy" />
            ) : (
              <div className="center">
                <b>{it.title}</b>
                {it.note ? <span className="note">{it.note}</span> : null}
              </div>
            )}
            {it.img ? (
              <span className="asset-cap">
                <b>{it.title}</b>
                {it.note ? <span>{it.note}</span> : null}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

// Marketing strip: real App Store / Play screenshots, shown as a shipped-product set.
function CSScreens({ id, label, title, summary, shots }) {
  return (
    <section className="cs-screens" id={id} data-screen-label={`Case / Shipped · ${label}`}>
      {(label || title) ? (
        <div className="cs-diptych-head fade-in">
          <span className="lbl">[ {label} ]</span>
          {title ? <h3 className="ttl">{title}</h3> : null}
          {summary ? <p className="sum">{summary}</p> : null}
        </div>
      ) : null}
      <div className="cs-screens-row">
        {shots.map((s, i) => (
          <figure key={i} className="cs-screens-card fade-in">
            <img src={s.img} alt={s.alt || ""} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}

// Two real PDF documents, embedded side by side (e.g. quote PDF, v1 vs v2).
function CSPdfPair({ id, label, title, summary, docs }) {
  return (
    <section className="cs-pdfpair" id={id} data-screen-label={`Case / Diptych · ${label}`}>
      {(label || title) ? (
        <div className="cs-diptych-head fade-in">
          <span className="lbl">[ {label} ]</span>
          {title ? <h3 className="ttl">{title}</h3> : null}
          {summary ? <p className="sum">{summary}</p> : null}
        </div>
      ) : null}
      <div className="cs-pdfpair-grid">
        {docs.map((d, i) => (
          <figure key={i} className="cs-pdf-card fade-in">
            <span className="stamp">[ {d.stamp} ]</span>
            <div className="paper">
              <iframe
                src={d.pdf + "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&view=Fit"}
                title={d.title}
                loading="lazy"
              ></iframe>
              <a className="open" href={d.pdf} target="_blank" rel="noopener noreferrer">Open PDF ↗</a>
            </div>
            <figcaption className="shotnote">
              <b>{d.title}</b>
              <em>{d.note}</em>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CSGrid3({ id, panels }) {
  return (
    <section className="cs-grid-3" id={id} data-screen-label="Case / Question types">
      {panels.map((p, i) => (
        <div key={i} className={"panel fade-in" + (p.img ? " has-shot" : "")}>
          <span className="label">[ Q.{i + 1} ]</span>
          {p.img ? (
            <img className="cs-shot" src={p.img} alt={p.title} loading="lazy" />
          ) : (
            <div style={{position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", padding: 30, textAlign: "center"}}>
              <span>{p.type}</span>
              <b style={{color: "var(--ink-2)", fontWeight: 500, fontSize: 13}}>{p.title}</b>
            </div>
          )}
          <span className="state">[ <span className="acc">{p.type}</span> ]</span>
        </div>
      ))}
    </section>
  );
}

function CSGallery({ id }) {
  return (
    <section className="cs-gallery-shot" id={id} data-screen-label="Case / Galería">
      <figure className="device fade-in">
        <span className="corner tl">[ FIG.05 ]</span>
        <span className="corner br">05_galeria.png</span>
        <img src="assets/miskitapp-galeria.png" alt="Galería, the story library where unlocked tales are kept" loading="lazy" />
      </figure>
      <div className="aside fade-in">
        <h4 className="cs-h3" style={{marginTop: 0}}>The reward shelf.</h4>
        <p>Completing a chapter drops a traditional Miskito tale into the Galería. Each tile carries its Miskitu title above its Spanish one, the bilingual rule held even at thumbnail scale.</p>
        <ul className="spec">
          <li><span className="k">source</span><span className="v">CIDCA, 1985</span></li>
          <li><span className="k">collection</span><span className="v">Miskitu Kisi Nani</span></li>
          <li><span className="k">at launch</span><span className="v">6 stories</span></li>
          <li><span className="k">reward loop</span><span className="v">unlock, not streak</span></li>
        </ul>
      </div>
    </section>
  );
}

function CSBilingual({ id }) {
  return (
    <section className="cs-story" id={id} data-screen-label="Case / Bilingual story">
      <div className="story-head">
        <figure className="device fade-in">
          <span className="corner tl">[ FIG.06 ]</span>
          <span className="corner br">06_cuento.png</span>
          <img src="assets/miskitapp-story.png" alt="Inside an unlocked story, El Sapo Orgulloso, Miskitu and Spanish side by side" loading="lazy" />
        </figure>
        <div className="intro fade-in">
          <h4 className="cs-h3" style={{marginTop: 0}}>Two languages, visible to each other.</h4>
          <p>Inside an unlocked tale, the Miskitu original runs alongside its Spanish translation, never stripped, never hidden, the layout Scott Woods asked for explicitly. The same page, transcribed:</p>
        </div>
      </div>
      <div className="cs-bilingual">
        <div className="col fade-in">
          <h5><span className="acc">[ MISK ]</span> &nbsp; Miskitu, original</h5>
          <div className="leading">Tilam pirka kum kan, ai aisan pram.</div>
          <p>Tilam pirka kum kan, ai aisan pram. Kan, kan, kati naha tasba ra. Tilam ba kumi pri taim, kumi pri taim, lalka pruna ai aisan kaikbia.</p>
          <p>Tilam ba taim, taim, kati ai upla nani ra wal aisan: <em>“Yang ba pâs lula, yang ba sa.”</em></p>
          <p>Upla nani ba pain laikan; tilam ai aisan ba kaiki sin.</p>
        </div>
        <div className="col fade-in">
          <h5><span className="acc">[ ESP ]</span> &nbsp; Español, traducción</h5>
          <div className="leading">Había una vez un sapo muy orgulloso.</div>
          <p>Había una vez un sapo muy orgulloso. Vivía, vivía, en esta tierra. El sapo, cuando saltaba una vez, cuando saltaba dos, levantaba la cabeza para que su voz se escuchara.</p>
          <p>Cuando el sapo cantaba, cantaba, le decía a su gente: <em>“Yo soy el primero, yo soy.”</em></p>
          <p>La gente lo miraba con paciencia; al sapo le bastaba ser escuchado.</p>
        </div>
      </div>
    </section>
  );
}

function CSNext({ go, next }) {
  // Insert soft wrap opportunities at camelCase boundaries so very long
  // single-token names (e.g. "OnePointPartitions") can wrap gracefully
  // instead of overflowing the container.
  const nameParts = next.name.split(/(?<=[a-z])(?=[A-Z])/);
  return (
    <section className="cs-next hoverable" onClick={() => { Sound.click(); go("case", next.slug); }} data-snd-hover="1">
      <div className="shell" style={{padding: 0}}>
        <div className="lead mono">// next entry, {next.n} of {String(window.PROJECTS.length).padStart(2, "0")}, {next.year}</div>
        <div className="name">
          {nameParts.map((part, i) => (
            <React.Fragment key={i}>{i > 0 ? <wbr /> : null}{part}</React.Fragment>
          ))}
          <span className="arrow">→</span>
        </div>
        <div className="meta">{next.tag}</div>
      </div>
    </section>
  );
}

// ── MiskitApp content ────────────────────────────────────────
function MiskitAppCase({ go, next }) {
  useReveal();
  // Held silence: when the Nuevo Cuento climax enters viewport, drop the pad for ~1.2s.
  React.useEffect(() => {
    const el = document.getElementById("vis-nuevocuento");
    if (!el) return;
    let armed = true;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && armed) { armed = false; Sound.holdSilence(1200); setTimeout(() => { armed = true; }, 8000); }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cs page-enter" data-screen-label="Case / MiskitApp">
      <CSCover
        meta={{ n: "01 / 03", tags: "Mobile · Preservation · Bilingual" }}
        title={<>MiskitApp</>}
        tagline="An interactive platform for learning Miskitu, an endangered indigenous language of Honduras."
        year="2025"
        role="Sole designer & researcher"
        context="Final degree project, UNITEC Honduras"
      />

      <CSBody num="01" name="The problem" id="problem" h2={<>What you can't easily find on the internet you can't easily protect.</>}>
        <p>Miskitu is spoken by roughly <strong>190,000 people</strong> in the Moskitia, a region spanning eastern Honduras and Nicaragua. UNESCO loses an indigenous language every two weeks, and Miskitu is on that trajectory. The few digital tools that exist for it, a community-built dictionary and a Bible translation, haven't been updated since 2021 and don't support structured learning.</p>
        <p>I wanted to design something better. But the more I tried to research the language, the more I realized how invisible it is online.</p>
      </CSBody>

      <CSBody num="02" name="Research" id="research" h2={<>Researching a language that isn't really on the internet.</>}>
        <p>Search "Miskitu dictionary" or "Miskitu online course" and you find almost nothing. The dictionary itself exists, written by Professor Scott Woods and used in Honduran schools, but a dictionary teaches you words, not how to actually speak. There's no Duolingo equivalent, no YouTube curriculum, no Reddit thread breaking down grammar.</p>
        <p>That meant almost everything I learned about the language came from people, not from the internet. Specifically two people: <strong>Wildres Woods</strong>, a Miskito biologist and cultural promoter from the Moskitia, and <strong>Professor Scott Woods</strong>, the author of the dictionary that essentially defines how Miskitu is taught in Honduras. The project lives or dies on those conversations.</p>

        <div style={{marginTop: 50, marginBottom: 10, padding: "28px 32px", border: "1px dashed var(--rule)", maxWidth: "62ch", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase"}}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}>
            <span>// google.com</span>
            <span>q · "miskitu online course"</span>
          </div>
          <div style={{borderTop: "1px dotted var(--rule)", paddingTop: 12, textTransform: "none", letterSpacing: "0.02em", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5}}>
            <div>0 dedicated courses.</div>
            <div>1 community dictionary, last updated 2021.</div>
            <div>1 Bible translation.</div>
            <div>2 YouTube videos, neither a curriculum.</div>
          </div>
        </div>
      </CSBody>

      <CSBody num="03" name="Reframe" id="reframe" h2={<>A Duolingo clone wasn't going to work.</>}>
        <p>What drew me to Duolingo as a reference was its gamification. Streaks, points, unlockable content, bite-sized lessons; it's the most successful language learning loop ever built, and ignoring it would have been a mistake.</p>
        <p>But early in the project, Wildres said something that reframed the entire design problem:</p>
      </CSBody>

      <CSPull
        who="Wildres Woods, biologist & cultural promoter, Moskitia"
        photo="assets/wildres.png"
        photoCaption="wildres_woods.png"
        translation="“All of our history in Honduras has been oral, mostly through stories, stories about animals. That's how you learn to speak Miskitu.”"
      >
        Toda nuestra historia en Honduras ha sido de manera oral, principalmente a través de cuentos, cuentos que tienen que ver con animales. Así es como se aprende a hablar el miskito.
      </CSPull>

      <CSBody num="03b" name="Reframe (cont.)" id="reframe2">
        <p>Miskitu was never meant to be learned through written drills. It's transmitted through oral storytelling, mostly animal fables passed between generations. A pure Duolingo clone would teach the vocabulary and miss the language.</p>
        <p>The real design problem became: <em>how do you keep what makes Duolingo work, the gamified loop that gets people to come back, but build it around oral tradition instead of around streaks and points?</em></p>
      </CSBody>

      <CSBody num="04" name="Research / sources" id="sources" h2={<>Three places to listen, instead of one to read.</>}>
        <p>With almost no online material to work from, the research happened in three places: two long conversations with Miskitu experts, a comparative teardown of <strong>Duolingo</strong> and <strong>Miyotl</strong> (a Mexican app for indigenous Nahuatl), and a focus group with five people who had real personal or professional reasons to want to learn the language.</p>

        <h3 className="cs-h3">What Wildres taught me about culture.</h3>
        <p>Wildres Woods grew up in the Moskitia and works in conservation biology in the region. A few things she corrected me on immediately: the language is properly written <em>"Miskitu,"</em> not <em>"Miskito"</em> (Miskito refers to the people). The alphabet doesn't use C, Ñ, Q, or O; words written with C or Q in Spanish become K in Miskitu. And most importantly, the language is taught through animal stories, fables passed between generations, not through structured grammar lessons.</p>
        <p>This is the insight that ended up driving the entire reward system in the app.</p>

        <h3 className="cs-h3">What Scott taught me about pedagogy.</h3>
        <p>Wildres connected me to Professor Scott Woods, who wrote the canonical Miskitu dictionary used in Honduran schools. His teaching method is progressive: <strong>words first, then phrases, then sentences.</strong> He recommended against starting with grammar, that any Miskitu content be presented bilingually with Spanish alongside it, and that traditional stories be included as part of the learning, not as decoration.</p>
        <p>Three concrete design decisions came directly from that conversation: lesson hierarchy, bilingual story layout in the Galería, and the decision to use story unlocks as the core reward loop instead of points or streaks.</p>

        <h3 className="cs-h3">What the focus group confirmed.</h3>
        <p>I tested the prototype with five participants: a shark conservationist working in the Moskitia, a nutritionist who runs medical brigades there, and three people interested in indigenous language preservation more broadly. The clearest signal was about <em>tone.</em> Multiple participants compared the aesthetic to Animal Crossing unprompted, and described the app as <em>calming</em> rather than pressuring.</p>
      </CSBody>

      <CSPull
        who="Adriana Padilla, focus group participant"
        translation="“I loved it. I felt like I was playing a game and I could spend hours on it learning. I like the vibe, it reminds me of Animal Crossing.”"
      >
        Me encantó, sentí que estaba jugando un juego y podría pasar horas en él aprendiendo. Me gusta la vibe, me recuerda a Animal Crossing también.
      </CSPull>

      <CSBody num="04b" name="Tone" id="tone">
        <p>That comparison mattered. The other reference loop works through urgency (the streak, the owl, loss aversion). The Miskitu project couldn't take that approach without breaking the cultural mood. The unprompted Animal Crossing reaction told me the aesthetic was doing what I needed it to do: <em>feel inviting and unhurried, the way oral storytelling itself is unhurried.</em></p>
      </CSBody>

      <CSBody num="05" name="Design / 01" id="design-1" h2={<>A visual system built from preservation, not invention.</>}>
        <p>The strongest single design decision in the project is one I almost don't want to call a design decision: <strong>I chose not to commission or generate new illustrations.</strong> The entry screen uses an 1894 engraving from <em>Popular Science Monthly</em>, "Indian hut at mouth of Rama River," in the public domain. The story covers in the Galería are from <em>Cuentos Misquitos, Miskitu Kisi Nani</em>, a 1985 storybook published by CIDCA, a Nicaraguan research institution, as part of their project <em>El rescate de la tradición oral y la narrativa miskita.</em></p>
        <p>Using these materials wasn't a shortcut, it was the point. A 1894 ethnographic engraving, a 1985 community preservation effort, and a 2025 digital revitalization sit in a single visual line, and the case for the project is essentially: <em>this work has been ongoing for over a century, and digital is just the next medium for it.</em></p>
        <p>The palette (cream and olive) and the typography (a heavy display sans paired with restraint everywhere else) were chosen to do as little as possible. The voseo Spanish ("Descubrí," "Aprendé," "Accedé") is a small but deliberate localization choice; this is a Central American product for Central American users, not neutral pan-Latin Spanish.</p>
      </CSBody>

      <CSFullbleed
        id="vis-inicio"
        label="FIG.01"
        title="Inicio, entry screen with 1894 engraving"
        video="assets/MiskitApp_VideoHerov2.mp4"
        caption={{ text: "Inicio · entry screen", code: "01_inicio.mp4", dim: "1284 × 2778", right: "Source: PSM 1894 · Public domain" }}
        motion={<><span className="num">M-05</span> on enter: 1.04→1.00 scale, 1.2s ease-out; <br/>image breathes ±1px every 8s while in view.</>}
      />

      <CSBody num="05b" name="Design / 02" id="design-2" h2={<>Lessons, in the order Miskitu is actually taught.</>}>
        <p>The six lessons (<em>Saludos y Presentaciones, Familia, El Cuerpo Humano, La Naturaleza y El Clima, Salud y Emociones, Vida Cotidiana</em>) follow Scott Woods's recommended sequencing for new Miskitu learners. Each lesson contains chapters, and each chapter contains questions that progress from single words to phrases to full sentences, exactly the order Woods uses in his classroom teaching.</p>
        <p>This is the part of the project that most directly inherits the gamified-learning structure, and that's deliberate. The lesson-chapter-question hierarchy is one of the things gamified apps actually get right; it's familiar to anyone who's touched a language app. There was no value in being clever here.</p>
      </CSBody>

      <CSPair
        id="vis-lessons"
        panels={[
          { label: "FIG.02 · A", title: "Onboarding, bienvenido", code: "02a_inicio.png", img: "assets/miskitapp-onboarding.png" },
          { label: "FIG.02 · B", title: "Home, six lessons grid", code: "02b_home.png", img: "assets/miskitapp-home.png" },
        ]}
      />

      <CSBody num="05c" name="Design / 03" id="design-3" h2={<>Five question types, one inline-correction model.</>}>
        <p>The prototype includes five question types, each doing different pedagogical work:</p>
        <ul style={{paddingLeft: "1.2em"}}>
          <li><strong>Image selection</strong>, which image represents <em>Naksa</em>? for vocabulary recognition.</li>
          <li><strong>Complete the phrase</strong>, <em>___ sna</em>, for grammar pattern recognition.</li>
          <li><strong>Listen and select</strong>, for pronunciation, the gap a printed dictionary literally cannot fill.</li>
          <li><strong>Bilingual word matching</strong>, for active translation.</li>
          <li><strong>Order phrases</strong>, for sentence construction.</li>
        </ul>
        <p>The decision worth naming is the inline correction model: when you get an answer right, the screen confirms with a short bilingual explanation (<em>"Yamni sna significa estoy bien"</em>). The dictionary teaches you words; the inline correction teaches you what the words mean <em>in context.</em></p>
      </CSBody>

      <CSGrid3
        id="vis-questions"
        panels={[
          { type: "Image selection", title: "Naksa", img: "assets/miskitapp-q-image.png" },
          { type: "Complete the phrase", title: "___ sna", img: "assets/miskitapp-q-phrase.png" },
          { type: "Word matching", title: "Empareja", img: "assets/miskitapp-q-match.png" },
        ]}
      />

      {/* CLIMAX */}
      <CSBody num="05d" name="Design / 04 · turning point" id="design-4" h2={<>Stories instead of streaks.</>}>
        <p>This is the design move the whole project is built around.</p>
        <p>The reference loop works on urgency: streaks, daily reminders, the mascot, the dread of losing your XP. Extraordinarily effective, and the obvious thing to clone. But the source material refused it. Miskito oral tradition is unhurried, conversational, intergenerational. A streak-based product would have pulled against everything the cultural research surfaced.</p>
        <p><em>So the reward isn't a streak. It's a story.</em></p>
        <p>When you complete a chapter, you unlock a traditional Miskito tale from CIDCA's 1985 collection: <em>El Sapo Orgulloso, La fábula del Tigre y el Conejo, El Relámpago y el Trueno.</em> The stories live in your Galería, and you can return to them anytime. The gamification loop, complete a unit, get a reward, want to come back for more, is still there. <strong>What's changed is what counts as a reward: the cultural content the app is trying to preserve. The reward IS the mission.</strong></p>
      </CSBody>

      <CSFullbleed
        id="vis-nuevocuento"
        label="FIG.04 · CLIMAX"
        title="Nuevo Cuento, reward unlock screen"
        climax
        video="assets/miskitapp-nuevocuento.mp4"
        caption={{ text: "Nuevo Cuento · reward unlock", code: "04_nuevocuento.mp4", dim: "1284 × 2778", right: "The turning point of the case." }}
        motion={<><span className="num">M-06</span> 1.2s held silence before entry; sub-bass drone fades in at -32dB over 3s; <br/>title arrives one letter at a time across 900ms. Reduced-motion: cross-fade only.</>}
      />

      <CSBody num="05e" name="Design / 05" id="design-5" h2={<>Three smaller decisions worth naming.</>}>
        <p><strong>Guest mode.</strong> The Inicio screen offers "Iniciar Sesión," "Registrarse," and "Continuar como Invitado." Email access is uneven in the Moskitia; gating the app behind an account would have excluded part of the audience the project is supposedly for. Guest mode means anyone with a phone can use the app, full stop.</p>
        <p><strong>Bilingual story layout.</strong> Inside each unlocked story, Miskitu sits on the left, Spanish on the right, side by side. Scott Woods recommended this explicitly: never strip the Miskitu, never hide the translation. The two languages should be visible to each other on every page.</p>
        <p><strong>Audio everywhere.</strong> Every question type that involves a Miskitu word includes audio playback. Miskitu has phonemes Spanish speakers haven't been trained to hear, and visual transcription alone won't teach pronunciation. The audio module is currently a placeholder; in the real version, recordings would be done with native speakers from the Moskitia.</p>
      </CSBody>

      <CSGallery id="vis-galeria" />

      <CSBilingual id="vis-bilingual" />

      <CSBody num="06" name="Reflection" id="reflection" h2={<>Honest accounting before this becomes a real product.</>}>
        <p><strong>The testing was with learners, not native speakers.</strong> Five Spanish-speaking adults with reasons to learn Miskitu, not five Miskito speakers from the Moskitia. That's a meaningful limitation. The app is designed for, and validated by, non-native learners. Whether a native Miskitu speaker, especially one strengthening their own language rather than acquiring it, would experience this app the same way is genuinely an open question, and the most important thing to test next.</p>
        <p><strong>The audio is a placeholder.</strong> Every "Escucha el audio" screen currently uses stand-in audio. A real version needs recordings with native speakers from the Moskitia, ideally with regional variation. Both collaborators offered to continue; the practical next step is going back to them to record.</p>
        <p><strong>The story library is finite.</strong> The Galería currently draws from CIDCA's 1985 collection of six stories. That's a starting point, not a corpus. A sustainable version of this app would partner with community elders to record and add new stories over time, the way the language itself is transmitted: as a living tradition, not a closed archive.</p>
        <p><strong>The Miskitu-first version doesn't exist yet.</strong> Everything assumes the user is coming from Spanish. The harder and arguably more important version of this app would invert that: a Miskitu-first interface for young people in the Moskitia who already speak the language at home but lose it in Spanish-medium schools. That's not a redesign, it's a different product, and it's probably where the real preservation impact would happen.</p>
        <p><strong>The prototype is a prototype.</strong> A Figma file with a clickable flow, not an app you can download. The budget and roadmap for a real build are documented in the thesis. Turning this into a published iOS or web app would need either institutional backing (UNESCO, an NGO working in the Moskitia, the Honduran Ministry of Education) or open-source contributors.</p>
        <p>The hope is that this prototype is useful enough to invite that next step from someone better positioned to take it.</p>
      </CSBody>

      <CSBody num="07" name="Credits" id="credits" h2={<>Four people and one institution.</>}>
        <p style={{fontFamily: "var(--f-serif)", fontStyle: "italic"}}>This project would not exist without them.</p>
        <p><strong>Wildres Woods</strong>, biologist and cultural promoter from the Moskitia, was the first voice in the research. Her insistence that Miskitu is learned through animal stories, not through drills, reframed the entire design problem.</p>
        <p><strong>Professor Scott Woods</strong>, author of the canonical Miskitu dictionary, spent an hour walking me through his pedagogy and validating the lesson structure. Every decision about progression and presentation came directly from that conversation.</p>
        <p><strong>Adriana Padilla, Ángela Chávez, Ana Paola Arita, and Daniela Valerio</strong> participated in the focus group and saw the prototype early. Their unprompted comparison to Animal Crossing was the aesthetic validation the project needed.</p>
        <p><strong>The Centro de Investigaciones y Documentación de la Costa Atlántica (CIDCA)</strong>, and the anonymous community archivist who uploaded their 1985 storybook to Internet Archive, made it possible to source existing cultural materials instead of creating new ones.</p>
        <p><strong>Lic. Diana Echeverría</strong>, my thesis advisor, kept the project grounded in research and pushed me toward collaborators when I wanted to work alone.</p>
      </CSBody>

      <CSNext go={go} next={next} />

      <Footer go={go} />
    </div>
  );
}

// ── Voxally: real case study, before / after diptychs, decision-I-lost pull
function VoxallyCase({ go, next }) {
  useReveal();
  return (
    <div className="cs page-enter" data-screen-label="Case / Voxally">
      <CSCover
        meta={{ n: "02 / 03", tags: "Mobile · Accessibility · Marketplace" }}
        title={<>Voxally</>}
        tagline="A marketplace connecting Deaf creators with interpreters for ASL, BASL, captioning, and voiceover."
        year="2026"
        role="UX/UI designer (Acklen Avenue)"
        context="Shipped, live on the App Store and Google Play"
      />

      <CSFullbleed
        id="vis-hero"
        label="FIG.00 · Hero"
        video="assets/voxally-hero.mp4"
        aspect="1488 / 1080"
        fit="cover"
        caption={{ code: "voxally_hero.mp4", dim: "1488 × 1080", text: "Product hero, as it runs in the store listing.", right: "00:37 · loop" }}
      />

      <CSBody num="01" name="Opening" id="opening" h2={<>What Voxally does.</>}>
        <p>Deaf creators make a lot of video content, but reaching hearing audiences usually means depending on auto-captions that miss tone, nuance, and signed-language register entirely. Voxally turns that into a marketplace: creators upload videos and pay for human captioning and voiceovers; interpreters in ASL and BASL pick up jobs and get paid per minute of work delivered.</p>
        <p>The product launched on both app stores in mid-2026.</p>

        <h3 className="cs-h3">How this project was actually built.</h3>
        <p>Voxally was built fast and built unusually. Darrell, the client and CEO, had already scaffolded a working version of the front-end with Claude Code before the Acklen team came on. When the project kicked off, Monique, the dev team, and I all started at the same time, around a codebase that already existed. <strong>The product was live in code from day one.</strong></p>
        <p>That meant my role wasn't "design the app from scratch." The app was being shipped in real time, by a founder who'd built the first version with AI and a dev team taking it the rest of the way. My role was to be the person reviewing what was being shipped, catching what a fast-moving team would have missed, redesigning the flows that were broken, and authoring the new screens that hadn't been touched yet. <em>Less authorship, more stewardship.</em> Less Figma-first, more "open the live build and tell me what's wrong with it."</p>
        <p>This is a working pattern I think is going to become much more common, and Voxally was a useful place to learn how to do it well.</p>
      </CSBody>

      <CSScreens
        id="vis-shipped"
        label="FIG.00 · Shipped"
        title="Live on the App Store and Google Play."
        summary="The store listing, as it ships today, marketing screens pulled straight from the released build."
        shots={[
          { img: "assets/voxally-ipad-01.png", alt: "Voxally, sign language interpreted by real humans, creator dashboard on iPad" },
          { img: "assets/voxally-ipad-02.png", alt: "Upload a video, get voiceover, captions and transcript" },
          { img: "assets/voxally-ipad-03.png", alt: "Break the communication barrier, interpreter watching a vertical source video" },
          { img: "assets/voxally-ipad-04.png", alt: "Interpret on your schedule, completed job with payout" },
        ]}
      />

      <CSBody num="02" name="What I changed" id="changed" h2={<>Four contributions, reviewed on real devices.</>}>
        <p>The shipping rhythm at Voxally was daily standups, weekly refinements, and Trello cards moving fast. There was rarely time to mock something in Figma, get feedback, iterate, then hand off. Most of my contribution looked like this: <em>review the live build on a real device, find the thing that didn't work, write up the fix with the reasoning in a Trello card or a Slack thread, and either hand it back to the devs or design the replacement screen if it needed one.</em></p>
        <p>A lot of that review happened in BrowserStack and TestFlight rather than in Figma. I tested every shipped build across iOS and Android phones, plus iPad, because the app needed to work for interpreters using whatever device they had on hand. Most of the issues were caught by actually using the build on a real device, not by reviewing screens in isolation. <strong>Tooling matters: a flow that looks fine in a Figma frame can be broken the moment it meets a real screen rotation, a real keyboard, or a real screenshot of a vertical video.</strong></p>
      </CSBody>

      <CSDiptych
        id="vis-vertical"
        label="FIG.01 · Contribution 01"
        title="The vertical video interpreter screen."
        summary="Interpreters need to see the source. A 40% smaller video means worse work, longer sessions, and lower-quality output for the people paying for the service."
        before={{ img: "assets/voxally-vertical-before.png", title: "Letterboxed vertical video", note: "Black bars on both sides; the source compressed into a thin strip." }}
        after={{  img: "assets/voxally-vertical-after.png", title: "Orientation-aware layout",   note: "Vertical sources play full-height; controls move into a slimmer column." }}
      />

      <CSBody num="02a" name="What I changed (cont.)" id="changed-2">
        <p>The recording screen, where interpreters record their voiceovers while watching the source video, was forcing every video into a landscape frame regardless of how the creator had shot it. I redesigned the screen to detect orientation and adapt. <em>This is the kind of thing that's easy to miss when you're scaffolding a UI in code without testing it on real content from real users. Exactly the kind of thing a designer is in the room to catch.</em></p>
      </CSBody>

      <CSDiptych
        id="vis-icons"
        label="FIG.02 · Contribution 02"
        title="Replacing emoji UI with a proper icon system."
        summary="Emoji render differently across iOS, Android, and OS versions. The same screen looked like three different products depending on the phone."
        before={{ img: "assets/voxally-emoji-navbar.png", title: "Emoji navbar + notifications", note: "Inconsistent across platforms; the brand fragmented per device." }}
        after={{  img: "assets/voxally-icon-navbar.png", title: "Custom icon system",            note: "Sourced and adapted so iOS and Android users see the same interface." }}
      />

      <CSBody num="02b" name="What I changed (cont.)" id="changed-3" h2={<>The SLPCP consent flow.</>}>
        <p>The Sign Language Preservation Contributor Project was a feature Darrell wanted in place for a later phase: collecting consent from creators to allow their videos to be used as training data for ASL/BASL AI models. The flow had to be <strong>unambiguous</strong> (creators needed to clearly understand what they were agreeing to), <strong>respectful</strong> (the language of preservation matters here, not just compliance), and <strong>skippable</strong> (creators who didn't want to participate had to be able to use the app normally).</p>
        <p>I designed it as a multi-step bottom sheet. The consent step is the only one with a "deny" path; the others are informational. The flow lives outside the main job creation experience so creators who don't engage with it never see it again. <em>This was the most "designer-from-scratch" piece of the project. Everything else was reviewing or fixing; this was a net-new flow.</em></p>
      </CSBody>

      <CSSequence
        id="vis-slpcp"
        label="FIG.03 · SLPCP consent flow"
        title="A multi-step bottom sheet, skippable by design."
        screens={[
          { img: "assets/voxally-slpcp-01.png", cap: "Entry point", note: "Profile, opt-in lives next to the account, never forced." },
          { img: "assets/voxally-slpcp-02.png", cap: "Info + consent", note: "What's shared, what isn't. The only 'deny' path." },
          { img: "assets/voxally-slpcp-03.png", cap: "Consent mode", note: "Per-job opt-in, or default-on. The creator picks." },
          { img: "assets/voxally-slpcp-04.png", cap: "Confirmation", note: "What just happened, and how to change it later." },
          { img: "assets/voxally-slpcp-05.png", cap: "Enrolled state", note: "Profile reflects the new status at a glance." },
          { img: "assets/voxally-slpcp.png", cap: "Back in the flow", note: "The per-job toggle, surfaced during job creation." },
        ]}
      />

      <CSBody num="02c" name="What I changed (cont.)" id="changed-4" h2={<>Store assets and email templates.</>}>
        <p>Two smaller pieces of craft that still mattered for launch. The Voxally logo arrived to me as a PNG, which is a non-starter for app store submission. I vectorized it, then adapted it for the technical requirements of each store: Apple's three-layer Icon Composer format (which renders with the glass material effect on iOS 18+), and Google Play's adaptive icon system.</p>
        <p>I also designed the transactional email templates: forgot password, email verification, and job rejection. <em>Trust signals matter most at the moments when users are giving you something.</em> Badly-designed transactional email is one of the fastest ways to lose that trust.</p>
      </CSBody>

      <CSAssetRow
        id="vis-assets"
        label="FIG.04 · Launch assets"
        title="Icons and adaptive store variants."
        items={[
          { kind: "iOS · dark",  img: "assets/voxally-icon-dark.png",  title: "Apple, 3-layer",  note: "Icon Composer, glass material on iOS 18+." },
          { kind: "iOS · light", img: "assets/voxally-icon-white.png", title: "Light variant",   note: "Same mark, light material." },
          { kind: "Android",     img: "assets/voxally-icon-android.png", title: "Adaptive icon",  note: "Foreground / background layers, Play Store." },
        ]}
      />

      <CSPull who="Darrell Utley, founder / CEO, Voxally">
        Pitch is an auditory concept. Asking a Deaf creator to select "Lower Pitch" vs "Higher Pitch" requires them to have an acoustic frame of reference they may not have. For Deaf creators, masculine/feminine is the clearest available shorthand for the kind of voice they're requesting.
      </CSPull>

      <CSBody num="03" name="A decision I lost" id="lost" h2={<>A decision I lost.</>}>
        <p>Voxally needed a way for creators to specify what kind of voice they wanted for a voiceover, and for interpreters to indicate what kind of voice they had. The first version of the app used <em>Masculine</em>, <em>Feminine</em>, and <em>No Preference.</em></p>
        <p>My first instinct was to make this more inclusive. The categorization is really about pitch and timbre, not gender, and the gendered framing assumes a binary that doesn't map cleanly to real human voices or real interpreter preferences. I proposed switching to non-gendered descriptors: <em>Lower Pitch, Higher Pitch, Mid Range, No Preference.</em> The same functional groupings, without the assumption.</p>
        <p>Darrell pushed back on accessibility grounds, and his point was strong. (See pulled quote above.)</p>
        <p>This was a real conflict between two values I care about: <strong>inclusive language that doesn't impose gender on voice, and accessibility that meets users where they actually are.</strong> Both are correct. They were in tension on this specific feature.</p>
        <p>I proposed a compromise: keep gendered options on the creator side (where Darrell's point applies), use inclusive pitch-based language on the interpreter side (where interpreters can self-identify by voice characteristics they actually have access to), and map between them in the backend.</p>
        <p>Darrell's final call was to keep gendered language on both sides for now, and revisit during beta testing once we had real feedback from interpreters about what felt right to them. His reasoning was practical: <em>launch with the clearer mental model, gather data from actual users, decide later.</em> The risk of confusing creators at launch was higher than the risk of needing to update copy in a future release.</p>
        <p><strong>I disagreed, and I shipped what he asked for.</strong></p>
        <p>I think this is worth including in the case study for two reasons. First, because Darrell was right that accessibility for the actual audience has to win over abstract inclusivity. I learned something from being wrong about which value applied. Second, because being overruled by a client isn't a failure mode in senior consulting work; it's the job. The decisions that matter most are ones where smart people disagree, and the discipline is being able to make your case clearly, lose, and ship the better version of someone else's decision without resenting it.</p>
        <p>The right time to revisit gendered voice categorization on Voxally isn't in a portfolio essay. It's in the beta data, with real interpreters and real creators saying what works for them.</p>
      </CSBody>

      <CSBody num="04" name="Reflection" id="reflection" h2={<>Three things I'm taking from Voxally.</>}>
        <p><strong>The UI could have been more distinctive.</strong> The app works, it shipped, and the things I changed measurably improved how it feels to use. But if I'd had more time and a different starting point, I would have pushed for a stronger visual identity. The current product feels functionally correct and visually basic. That's defensible for a launch ("ship something legible, iterate from there") but it's not what I'd call the work of someone with strong taste. Voxally needed to ship; that's what it did. Distinctiveness is a v2 problem.</p>
        <p><strong>The working pattern is the real story.</strong> Going in, I thought a project where the CEO had pre-built the front-end with Claude Code would feel constraining. It didn't. It felt grounding, actually, to see a client this close to the code, and to be in a working rhythm where decisions could happen in a Slack thread and ship the same day. The trade-off is less room for the slow Figma-first design work I love. The reward is that the work that does happen, ships. I came out of this project thinking that <em>"AI-scaffolded codebase with a designer brought in to steward"</em> is going to become a much more common shape for product teams, and the senior design skill on those teams isn't authorship. It's reviewing fast, articulating clearly, and choosing the right hill to die on.</p>
        <p><strong>The lost argument mattered more than the wins.</strong> The vertical video fix, the icon system, the SLPCP flow: these are the things hiring managers will scan for. But the gender-versus-pitch debate is the thing I'll remember about this project. Not because I was right or wrong, but because it taught me to check whether my instinct for inclusive design is actually serving the user I'm designing for, or whether it's serving a more abstract idea of what inclusive design should look like. Sometimes those are the same. Sometimes they aren't. The discipline is being able to tell which one is happening.</p>
      </CSBody>

      <CSBody num="05" name="Credits" id="credits" h2={<>A team effort.</>}>
        <p><strong>Darrell Utley</strong>, founder and CEO, was the closest-to-the-code client I've worked with. The willingness to ship the first version himself, sit in daily standups with the team, and make calls in real time (including the ones I disagreed with) is what made the project move as fast as it did.</p>
        <p><strong>Monique Stigter</strong> (BA) and <strong>Heath Nichols</strong> (AM) kept the project organized while the rest of us moved through it. The reason the Trello board functioned at all was them.</p>
        <p><strong>Paul Somarriba, Mynor Funes, and Andrés Flores</strong> built the app. Most of the changes in this case study are things they shipped from a Slack message or a Trello card; the speed at which design feedback turned into working features on real devices was entirely on their craft.</p>
        <p><strong>Acklen Avenue</strong> brought me onto the project.</p>
      </CSBody>

      <CSNext go={go} next={next} />
      <Footer go={go} />
    </div>
  );
}

// ── OnePointPartitions: B2B quoting tool, two phases, AA shipped product
function OnePointCase({ go, next }) {
  useReveal();
  return (
    <div className="cs page-enter" data-screen-label="Case / OnePointPartitions">
      <CSCover
        meta={{ n: "03 / 03", tags: "Web · Quoting · 3D · Mobile-first · B2B" }}
        title={<span style={{fontSize: "clamp(56px, 11vw, 168px)", letterSpacing: "-0.045em", display: "block"}}>OnePoint<br/>Partitions</span>}
        tagline="A quoting tool for commercial bathroom partitions, with a real-time 3D configurator that works on a phone."
        year="2024 – 2025"
        role="UX/UI Designer (Phase 1), Design Lead (Phase 2)"
        context="Shipped, region-locked to the US (screenshots in lieu of a live link)"
      />

      <CSBody num="01" name="Opening" id="opening" h2={<>What OnePointPartitions does.</>}>
        <p>OnePointPartitions sells commercial bathroom partitions: the walls, doors, and hardware that make up restroom stalls in offices, schools, restaurants, and public buildings. Their customers are mostly contractors, facility managers, and distributors who need accurate quotes fast.</p>
        <p>The company had an existing quoting tool on their website. It worked, but it looked like it had been built a decade earlier and maintained by a single developer. The flow was long, the interface was cluttered, and <strong>62% of users were trying to use it on their phones</strong>, where it barely held together.</p>
        <p>Acklen Avenue was brought in to rebuild the tool from scratch. Not a reskin. A full redesign: new information architecture, new design system, new front-end, and a real-time 3D layout builder that would let customers see their partition configurations before requesting a quote.</p>

        <h3 className="cs-h3">Two phases.</h3>
        <p>The project had two distinct phases under separate contracts.</p>
        <p><strong>Phase 1</strong> was the quoting tool itself: the customer-facing flow where users select a layout, enter stall dimensions, preview their configuration in 2D and 3D, choose materials and colors, and submit their information to receive a branded PDF quote. This is what most of this case study covers.</p>
        <p><strong>Phase 2</strong> was the order management system, and it was bigger than Phase 1 in every way. Where the quoting tool is a single linear flow for one type of user, order management had to serve two audiences (customers and internal sales reps) across a much wider set of tasks.</p>
        <p>The core of Phase 2 was a management table where sales reps could track every order by status, with color-coded indicators showing where each order sat in the pipeline. From there, the system branched into a series of specialized forms: delivery information (addresses, unload methods, delivery contacts, installation locations), billing information (with Braintree credit card verification and a separate wire transfer path where customers could upload receipts for manual confirmation), and a drawing review process where sales reps could submit partition drawings for customer approval and signature.</p>
        <p>Sales reps could also create orders from scratch, from templates, from blank forms, or for specific needs like hardware-only or payment-only orders. The range of entry points and form types made the information architecture significantly more complex than Phase 1.</p>
        <p>I was design lead for all of it. Fernando had left Acklen between phases, so the design direction was mine to own. <em>The foundation we built together in Phase 1 (the design system, the component library, the interaction patterns) is what made it possible to scale into Phase 2 without starting over.</em></p>

        <div style={{marginTop: 50, marginBottom: 10, padding: "28px 32px", border: "1px dashed var(--rule)", maxWidth: "62ch", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase"}}>
          <div style={{display: "flex", justifyContent: "space-between", marginBottom: 10}}>
            <span>// note · access</span>
            <span>region-locked · US only</span>
          </div>
          <div style={{borderTop: "1px dotted var(--rule)", paddingTop: 12, textTransform: "none", letterSpacing: "0.02em", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5}}>
            <div>Live product is region-locked to the United States.</div>
            <div>Visitors outside the US see an error screen.</div>
            <div>Screenshots provided in lieu of a live link; production captured via VPN.</div>
          </div>
        </div>

        <h3 className="cs-h3">How I fit in.</h3>
        <p>I joined the project from day one alongside <strong>Fernando Guevara</strong>, another UX/UI designer at Acklen. Together, we ran the discovery workshops with the client, audited the existing tool, and built the new design system, style guide, and full set of Figma flows from scratch.</p>
        <p>The work was traditional in the best sense: discovery, audit, information architecture, wireframes, UI design, prototyping, handoff. The dev team built while we designed, and we iterated based on what worked and what broke on real devices. <em>The UX audits of the existing website were primarily my work, and they shaped the structural decisions that carried through both phases.</em></p>
      </CSBody>

      <CSBody num="02" name="What I designed" id="designed" h2={<>Three contributions worth calling out.</>}>
        <p>Everything visual in the new quoting tool came out of the design process Fernando and I ran. The original site had a design language, but it was inconsistent and dated. We kept the brand colors (blue primary, with a secondary palette) and rebuilt everything else: typography, spacing, component library, iconography, interaction patterns. We used <strong>ShadCN/UI</strong> as the component foundation, built on <strong>Tailwind CSS</strong>, which kept the design-to-code translation clean and fast.</p>
      </CSBody>

      <CSDiptych
        id="vis-flow"
        label="FIG.01 · Contribution 01"
        title="The quoting flow, simplified."
        summary="The original tool asked users to wade through a long sequence of screens with unclear hierarchy. For a user base that skews older and less tech-savvy, every unnecessary click was a potential dropout."
        before={{ img: "assets/opp-flow-old.png", title: "Old tool, long sequence", note: "Cluttered screens, unclear hierarchy." }}
        after={{  img: "assets/opp-flow-new.png", title: "New tool, linear flow",   note: "Top stepper, one decision per screen." }}
      />

      <CSBody num="02a" name="What I designed (cont.)" id="designed-2">
        <p>We restructured the flow into a clear linear progression: <em>select toilets, choose a layout, enter dimensions, review a summary, then submit.</em> The stepper at the top of the screen shows where you are and what's left. Each step does one thing. The goal was to make the tool feel closer to filling out a short form than to navigating a complex application.</p>
        <p>We also added an alternative path for customers who already had architectural drawings: a manual upload flow where they could select materials, enter their information, and upload their plans directly. This acknowledged a reality the old tool ignored, that many commercial buyers already know exactly what they need and just want a price.</p>
      </CSBody>

      <CSSequence
        id="vis-mobile-shots"
        label="FIG.02 · The quoting flow, on mobile"
        title="Select, dimension, preview — one screen at a time."
        summary="The stepper keeps the whole flow visible; each step is small enough to finish without losing context. 62% of users went through this on a phone."
        screens={[
          { img: "assets/opp-mobile-01.png", cap: "Select stalls", note: "Count first. The flow opens where the old tool buried it." },
          { img: "assets/opp-mobile-02.png", cap: "2D dimensions", note: "Tap a stall, set widths, depths, door openings." },
          { img: "assets/opp-mobile-03.png", cap: "3D view",       note: "Same configuration, perspective read. Toggle without losing place." },
        ]}
      />

      <CSBody num="02b" name="What I designed (cont.)" id="designed-3" h2={<>Mobile-first, 3D included.</>}>
        <p>With 62% of traffic coming from mobile devices, the tool had to work on a phone, not just technically function, but <em>actually feel good to use.</em> This was my specific responsibility on the project.</p>
        <p>The hardest part was the dimension entry step. On desktop, you have room for a 3D canvas, input fields, and labels all on one screen. On a phone, that same information has to be sequenced and layered carefully. The 2D and 3D views needed to be toggleable without losing context, and the input controls for stall widths, depths, door swings, and ADA compliance had to be reachable with a thumb.</p>
        <p>The material and color selection screens were also challenging on mobile. Partition materials (powder coated steel, laminate, solid plastic, phenolic black core, stainless steel) each have their own color palettes, some with dozens of options. On desktop, this is a grid. On mobile, it needs to scroll cleanly without feeling like a paint store exploded on your screen.</p>
        <p><strong>I'm proud of how the mobile flow turned out.</strong> It reads as a real product, not a shrunken desktop app.</p>
      </CSBody>

      <CSFullbleed
        id="vis-mobile"
        label="FIG.03 · Mobile, in motion"
        video="assets/opp-mobile.mp4"
        poster="assets/opp-mobile-poster.png"
        aspect="1560 / 1080"
        fit="cover"
        caption={{ code: "opp_mobile.mp4", dim: "1560 × 1080", text: "The mobile quoting flow, recorded on device. Stepper up top, one decision per screen.", right: "loop" }}
      />

      <CSBody num="02c" name="What I designed (cont.)" id="designed-4" h2={<>The PDF quote.</>}>
        <p>This was the most interesting design problem on the project. The quoting tool isn't just a configurator; <strong>it produces a deliverable.</strong> After a customer submits their information, the system generates a branded PDF that serves as the actual quote: room layouts in 2D and 3D (captured as screenshots from the live canvas), material specifications, pricing by room, and customer details. The PDF is emailed to the customer and to the sales team simultaneously.</p>
        <p>Designing for print from a web tool is a specific kind of challenge. The UI for the web experience and the layout for the PDF share data but serve different purposes. The web flow is interactive, progressive, designed to guide a user through decisions one at a time. The PDF is a reference document, something a contractor prints and carries to a job site or forwards to a client. It needs to be legible, branded, and dense with information without feeling chaotic.</p>
        <p>The first version of the PDF matched the clean, modern look of the web tool. It worked, and it looked professional. In Phase 2, the client requested a redesign of the PDF to match a different visual direction: denser, more information-forward, closer in spirit to a wholesale catalog than a tech product. <em>We delivered what they asked for. The result was functional, but I preferred the original.</em></p>
      </CSBody>

      <CSPdfPair
        id="vis-pdf"
        label="FIG.04 · PDF quote, two directions"
        title="Same data, two visual languages."
        summary="Same compiled 2D/3D views, room details, materials, and pricing; two different ideas of what a quote document should feel like. The real documents, embedded below."
        docs={[
          { pdf: "assets/opp-pdf-v1.pdf", stamp: "v1", title: "Clean and modern", note: "Matched the web tool. Breathable, branded, legible." },
          { pdf: "assets/opp-pdf-v2.pdf", stamp: "v2", title: "Denser catalog spirit", note: "Client direction in Phase 2. Information-forward, closer to wholesale." },
        ]}
      />

      <CSBody num="03" name="Phase 2" id="phase2" h2={<>Order management, scaled from the same system.</>}>
        <p>Phase 2 was where the design system Fernando and I built in Phase 1 had to earn its keep. The order management table is the center of the experience for sales reps: a single view of every order, color-coded by status, with the entire pipeline visible at a glance. From any row, a rep can branch into a delivery form, a billing form, a drawing review, or the customer-facing approval flow.</p>
        <p>The challenge wasn't any single screen. It was making the dozens of screens feel like one product. The component library held up: forms, tables, status indicators, modals, and bottom sheets all carried through from Phase 1 without redesign. Where Phase 2 needed new patterns (the multi-path order creation flow, the drawing approval signatures, the wire transfer receipt upload), they slotted in as extensions of the system, not exceptions to it.</p>
      </CSBody>

      <CSFullbleed
        id="vis-phase2"
        label="FIG.05 · Order management, in motion"
        video="assets/opp-admin.mp4"
        poster="assets/opp-admin-poster.png"
        aspect="1776 / 1080"
        fit="cover"
        caption={{ code: "opp_orders.mp4", dim: "1776 × 1080", text: "The Phase 2 orders table: every order by status, color-coded across the pipeline.", right: "loop" }}
      />

      <CSSequence
        id="vis-phase2-shots"
        label="FIG.05 · Order portal, on mobile"
        title="The same system, in a customer's hand."
        screens={[
          { img: "assets/opp-portal-01.png", cap: "Order summary",  note: "Cart total, sales tax, every step to complete." },
          { img: "assets/opp-portal-02.png", cap: "Color selection", note: "Up to two colors per order, swatches and all." },
          { img: "assets/opp-portal-03.png", cap: "Payment",         note: "Card, PayPal, or check. Tax-exempt path included." },
        ]}
      />

      <CSBody num="04" name="Picking your battles" id="battles" h2={<>Picking your battles.</>}>
        <p>The client had strong opinions about the interface. In particular, he wanted prominent <strong>red call-to-action buttons</strong> throughout the quoting flow: on continue buttons, checkout steps, and key decision points.</p>
        <p>On a product whose entire brand palette is blue, a red button reads as a warning or a destructive action. In most interface conventions, red means <em>stop, delete, or cancel.</em> For a continue or checkout action, it works against the user's instincts.</p>
        <p>I pushed back on this multiple times, explaining the convention and proposing alternatives that would be equally prominent without the negative connotation: a high-contrast blue, a larger button size, a different position on the page. The client's concern was valid (older, less tech-savvy users need clear, unmissable CTAs), but the solution he wanted conflicted with the design language we had built.</p>
        <p><strong>Some of those battles I won. Others I didn't. The ones I lost, I shipped.</strong></p>
        <p>This is a pattern I've seen across consulting work: the client's instinct about their users is often correct even when their proposed solution is wrong. He knew his customers would miss a subtle button. He was right about the problem. We disagreed about the fix. When you're the contractor, you make your case, present alternatives, and then execute whatever gets decided. <em>The work is better when you fight for it, but the relationship is better when you know when to stop fighting.</em></p>
      </CSBody>

      <CSBody num="05" name="Reflection" id="reflection" h2={<>Three things I'm taking from OnePointPartitions.</>}>
        <p><strong>Every industry has interface problems worth solving.</strong> Before this project, I would not have guessed that bathroom partition configuration was a design problem anyone was thinking about. It is. The customers are real, the constraints are specific (ADA compliance, material properties, stall dimension standards, freight weight calculations), and the stakes are commercial. A contractor who can't get an accurate quote on their phone loses time and possibly the job. The domain is unglamorous, but the design work is the same work: <em>understand the user, reduce friction, make the information legible, get out of the way.</em></p>
        <p><strong>The 3D configurator taught me to direct without owning.</strong> The Three.js layout builder was primarily an engineering effort. I didn't write the code for the 2D/3D rendering, the camera controls, or the screenshot generation. What I did was direct the visual decisions: colors, angles, label placement, how the models should read at different viewport sizes. This is a mode of design contribution that doesn't produce Figma frames, but it shapes what the user sees. Learning to contribute meaningfully to a technically complex feature without needing to own the implementation was a skill I used again on Voxally and will keep using.</p>
        <p><strong>Going from co-designer to design lead changed how I think about ownership.</strong> In Phase 1, Fernando and I shared every decision. The design system, the flows, the client presentations: all of it was collaborative. When he left and I took over Phase 2 alone, the scope was bigger, the complexity was higher, and there was no one to check my thinking against. I had to trust the foundation we built and make calls faster. The transition taught me that design leadership on a consulting project isn't about having better taste than your teammate. <em>It's about being willing to hold the entire system in your head, make a decision when the team needs one, and stand behind it when the client pushes back.</em> Phase 2 was where I learned that, and I've carried it into every project since.</p>
      </CSBody>

      <CSBody num="06" name="Credits" id="credits" h2={<>A team effort at Acklen Avenue.</>}>
        <p><strong>Fernando Guevara</strong> designed Phase 1 alongside me. The discovery workshops, the style guide, the initial Figma flows: none of that was solo work, and the foundation we built together is what carried the product through both phases.</p>
        <p><strong>The development team, scrum master, and BA at Acklen</strong> brought the design to life across a complex stack (React, Three.js, NestJS, PostgreSQL, AWS) and kept the build moving through two contract phases.</p>
        <p><strong>Acklen Avenue</strong> brought me onto the project and gave me the room to grow from co-designer to design lead between phases.</p>
      </CSBody>

      <CSNext go={go} next={next} />
      <Footer go={go} />
    </div>
  );
}

// ── Router by slug ───────────────────────────────────────────
// Section catalog for the floating rail. Order matches DOM in each case.
const CASE_SECTIONS = {
  miskitapp: [
    { id: "cover",       label: "Cover" },
    { id: "problem",     label: "The problem" },
    { id: "research",    label: "Research" },
    { id: "reframe",     label: "Reframe" },
    { id: "sources",     label: "Sources" },
    { id: "tone",        label: "Tone" },
    { id: "design-1",    label: "System" },
    { id: "vis-inicio",  label: "Fig.01 · Inicio" },
    { id: "design-2",    label: "Lessons" },
    { id: "vis-lessons", label: "Fig.02 · Lessons" },
    { id: "design-3",    label: "Question types" },
    { id: "vis-questions", label: "Fig.03 · Q-types" },
    { id: "design-4",    label: "Stories, not streaks" },
    { id: "vis-nuevocuento", label: "Fig.04 · Nuevo Cuento" },
    { id: "design-5",    label: "Smaller decisions" },
    { id: "vis-galeria", label: "Galería" },
    { id: "vis-bilingual", label: "Bilingual story" },
    { id: "reflection",  label: "Reflection" },
    { id: "credits",     label: "Credits" },
  ],
  voxally: [
    { id: "cover",       label: "Cover" },
    { id: "opening",     label: "Opening" },
    { id: "changed",     label: "What I changed" },
    { id: "vis-vertical", label: "Fig.01 · Vertical video" },
    { id: "changed-2",   label: "Vertical (cont.)" },
    { id: "vis-icons",   label: "Fig.02 · Icon system" },
    { id: "changed-3",   label: "SLPCP consent" },
    { id: "vis-slpcp",   label: "Fig.03 · Consent flow" },
    { id: "changed-4",   label: "Store + emails" },
    { id: "vis-assets",  label: "Fig.04 · Assets" },
    { id: "lost",        label: "A decision I lost" },
    { id: "reflection",  label: "Reflection" },
    { id: "credits",     label: "Credits" },
  ],
  onepoint: [
    { id: "cover",          label: "Cover" },
    { id: "opening",        label: "Opening" },
    { id: "designed",       label: "What I designed" },
    { id: "vis-flow",       label: "Fig.01 · Old vs new" },
    { id: "designed-2",     label: "Flow (cont.)" },
    { id: "vis-mobile-shots", label: "Fig.02 · Mobile flow" },
    { id: "designed-3",     label: "Mobile-first" },
    { id: "vis-mobile",     label: "Fig.03 · In motion" },
    { id: "designed-4",     label: "PDF quote" },
    { id: "vis-pdf",        label: "Fig.04 · PDF v1 / v2" },
    { id: "phase2",         label: "Phase 2" },
    { id: "vis-phase2",     label: "Fig.05 · Order mgmt" },
    { id: "battles",        label: "Picking your battles" },
    { id: "reflection",     label: "Reflection" },
    { id: "credits",        label: "Credits" },
  ],
};
window.CASE_SECTIONS = CASE_SECTIONS;

function CaseRail({ slug }) {
  const sections = CASE_SECTIONS[slug];
  const [active, setActive] = React.useState(sections ? sections[0].id : null);
  const [open, setOpen] = React.useState(false); // mobile slide-out panel

  React.useEffect(() => {
    if (!sections) return;
    let mounted = true;
    let raf = null;
    // Scroll-based active section: pick the section whose top has crossed
    // the focus line (30% from viewport top) most recently. Smoother and
    // more deterministic than IntersectionObserver with overlapping bands.
    const compute = () => {
      raf = null;
      const focus = window.innerHeight * 0.30;
      let bestId = sections[0].id;
      let chosenDelta = Infinity;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        const delta = focus - top; // >=0 once the section header has scrolled past focus
        if (delta >= 0 && delta < chosenDelta) {
          chosenDelta = delta;
          bestId = s.id;
        }
      }
      setActive(bestId);
    };
    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(compute);
    };
    const tm = setTimeout(() => {
      if (!mounted) return;
      compute();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }, 80);
    return () => {
      mounted = false;
      clearTimeout(tm);
      if (raf != null) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slug]);

  if (!sections) return null;
  return (
    <React.Fragment>
      {/* Mobile-only peeking tab to open the case map. */}
      <button
        className="case-rail-tab hoverable"
        aria-label={open ? "Close case map" : "Open case map"}
        data-open={open}
        onClick={() => { Sound.click(); setOpen((o) => !o); }}
        data-snd-hover="1">
        <span className="case-rail-tab-label">{open ? "close" : "map"}</span>
      </button>

      {open ? (
        <div
          className="case-rail-scrim"
          onClick={() => { Sound.click(); setOpen(false); }}
          aria-hidden="true"></div>
      ) : null}

      <nav className={"case-rail" + (open ? " open" : "")} data-open={open}
           aria-label="Case study sections">
        <div className="head">
          <span className="lead">// case map</span>
          <span>{slug}</span>
        </div>
        {sections.map((s, i) => (
          <a key={s.id}
             href={"#" + s.id}
             className="item hoverable"
             data-active={active === s.id}
             data-snd-hover="1"
             onClick={(e) => { e.preventDefault(); Sound.click(); smoothToId(s.id); setOpen(false); }}>
            <span className="dot"></span>
            <span className="num">{String(i).padStart(2, "0")}</span>
            <span className="name">{s.label}</span>
          </a>
        ))}
      </nav>
    </React.Fragment>
  );
}

// ── Router by slug ───────────────────────────────────────────
function CaseStudy({ go, slug }) {
  const list = window.PROJECTS;
  const idx = Math.max(0, list.findIndex(p => p.slug === slug));
  const next = list[(idx + 1) % list.length];

  React.useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // ── Harp accent layer ─────────────────────────────────────
  // Hover over titles / headings = arpeggio.
  // Hover over a pull-quote = sustained single note.
  // Each heading gets a unique seed (its DOM order) so the page becomes
  // a quiet melodic phrase as the visitor scrolls.
  React.useEffect(() => {
    const SEL_ARP = ".cs .cs-h2, .cs .cs-h3, .cs-cover .title, .cs-diptych-head .ttl, .cs-section h3";
    const SEL_SUSTAIN = ".cs-pull blockquote";
    const recent = new WeakMap();
    const throttle = 700; // ms per element

    const onOver = (e) => {
      const arpEl = e.target.closest(SEL_ARP);
      const susEl = e.target.closest(SEL_SUSTAIN);
      const el = arpEl || susEl;
      if (!el) return;
      const t = recent.get(el) || 0;
      const now = performance.now();
      if (now - t < throttle) return;
      recent.set(el, now);
      // assign a stable seed by DOM index among matching siblings
      const all = Array.from(document.querySelectorAll(SEL_ARP + ", " + SEL_SUSTAIN));
      const seed = all.indexOf(el);
      Sound.harp({ seed: seed >= 0 ? seed : 0, sustained: !!susEl });
    };
    const root = document.querySelector(".cs");
    if (!root) return;
    root.addEventListener("mouseover", onOver, true);
    return () => root.removeEventListener("mouseover", onOver, true);
  }, [slug]);

  if (slug === "miskitapp") return <><CaseRail slug={slug} /><MiskitAppCase go={go} next={next} /></>;
  if (slug === "voxally")   return <><CaseRail slug={slug} /><VoxallyCase   go={go} next={next} /></>;
  if (slug === "onepoint")  return <><CaseRail slug={slug} /><OnePointCase  go={go} next={next} /></>;

  // Generic stub for the other projects, uses the same template.
  const p = list[idx];
  return (
    <div className="cs page-enter" data-screen-label={`Case / ${p?.name || "Project"}`}>
      <CSCover
        meta={{ n: `${p.n} / ${String(window.PROJECTS.length).padStart(2, "0")}`, tags: p.tag }}
        title={<>{p.name}</>}
        tagline={p.desc}
        year={p.year}
        role={p.meta.split(" · ")[0]}
        context={p.meta.split(" · ").slice(1).join(" · ")}
      />
      <CSBody num="01" name="Note" h2={<>Case study coming soon.</>}>
        <p>This entry is reserved. The case study template above renders the MiskitApp story in full. The same template will hold this project's content, dropped in section by section, when the case study ships.</p>
        <p>The system is content-agnostic, sections can be added, removed, or reordered without breaking the layout. Reusable visual components: <em>full-bleed, side-by-side, three-up, gallery, pull-quote, bilingual two-column.</em></p>
      </CSBody>
      <CSNext go={go} next={next} />
      <Footer go={go} />
    </div>
  );
}

window.CaseStudy = CaseStudy;

/* =====================================================================
   VOLUME — EmpresaPage.jsx
   A dedicated page per company (TT&T · Locarmais · Oderço): the story told
   in numbered beats, a metadata strip, and quick access to the projects
   that ran through it. Inverted cover + manga panels. Chronological nav:
   older company on the left, newer on the right (no wraparound).
   ===================================================================== */
function EmpresaQuick({ company, onProject }) {
  if (!company.related || !company.related.length) return null;
  return (
    <div className="emp-quick">
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>Projetos por aqui</Brush>
        <span className="kicker">acesso rápido</span>
      </div>
      <div className="eq-grid">
        {company.related.map((id) => {
          const p = projById(id);
          if (!p) return null;
          return (
            <button type="button" className="eq-card" key={id} onClick={() => onProject(p)}>
              <span className="eq-art"><MangaPlate /></span>
              <span className="eq-meta">
                <span className="eq-cat">{p.domain}</span>
                <span className="eq-title">{p.title}</span>
                <span className="eq-go">{p.chapterId ? "Ler capítulo" : "Ver projeto"} <span className="arr" aria-hidden="true">→</span></span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmpresaPage({ company, companies, onHome, onEmpresa, onProject, onContact }) {
  useEffect(() => { window.scrollTo(0, 0); }, [company.id]);
  const idx = companies.findIndex((c) => c.id === company.id);
  const older = companies[idx - 1];   // earlier in time (left)
  const newer = companies[idx + 1];   // later in time (right)
  const projCount = (company.related && company.related.length) ? company.related.length : null;
  return (
    <main className="empresa viewcut" key={company.id}>
      <div className="chapter-back">
        <a className="back" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr">←</span> Voltar ao volume
        </a>
        <span className="cap">Empresa · {VOL}</span>
      </div>

      <section className="emp-cover">
        <div className="cover-tone"></div>
        <span className="emp-cover-sl" aria-hidden="true"></span>
        <div className="shell emp-cover-shell">
          <div className="emp-cover-copy">
            <div className="emp-k">
              {company.atual ? <span className="emp-now">Empresa atual</span> : <span className="emp-past">Trajetória · cap. {String(idx + 1).padStart(2, "0")}</span>}
            </div>
            <Brush as="h1" className="emp-title">{company.name}</Brush>
            <div className="emp-role">{company.role}</div>
            <p className="emp-blurb">{company.blurb}</p>
          </div>
          <div className="emp-logo" aria-label="Logo da empresa (a preencher)">
            <span className="emp-logo-mark">{company.name}</span>
            <span className="emp-logo-cap">[ logo ]</span>
          </div>
        </div>
        <div className="shell emp-meta">
          <div className="m"><div className="l">Papel</div><div className="v">{company.role}</div></div>
          <div className="m"><div className="l">Período</div><div className="v">{company.period}</div></div>
          <div className="m"><div className="l">Projetos</div><div className="v">{projCount ? String(projCount).padStart(2, "0") : "diversos"}</div></div>
        </div>
      </section>

      <div className="emp-body shell">
        <div className="emp-story">
          {company.story.map((b, i) => (
            <div className="es-beat" key={i} style={{ animationDelay: (i * 90) + "ms" }}>
              <div className="es-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</div>
              <div className="es-body">
                <div className="es-k">{b.k}</div>
                <p className="es-p">{renderPH(b.p)}</p>
              </div>
            </div>
          ))}
        </div>

        <EmpresaQuick company={company} onProject={onProject} />

        <div className="emp-switch">
          <div className="emp-switch-side left">
            {older ? <button type="button" className="emp-navbtn" onClick={() => onEmpresa(older.id)}>
              <span className="ens-k">Antes</span><span className="ens-n"><span className="arr" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span> {older.name}</span>
            </button> : null}
          </div>
          <button type="button" className="btn btn-primary" onClick={onContact}>Fale comigo <span className="arr">→</span></button>
          <div className="emp-switch-side right">
            {newer ? <button type="button" className="emp-navbtn al-r" onClick={() => onEmpresa(newer.id)}>
              <span className="ens-k">Depois</span><span className="ens-n">{newer.name} <span className="arr">→</span></span>
            </button> : null}
          </div>
        </div>
      </div>

      <Colofao onContact={onContact} />
    </main>
  );
}
Object.assign(window, { EmpresaQuick, EmpresaPage });

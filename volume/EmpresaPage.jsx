/* =====================================================================
   VOLUME — EmpresaPage.jsx
   A dedicated page per company (TT&T · Locarmais · Oderço): the story told
   in numbered beats, a metadata strip, and quick access to the projects
   that ran through it. Inverted cover + manga panels. Chronological nav:
   older company on the left, newer on the right (no wraparound).
   ===================================================================== */
/* ---- O que desenvolvi aqui ----------------------------------------
   As habilidades saem da empresa, não de uma lista genérica: cada uma vem
   com onde foi exercida. Painel de mangá numerado, mesma moldura de tinta
   do resto do volume, com a retícula na quina. */
function EmpresaSkills({ company }) {
  if (!company.skills || !company.skills.length) return null;
  return (
    <div className="emp-skills">
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("O que desenvolvi aqui", "What I built up here")}</Brush>
        <span className="kicker">{String(company.skills.length).padStart(2, "0")} {t("frentes", "areas")}</span>
      </div>
      <ul className="esk-grid">
        {company.skills.map((sk, i) => (
          <li className="esk" key={i} style={{ animationDelay: (i * 70) + "ms" }}>
            <span className="esk-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="esk-tone" aria-hidden="true"></span>
            <span className="esk-k">{sk.k}</span>
            <span className="esk-p">{renderPH(sk.p)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- A LINHA DO TEMPO ----------------------------------------------
   As três empresas numa régua só, na ordem em que aconteceram. Antes disso
   a única forma de andar entre elas era o par "Antes/Depois" no pé da
   página, que mostra o vizinho mas não mostra a trajetória. Aqui a pessoa
   vê os três pontos de uma vez e sabe onde está. O ponto cheio é a empresa
   aberta; o anel vermelho é a atual. ---------------------------------- */
function EmpresaLinha({ companies, company, onEmpresa }) {
  return (
    <nav className="emp-linha" aria-label={t("Linha do tempo", "Timeline")}>
      <ol className="el-trilho">
        {companies.map((c) => {
          const aqui = c.id === company.id;
          return (
            <li className={"el-no" + (aqui ? " on" : "") + (c.atual ? " atual" : "")} key={c.id}>
              <button type="button" className="el-btn" onClick={() => { if (!aqui) onEmpresa(c.id); }}
                      aria-current={aqui ? "true" : undefined}
                      disabled={aqui}>
                <span className="el-ano">{c.anos}</span>
                <span className="el-ponto" aria-hidden="true"></span>
                <span className="el-nome">{c.name}</span>
                <span className="el-papel">{c.atual ? t("hoje", "today") : c.role}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---- O BALÃO ---------------------------------------------------------
   A frase que resume o conflito da empresa, num balão de mangá de verdade:
   moldura de tinta, rabicho apontando pra história que vem abaixo. Vem
   ANTES dos beats de propósito, porque é ele que arma o problema que os
   beats resolvem. O rabicho é feito com dois triângulos empilhados (o de
   tinta atrás, o de papel à frente) para que a ponta tenha contorno: um
   triângulo CSS não aceita border. ------------------------------------ */
function EmpresaFala({ company }) {
  if (!company.fala) return null;
  return (
    <figure className="emp-balao">
      <blockquote className="eb-bolha">
        <span className="eb-aspa" aria-hidden="true">「</span>
        <p>{company.fala}</p>
      </blockquote>
      <figcaption className="eb-fonte">
        {company.name} · {company.anos}
      </figcaption>
    </figure>
  );
}

/* seta de nanquim entre um beat e o próximo: haste em curva leve e ponta
   cheia, desenhada e não montada com borda, senão vira ícone de UI */
function SetaBeat() {
  return (
    <svg className="es-seta" viewBox="0 0 44 104" fill="none" aria-hidden="true" focusable="false">
      <path d="M22.5 6 C 14.5 28, 29 46, 21.5 68" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M21 88 L12.4 65.5 L21.2 71 L30 64.5 Z" fill="currentColor" />
    </svg>
  );
}

/* ---- A HISTÓRIA ------------------------------------------------------
   Capítulo, não lista. A página abre com um parágrafo de gancho em corpo
   maior (`abre`), atravessa os atos (`atos`, cada um com título e mais de
   um parágrafo), vira no balão de mangá depois do ato `falaApos`, e fecha
   com uma frase solta em display (`fecha`).

   O que isto substituiu era um `story[]` de blocos de um parágrafo cada,
   numerados: lia como ficha, não como história. Aqui o número continua,
   porque ele é a âncora da seta de nanquim que liga um ato ao próximo, mas
   quem carrega o texto é o parágrafo. ---------------------------------- */
function EmpresaHistoria({ company }) {
  const atos = company.atos || [];
  const virada = typeof company.falaApos === "number" ? company.falaApos : -1;
  return (
    <div className="emp-hist">
      {company.abre ? (
        <p className="eh-abre">{renderPH(company.abre)}</p>
      ) : null}

      {atos.map((a, i) => (
        <React.Fragment key={i}>
          <section className="eh-ato" style={{ animationDelay: (i * 80) + "ms" }}>
            <div className="eh-num">
              <span className="es-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {i < atos.length - 1 ? <SetaBeat /> : null}
            </div>
            <div className="eh-corpo">
              <h2 className="eh-k">{a.k}</h2>
              {a.p.map((par, j) => <p className="eh-p" key={j}>{renderPH(par)}</p>)}
            </div>
          </section>
          {i === virada ? <EmpresaFala company={company} /> : null}
        </React.Fragment>
      ))}

      {company.fecha ? (
        <div className="eh-fecha">
          <p className="ehf-p">{renderPH(company.fecha)}</p>
          <Seal size={38} alt="" />
        </div>
      ) : null}
    </div>
  );
}

function EmpresaQuick({ company, onProject }) {
  if (!company.related || !company.related.length) return null;
  return (
    <div className="emp-quick">
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("Projetos por aqui", "Projects around here")}</Brush>
        <span className="kicker">{t("acesso rápido", "quick access")}</span>
      </div>
      <div className="eq-grid">
        {company.related.map((id) => {
          const p = projById(id);
          if (!p) return null;
          const logo = brandLogo(id);
          const live = p.links && p.links.vercel;
          const opensCase = isCase(p);
          const inner = (
            <>
              <span className="eq-art">
                {logo ? <img className="eq-logo" src={logo} alt={`Logo ${p.title}`} loading="lazy" draggable="false" /> : <MangaPlate label={false} />}
              </span>
              <span className="eq-meta">
                <span className="eq-cat">{p.domain}</span>
                <span className="eq-title">{p.title}</span>
                <span className="eq-go">
                  {opensCase ? t("Ler capítulo", "Read chapter") : live ? t("Ver no ar", "See it live") : t("No volume", "In the volume")}
                  <span className="arr" aria-hidden="true">{opensCase || live ? "→" : ""}</span>
                </span>
              </span>
            </>
          );
          if (opensCase) return <button type="button" className="eq-card" key={id} onClick={() => onProject(p)}>{inner}</button>;
          if (live) return <a className="eq-card" key={id} href={live} target="_blank" rel="noreferrer">{inner}</a>;
          return <span className="eq-card is-flat" key={id}>{inner}</span>;
        })}
      </div>
    </div>
  );
}

function EmpresaPage({ company, companies, onHome, onEmpresa, onProject, onContact, onNav }) {
  useEffect(() => { window.scrollTo(0, 0); }, [company.id]);
  const idx = companies.findIndex((c) => c.id === company.id);
  const older = companies[idx - 1];   // earlier in time (left)
  const newer = companies[idx + 1];   // later in time (right)
  const projCount = (company.related && company.related.length) ? company.related.length : null;
  return (
    <main className="empresa viewcut" key={company.id}>
      <div className="chapter-back">
        <a className="back" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr">←</span> {t("Voltar ao volume", "Back to the volume")}
        </a>
        <span className="cap">{t("Empresa", "Company")} · {VOL}</span>
      </div>

      <section className="emp-cover">
        <div className="cover-tone"></div>
        <span className="emp-cover-sl" aria-hidden="true"></span>
        {company.logoInv || company.logo
          ? <img className="emp-wm" src={company.logoInv || company.logo} alt="" aria-hidden="true" draggable="false" />
          : <span className="emp-wm-txt" aria-hidden="true">{company.name}</span>}
        <div className="shell emp-cover-shell">
          <div className="emp-cover-copy">
            <div className="emp-k">
              {company.atual ? <span className="emp-now">{t("Empresa atual", "Current company")}</span> : <span className="emp-past">{t("Trajetória · cap. ", "Journey · ch. ")}{String(idx + 1).padStart(2, "0")}</span>}
            </div>
            <Brush as="h1" className="emp-title">{company.name}</Brush>
            <div className="emp-role">{company.role}</div>
            <p className="emp-blurb">{company.blurb}</p>
          </div>
          <div className="emp-logo" aria-label={`Logo ${company.name}`}>
            <CompanyLogo company={company} kind="emp" dark />
          </div>
        </div>
        <div className="shell emp-meta">
          <div className="m"><div className="l">{t("Papel", "Role")}</div><div className="v">{company.role}</div></div>
          <div className="m"><div className="l">{t("Período", "Period")}</div><div className="v">{company.period}</div></div>
          <div className="m"><div className="l">{t("Projetos", "Projects")}</div><div className="v">{projCount ? String(projCount).padStart(2, "0") : t("diversos", "several")}</div></div>
        </div>
      </section>

      <div className="emp-body shell">
        <EmpresaLinha companies={companies} company={company} onEmpresa={onEmpresa} />

        <EmpresaHistoria company={company} />

        <EmpresaSkills company={company} />

        <EmpresaQuick company={company} onProject={onProject} />

        <div className="emp-switch">
          <div className="emp-switch-side left">
            {older ? <button type="button" className="emp-navbtn" onClick={() => onEmpresa(older.id)}>
              <span className="ens-k">{t("Antes", "Before")}</span><span className="ens-n"><span className="arr" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span> {older.name}</span>
            </button> : null}
          </div>
          <button type="button" className="btn btn-primary" onClick={onContact}>{t("Bora conversar", "Let's talk")} <span className="arr">→</span></button>
          <div className="emp-switch-side right">
            {newer ? <button type="button" className="emp-navbtn al-r" onClick={() => onEmpresa(newer.id)}>
              <span className="ens-k">{t("Depois", "After")}</span><span className="ens-n">{newer.name} <span className="arr">→</span></span>
            </button> : null}
          </div>
        </div>
      </div>

      <Colofao onContact={onContact} onNav={onNav} />
    </main>
  );
}
Object.assign(window, { EmpresaQuick, EmpresaSkills, EmpresaLinha, EmpresaFala, EmpresaHistoria, SetaBeat, EmpresaPage });

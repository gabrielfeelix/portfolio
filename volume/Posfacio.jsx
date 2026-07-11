/* =====================================================================
   VOLUME — Posfacio.jsx
   Page 4: atogaki, a nota do autor. Voz real, informal. Quem sou fora do
   trabalho, a trajetória (Direito > Design > Produto) com foto que colore
   no hover, a identidade dupla e o próximo capítulo. Sem travessões.
   ===================================================================== */
/* a assinatura se desenha quando entra em view (traço de tinta, depois o
   preenchimento assenta). reduced-motion: já nasce assinada. */
function Assinatura() {
  const [ref, seen] = useReveal({ threshold: 0.5 });
  return (
    <div ref={ref} className={`sig-wrap ${seen ? "in" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 320 110" className="sig-svg" focusable="false">
        <text x="6" y="78" className="sig-text">Gabriel</text>
      </svg>
    </div>
  );
}

function Posfacio({ onContact, t: tweaks = {}, onEmpresa, onProject, onNav }) {
  // NB: the prop stays named `t` for the App, but locally it must NOT shadow
  // the global i18n t() used across this component's copy
  const perfumeSoft = tweaks.perfume === "Fraco confesso";
  const showCursos = !!tweaks.cursos;
  return (
    <main className="posfacio viewcut" key="posfacio">
      <div className="shell">
        <div className="pos-col">
          <div className="pos-k">{t("Posfácio · nota do autor", "Afterword · author's note")}</div>
          <Brush as="h1" className="pos-title">Atogaki</Brush>

          <p className="pos-hand">{t("oi, eu sou o Gabriel.", "hi, I'm Gabriel.")}</p>

          <div className="pos-block">
            <p className="pos-p">{t("Esse portfólio é um mangá de propósito. Leio desde criança, e guiar bem a leitura é justamente a competência de UX que eu quero provar: se a navegação te trouxe até aqui, o argumento já se provou sozinho.", "This portfolio is a manga on purpose. I've read it since I was a kid, and guiding a reading well is exactly the UX skill I want to prove: if the navigation brought you this far, the argument already proved itself.")}</p>
            <p className="pos-p"><b>{t("No que eu acredito:", "What I believe:")}</b> {t("design e código são a mesma vontade. Eu desenho ", "design and code are the same urge. I design ")}<em>{t("e", "and")}</em>{t(" construo, do protótipo navegável ao produto no ar. Uso IA como uso régua: pra chegar mais rápido do rascunho ao protótipo. A decisão continua minha. Decido por teste e dado, não por achismo: escuto o stakeholder, valido o protótipo com gente de verdade e itero pra uma versão. E trato restrição como o que afia a decisão, nunca como desculpa.", " build, from navigable prototype to product live. I use AI the way I use a ruler: to get from sketch to prototype faster. The decision stays mine. I decide by test and data, not gut feeling: I listen to the stakeholder, validate the prototype with real people and iterate to a version. And I treat constraint as what sharpens the decision, never as an excuse.")}</p>
            <p className="pos-p">{t(`Fora da tela, treino boxe${perfumeSoft ? "" : " há dois anos"}. Disciplina e leitura de tempo que levo pro trabalho. E construo app por hobby: faço de graça o que faço no trabalho, porque gosto mesmo.`, `Off the screen, I box${perfumeSoft ? "" : " (two years now)"}. Discipline and timing I carry into the work. And I build apps as a hobby: I do for free what I do at work, because I genuinely like it.`)}</p>
          </div>
        </div>

        <div className="pos-traj">
          <div className="pt-text">
            <div className="pt-kicker">{t("Direito", "Law")} <i>→</i> Design <i>→</i> {t("Produto", "Product")}</div>
            <p className="pos-p">{t("Quase virei advogado. Estava no finalzinho de Direito na UEM quando a pandemia parou tudo. Pra ocupar a cabeça, montei um e-commerce só pra aprender.", "I almost became a lawyer. I was at the very end of law school at UEM when the pandemic stopped everything. To keep my head busy, I built an e-commerce just to learn.")}</p>
            <p className="pos-p">{t("Me apaixonei. Não só pelas telas: pela engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.", "I fell in love. Not just with the screens: with the engineering of making a system exist, of pulling something out of nothing and standing it up.")}</p>
            <p className="pos-p">{t(`Larguei o Direito. Me formei em Design Gráfico, fui atrás de curso atrás de curso de UX${showCursos ? " (Design Circuit, Coderhouse, UX à prova de balas)" : ""} e tirei a certificação Scrum pra andar no ritmo de time ágil.`, `I left law. Got a degree in Graphic Design, chased UX course after UX course${showCursos ? " (Design Circuit, Coderhouse, UX à prova de balas)" : ""} and took the Scrum certification to keep pace with agile teams.`)}</p>
            <p className="pos-p">{t("Comecei na TT&T. Desenhei produto de verdade na Locarmais (IMMO, Signamais e cia). Hoje toco o design de um time inteiro de empresas no Grupo Oderço: PCYES, Odex, Tonante, Vinik, Skul.", "I started at TT&T. Designed real product at Locarmais (IMMO, Signamais and co.). Today I run design for a whole team of companies at Grupo Oderço: PCYES, Odex, Tonante, Vinik, Skul.")}</p>
          </div>
          <div className="pt-photo">
            <div className="about-photo" tabIndex={0} role="img" aria-label={t("Foto de Gabriel (a preencher)", "Photo of Gabriel (to fill)")}>
              <MangaPlate />
              <span className="ap-label">{t("[ sua foto ]", "[ your photo ]")}</span>
              <span className="ap-wash" aria-hidden="true"></span>
            </div>
            <div className="ap-cap"><span className="dn">↑</span> {t("P&B em repouso. Colore no hover.", "B&W at rest. Colors on hover.")}</div>
          </div>
        </div>

        <div className="pos-companies">
          <div className="pos-k">{t("Trajetória de empresas", "Company journey")}</div>
          <div className="comp-track">
            {COMPANIES.map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 ? <div className="comp-arrow" aria-hidden="true">→</div> : null}
                <button type="button" className={`comp ${c.atual ? "atual" : ""}`} onClick={() => onEmpresa && onEmpresa(c.id)}>
                  {c.atual ? <span className="comp-now">{t("Empresa atual", "Current company")}</span> : <span className="comp-step">{String(i + 1).padStart(2, "0")}</span>}
                  <div className="comp-name">{c.name}</div>
                  <div className="comp-role">{c.role}</div>
                  <div className="comp-note">{c.note}</div>
                  <div className="comp-go">{t("Ver história", "See story")} <span className="arr" aria-hidden="true">→</span></div>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <Organic variant="bounce" size={76} className="pos-org" />

        <div className="pos-certs">
          <div className="pos-k">{t("Certificados & formação", "Certificates & education")}</div>
          <div className="certs-grid">
            {CERTS.map((c) => (
              <div className="cert" key={c.id}>
                <div className="cert-thumb">
                  {c.logo ? <img className="cert-logo" src={c.logo} alt={`Logo ${c.title}`} loading="lazy" draggable="false" /> : <MangaPlate />}
                </div>
                <div className="cert-meta">
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
                {c.href
                  ? <a className="cert-link" href={c.href} target="_blank" rel="noreferrer">{t("Ver", "View")} <span className="ext" aria-hidden="true">↗</span></a>
                  : <span className="cert-link is-ph">{t("Ver", "View")} <span className="ph-tag">[link]</span></span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pos-col">
          <div className="pos-block">
            <p className="pos-p"><b>{t("A identidade, sem rodeio: desenho e construo.", "The identity, no detours: I design and I build.")}</b> {t("Projeto a experiência e levo ela até o ar, do protótipo navegável ao produto publicado.", "I design the experience and take it all the way live, from navigable prototype to published product.")}</p>
            <p className="pos-p">{t("Aquele e-commerce da pandemia me ensinou cedo: desenhar e construir são a mesma vontade. Nunca separei.", "That pandemic e-commerce taught me early: designing and building are the same urge. I never split them.")}</p>
          </div>

          <div className="pos-next">
            <div className="pos-k">{t("Pra onde eu vou", "Where I'm headed")}</div>
            <p className="pos-lead">{t("E o próximo capítulo: problemas maiores, pensamento mais afiado, e uma cadeira onde as decisões acontecem de verdade.", "And the next chapter: bigger problems, sharper thinking, and a seat where the decisions actually happen.")}</p>
          </div>

          <p className="pos-hand">{t("se a leitura te pegou, vamos conversar.", "if the reading got you, let's talk.")}</p>

          <Assinatura />

          <div className="pos-sign">
            <Seal size={48} alt={t("Selo de Gabriel", "Gabriel's seal")} />
            <div className="nm">{AUTOR}<small>UX / Product Designer · {VOL}</small></div>
            <div className="pos-sign-cta">
              <button className="btn btn-primary" onClick={onContact}>{t("Fale comigo", "Get in touch")} <span className="arr">→</span></button>
            </div>
          </div>
        </div>
      </div>
      <Colofao onContact={onContact} onNav={onNav} />
    </main>
  );
}
Object.assign(window, { Posfacio, Assinatura });

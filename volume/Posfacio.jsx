/* =====================================================================
   VOLUME — Posfacio.jsx
   Page 4: atogaki, a nota do autor. Voz real, informal. Quem sou fora do
   trabalho, a trajetória (Direito > Design > Produto) com foto que colore
   no hover, a identidade dupla e o próximo capítulo. Sem travessões.
   ===================================================================== */
function Posfacio({ onContact, t = {}, onEmpresa, onProject, onNav }) {
  const perfumeSoft = t.perfume === "Fraco confesso";
  const showCursos = !!t.cursos;
  return (
    <main className="posfacio viewcut" key="posfacio">
      <div className="shell">
        <div className="pos-col">
          <div className="pos-k">Posfácio · nota do autor</div>
          <Brush as="h1" className="pos-title">Atogaki</Brush>

          <p className="pos-hand">oi, eu sou o Gabriel.</p>

          <div className="pos-block">
            <p className="pos-p">Esse portfólio é um mangá de propósito. Leio desde criança, e guiar bem a leitura é justamente a competência de UX que eu quero provar: se a navegação te trouxe até aqui, o argumento já se provou sozinho.</p>
            <p className="pos-p"><b>No que eu acredito:</b> design e código são a mesma vontade. Eu desenho <em>e</em> construo, do protótipo navegável ao produto no ar. Uso IA como uso régua: pra chegar mais rápido do rascunho ao protótipo. A decisão continua minha. Decido por teste e dado, não por achismo: escuto o stakeholder, valido o protótipo com gente de verdade e itero pra uma versão. E trato restrição como o que afia a decisão, nunca como desculpa.</p>
            <p className="pos-p">Fora da tela, treino boxe{perfumeSoft ? "" : " há dois anos"}. Disciplina e leitura de tempo que levo pro trabalho. E construo app por hobby: faço de graça o que faço no trabalho, porque gosto mesmo.</p>
          </div>
        </div>

        <div className="pos-traj">
          <div className="pt-text">
            <div className="pt-kicker">Direito <i>→</i> Design <i>→</i> Produto</div>
            <p className="pos-p">Quase virei advogado. Estava no finalzinho de Direito na UEM quando a pandemia parou tudo. Pra ocupar a cabeça, montei um e-commerce só pra aprender.</p>
            <p className="pos-p">Me apaixonei. Não só pelas telas: pela engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.</p>
            <p className="pos-p">Larguei o Direito. Me formei em Design Gráfico, fui atrás de curso atrás de curso de UX{showCursos ? " (Design Circuit, Coderhouse, UX à prova de balas)" : ""} e tirei a certificação Scrum pra andar no ritmo de time ágil.</p>
            <p className="pos-p">Comecei na TT&amp;T. Desenhei produto de verdade na Locarmais (IMMO, Signamais e cia). Hoje toco o design de um time inteiro de empresas no Grupo Oderço: PCYES, Odex, Tonante, Vinik, Skul.</p>
          </div>
          <div className="pt-photo">
            <div className="about-photo" tabIndex={0} role="img" aria-label="Foto de Gabriel (a preencher)">
              <MangaPlate />
              <span className="ap-label">[ sua foto ]</span>
              <span className="ap-wash" aria-hidden="true"></span>
            </div>
            <div className="ap-cap"><span className="dn">↑</span> P&amp;B em repouso. Colore no hover.</div>
          </div>
        </div>

        <div className="pos-companies">
          <div className="pos-k">Trajetória de empresas</div>
          <div className="comp-track">
            {COMPANIES.map((c, i) => (
              <React.Fragment key={c.id}>
                {i > 0 ? <div className="comp-arrow" aria-hidden="true">→</div> : null}
                <button type="button" className={`comp ${c.atual ? "atual" : ""}`} onClick={() => onEmpresa && onEmpresa(c.id)}>
                  {c.atual ? <span className="comp-now">Empresa atual</span> : <span className="comp-step">{String(i + 1).padStart(2, "0")}</span>}
                  <div className="comp-name">{c.name}</div>
                  <div className="comp-role">{c.role}</div>
                  <div className="comp-note">{c.note}</div>
                  <div className="comp-go">Ver história <span className="arr" aria-hidden="true">→</span></div>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        <Organic variant="bounce" size={76} className="pos-org" />

        <div className="pos-certs">
          <div className="pos-k">Certificados &amp; formação</div>
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
                  ? <a className="cert-link" href={c.href} target="_blank" rel="noreferrer">Ver <span className="ext" aria-hidden="true">↗</span></a>
                  : <span className="cert-link is-ph">Ver <span className="ph-tag">[link]</span></span>}
              </div>
            ))}
          </div>
        </div>

        <div className="pos-col">
          <div className="pos-block">
            <p className="pos-p"><b>A identidade, sem rodeio: desenho e construo.</b> Projeto a experiência e levo ela até o ar, do protótipo navegável ao produto publicado.</p>
            <p className="pos-p">Aquele e-commerce da pandemia me ensinou cedo: desenhar e construir são a mesma vontade. Nunca separei.</p>
          </div>

          <div className="pos-next">
            <div className="pos-k">Pra onde eu vou</div>
            <p className="pos-lead">E o próximo capítulo: problemas maiores, pensamento mais afiado, e uma cadeira onde as decisões acontecem de verdade.</p>
          </div>

          <p className="pos-hand">se a leitura te pegou, vamos conversar.</p>

          <div className="pos-sign">
            <Seal size={48} alt="Selo de Gabriel" />
            <div className="nm">{AUTOR}<small>UX / Product Designer · {VOL}</small></div>
            <div className="pos-sign-cta">
              <button className="btn btn-primary" onClick={onContact}>Fale comigo <span className="arr">→</span></button>
            </div>
          </div>
        </div>
      </div>
      <Colofao onContact={onContact} onNav={onNav} />
    </main>
  );
}
Object.assign(window, { Posfacio });

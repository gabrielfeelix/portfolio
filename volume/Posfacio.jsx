/* =====================================================================
   VOLUME — Posfacio.jsx
   Page 4: atogaki, a nota do autor. Voz real, informal. Quem sou fora do
   trabalho, a trajetória (Direito > Design > Produto) com foto que colore
   no hover, a identidade dupla e o próximo capítulo. Sem travessões.
   ===================================================================== */
function Posfacio({ onContact, t = {}, onEmpresa, onProject }) {
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
            <p className="pos-p">Você já percebeu: esse portfólio é um mangá. Não é firula de tendência. Eu leio desde criança, e fazia sentido a minha história ter a cara das histórias que eu amo.</p>
            <p className="pos-p">Fora da tela, treino boxe há dois anos (capoeira e muay thai vieram antes). Corro. {perfumeSoft ? "Tenho um fraco confesso por perfume." : "Coleciono perfume sem pedir desculpa por isso."} E construo app por hobby: sim, faço de graça o que faço no trabalho. Ando até começando a mexer com jogos.</p>
            <p className="pos-p">O que eu mais protejo, no fim, é o tempo com a namorada, a família e os amigos. E sou tio. Do tipo babão, que enche o rolo de foto de criança.</p>
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

        <div className="pos-certs">
          <div className="pos-k">Certificados &amp; formação</div>
          <div className="certs-grid">
            {CERTS.map((c) => (
              <div className="cert" key={c.id}>
                <div className="cert-thumb"><MangaPlate /></div>
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
            <p className="pos-p"><b>A identidade, sem rodeio: desenho e construo.</b> Projeto a experiência e levo ela até o ar, com IA dentro do fluxo, do protótipo navegável ao produto publicado.</p>
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
    </main>
  );
}
Object.assign(window, { Posfacio });

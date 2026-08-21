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
  const showCursos = !!tweaks.cursos;
  return (
    <main className="posfacio viewcut" key="posfacio">
      <div className="shell">
        <div className="pos-col">
          <div className="pos-k">{t("Posfácio", "Afterword")}</div>
          <Brush as="h1" className="pos-title">Atogaki</Brush>

          <p className="pos-hand">{t("oi, eu sou o Gabriel.", "hi, I'm Gabriel.")}</p>

          <div className="pos-block">
            <p className="pos-p">{t("Esse portfólio é um mangá de propósito. Leio desde criança, e a ideia era simples: se eu vou dizer que sei guiar a leitura de alguém, faz mais sentido guiar a sua do que escrever isso numa lista de competências.", "This portfolio is a manga on purpose. I've read them since I was a kid, and the idea was simple: if I'm going to claim I can guide someone's reading, it makes more sense to guide yours than to write it down in a list of skills.")}</p>
            <p className="pos-p">{t("Espero que a navegação tenha funcionado até aqui. Se em algum ponto você se perdeu, eu gostaria de saber.", "I hope the navigation has worked so far. If you got lost at any point, I'd like to know.")}</p>
          </div>

          <div className="pos-sec">
            <div className="pos-k">{t("Como eu trabalho", "How I work")}</div>
            <div className="pos-block">
              <p className="pos-p">{t("Pra mim, design e código nunca foram duas coisas separadas. Desenho a experiência e levo ela até o ar.", "For me, design and code were never two separate things. I design the experience and take it all the way live.")}</p>
              <p className="pos-p">{t("Gosto de colocar uma tela clicável na mão das pessoas cedo, porque opinião sobre imagem estática costuma ser gosto, e opinião sobre uma coisa que a pessoa tentou usar costuma ser informação. Uso IA no meio do caminho, não pra entregar mais rápido, mas pra chegar antes na parte que interessa, que é sentar com alguém e descobrir onde a ideia não funciona.", "I like putting a clickable screen in people's hands early, because an opinion about a static image is usually taste, and an opinion about something the person actually tried to use is usually information. I use AI along the way, not to deliver faster, but to reach sooner the part that matters: sitting down with someone and finding out where the idea doesn't work.")}</p>
              <p className="pos-p">{t("Depois disso é ajuste, e mais ajuste. A parte demorada do meu trabalho é essa, e é a parte que eu não abro mão.", "After that it's adjustment, and more adjustment. That's the slow part of my work, and it's the part I won't give up.")}</p>
            </div>
          </div>
        </div>

        <div className="pos-traj">
          <div className="pt-text">
            <div className="pt-kicker">{t("Como eu cheguei aqui", "How I got here")}</div>
            <p className="pos-p">{t("Eu estava no fim do curso de Direito na UEM quando a pandemia parou tudo. Pra ocupar a cabeça, montei um e-commerce só pra aprender a mexer.", "I was at the end of law school at UEM when the pandemic stopped everything. To keep my head busy, I built an e-commerce just to learn my way around it.")}</p>
            <p className="pos-p">{t("Foi ali que a coisa virou. Não me peguei gostando só das telas: gostei da engenharia de fazer um sistema existir, de tirar algo do nada e botar de pé.", "That's where it turned. I didn't just find myself liking the screens: I liked the engineering of making a system exist, of pulling something out of nothing and standing it up.")}</p>
            <p className="pos-p">{t(`Larguei o Direito, me formei em Design Gráfico, fui atrás de curso de UX${showCursos ? " (Design Circuit, Coderhouse, UX à prova de balas)" : ""} e tirei a certificação Scrum pra andar no ritmo de time ágil. Comecei na TT&T, desenhei produto de verdade na Locarmais, e hoje toco o design de um time inteiro de marcas no Grupo Oderço.`, `I left law, got a degree in Graphic Design, chased UX courses${showCursos ? " (Design Circuit, Coderhouse, UX à prova de balas)" : ""} and took the Scrum certification to keep pace with agile teams. I started at TT&T, designed real product at Locarmais, and today I run design for a whole team of brands at Grupo Oderço.`)}</p>
          </div>
          <div className="pt-photo">
            <div className="about-photo has-photo" tabIndex={0}>
              <img className="ap-img" src="volume/assets/gabriel.webp" alt="Gabriel Felix Barbosa" loading="lazy" draggable="false" />
              <span className="ap-wash" aria-hidden="true"></span>
            </div>
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
                  {/* sem arquivo, o wordmark repetiria o nome logo abaixo */}
                  {c.logo ? <span className="comp-logo"><CompanyLogo company={c} kind="comp" dark={c.atual} /></span> : null}
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
                  <CertThumb cert={c} />
                </div>
                <div className="cert-meta">
                  <div className="cert-title">{c.title}</div>
                  <div className="cert-issuer">{c.issuer}</div>
                </div>
                {/* sem href não existe "Ver": link morto é pior que ausência */}
                {c.href
                  ? <a className="cert-link" href={c.href} target="_blank" rel="noreferrer">{t("Ver", "View")} <span className="ext" aria-hidden="true">↗</span></a>
                  : null}
              </div>
            ))}
          </div>
        </div>

        <div className="pos-col">
          <div className="pos-sec">
            <div className="pos-k">{t("Fora da tela", "Off the screen")}</div>
            <div className="pos-block">
              <p className="pos-p">{t("Corro, treino boxe há dois anos e jogo vôlei toda semana num time amador aqui em Maringá.", "I run, I've been boxing for two years and I play volleyball every week on an amateur team here in Maringá.")}</p>
              <p className="pos-p">
                {t("Leio mangá e manhwa numa quantidade difícil de justificar, e mantenho um canal sobre anime. Se quiser conferir o que eu ando assistindo, ", "I read manga and manhwa in quantities that are hard to justify, and I keep a channel about anime. If you want to see what I've been watching, ")}
                <a className="pos-link" href={CONTATO.tiktok.href} target="_blank" rel="noreferrer">{t("tá aqui", "it's here")} <span className="ext" aria-hidden="true">↗</span></a>.
              </p>
              <p className="pos-p">{t("Também construo aplicativo por hobby. Costumo fazer só os que resolvem algum problema meu: tem um que lembra onde eu estacionei o carro, e outro que ajuda freelancer a calcular quanto cobrar por hora.", "I also build apps as a hobby. I tend to make only the ones that solve a problem of my own: there's one that remembers where I parked the car, and another that helps freelancers work out their hourly rate.")}</p>
            </div>
          </div>

          <div className="pos-next">
            <div className="pos-k">{t("Pra onde eu vou", "Where I'm headed")}</div>
            <p className="pos-lead">{t("Quero trabalhar em produto maior, com gente que sabe mais que eu, e estar mais perto de onde as decisões são tomadas.", "I want to work on bigger product, with people who know more than I do, and to be closer to where the decisions are made.")}</p>
          </div>

          <p className="pos-hand">{t("obrigado por ler até aqui.", "thanks for reading this far.")}</p>

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

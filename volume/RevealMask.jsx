/* =====================================================================
   VOLUME, RevealMask.jsx
   Os capítulos na home, em grade.

   A versão de tela cheia (uma viewport por capítulo, arte alternando de
   lado) cobrava cinco rolagens inteiras só pra saber o que existe no
   volume. A versão seguinte errou pro outro lado: empilhou número gigante,
   descritor, dois marcadores de texto e um botão dentro do card, e cada
   quadro virou uma torre.

   Este é o formato da referência: a arte manda, e embaixo dela UMA barra
   fina com o essencial — posição, título, domínio e as tags. Quem quer o
   caso clica no quadro inteiro; quem está passando o olho lê a barra e
   segue. O card fica na altura da imagem mais a barra, e nada além disso.

   A onomatopeia gigante saiu junto: em tela cheia ela escapava por trás da
   quina e funcionava, mas na grade cruzava o meio da seção como uma mancha
   cinza sem função.
   ===================================================================== */

/* useReveal() (data.jsx) desconecta no primeiro disparo — serve pra revelar
   uma vez e nunca mais. Aqui o capítulo tem que re-animar TODA vez que entra
   em cena, então o observador fica vivo e o estado acompanha entra/sai.
   Guarda: se o IO não existir (impressão, motor antigo) ou não disparar em
   2s, abre e fica aberto — conteúdo nunca fica preso atrás da máscara. */
function useReenter({ threshold = 0.3, rootMargin = "0px 0px -12% 0px" } = {}) {
  const ref = useRef(null);
  const fired = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      fired.current = true;
      setInView(e.isIntersecting);
    }, { threshold, rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const safety = setTimeout(() => { if (!fired.current) setInView(true); }, 2000);
    return () => clearTimeout(safety);
  }, []);

  return [ref, inView];
}

/* Os pontos são a posição do capítulo na espinha — cheios até onde ele
   está, vazios no resto. Mesmo marcador da referência: diz "este é o
   terceiro de cinco" de relance, sem gastar uma linha de texto. */
function Dots({ index, total }) {
  const list = [];
  for (let i = 0; i < total; i++) {
    list.push(<span className={`rvd ${i <= index ? "on" : ""}`} key={i}></span>);
  }
  return <span className="rvm-dots" aria-hidden="true">{list}</span>;
}

/* Um capítulo: a arte, e a barra por baixo dela.
   `chap` pode não ter arte (Locar Mais até os prints entrarem): nesse caso
   a chapa do MangaPlate assume o quadro, e o vazio fica editorial em vez
   de ler como imagem quebrada. */
function RevealImageMask({ proj, chap, index, total, onOpen }) {
  const [ref, inView] = useReenter({ threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  // TELA do trabalho primeiro: `shots` são os prints reais em
  // assets/projetos/<slug>/. Capa de marca e cover ficam de plano B —
  // quem chega quer ver o produto, não a logo.
  const art = (proj.shots && proj.shots[0]) || (chap && chap.cover) || proj.cover || null;
  const capa = chap && chap.capa;
  const live = proj.links && (proj.links.vercel || proj.links.play);

  return (
    <li ref={ref} className={`rvm ${inView ? "in" : ""}`}>
      <button
        type="button"
        className="rvm-btn"
        onClick={() => onOpen(proj.id)}
        aria-label={t(`Ler o capítulo ${proj.title}`, `Read the ${proj.title} chapter`)}
      >
        <span className="rvm-art">
          <span className="rvm-mask">
            {art
              ? <img className="rvm-img" src={art} alt="" loading="lazy" draggable="false" />
              : capa
                ? <BrandPlate capa={capa} className="bp-rvm" />
                : <MangaPlate className="rvm-plate" />}
          </span>
          <span className="rvm-cap">{projTag(proj)}</span>
          {/* o disco com a seta diagonal, só no hover — como na referência */}
          <span className="rvm-hov" aria-hidden="true">↗</span>
        </span>

        <span className="rvm-bar">
          <span className="rvm-info">
            <span className="rvm-line">
              <Dots index={index} total={total} />
              <span className="rvm-t">{proj.title}</span>
            </span>
            <span className="rvm-dom">{proj.domain}</span>
          </span>
          <span className="rvm-tags">
            <span className="rvm-tag">{catLabel(proj.cat)}</span>
            {live ? <span className="rvm-tag is-live">{t("No ar", "Live")}</span> : null}
          </span>
        </span>
      </button>
    </li>
  );
}

/* A espinha do volume: os capítulos de caseProjects(), na ordem de leitura. */
function RevealChapters({ onOpen }) {
  const items = caseProjects();
  return (
    <ol className="rvm-list">
      {items.map((p, i) => (
        <RevealImageMask key={p.id} proj={p} chap={chapterFor(p.id)}
                         index={i} total={items.length} onOpen={onOpen} />
      ))}
    </ol>
  );
}

Object.assign(window, { RevealImageMask, RevealChapters, useReenter, Dots });

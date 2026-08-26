/* =====================================================================
   VOLUME, RevealMask.jsx
   O quadro que se entinta. Cada capítulo toma a tela inteira e a arte
   entra por uma máscara que abre de baixo pra cima — tinta assentando
   num quadro de mangá, não um fade de landing page.

   Mesma gramática do <Brush> (data.jsx): máscara em gradiente + transition
   no mask-size. Lá o eixo é X e o alvo é o título; aqui é Y e o alvo é a
   arte. Um só idioma de reveal no volume inteiro.

   Os quadros ALTERNAM de lado (par à esquerda, ímpar à direita): a página
   dupla de mangá vira a leitura a cada virada, e cinco quadros do mesmo
   lado viram parede.

   Nada de cópia nova: título, domínio, contexto e resultado saem de
   PROJECTS/CHAPTERS, exatamente as mesmas fontes que o ChapterBlock lia.
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

/* Um capítulo, tela cheia. `chap` pode não ter arte (Locar Mais até os
   prints entrarem): nesse caso a chapa do MangaPlate assume o quadro. O
   vazio fica editorial e declarado, em vez de ler como imagem quebrada. */
function RevealImageMask({ proj, chap, index, onOpen }) {
  const [ref, inView] = useReenter();
  const flip = index % 2 === 1;

  // capa de marca tem prioridade: em Locar Mais, ODEX e Oderço a tela não
  // fecha a história em 4:5 (fica um recorte estranho), então a capa é a
  // marca sobre a cor dela. O trabalho real aparece ao abrir o capítulo.
  const capa = chap && chap.capa;
  // coverTall (1000×1250) é a proporção do painel; cover (16:9) é o plano B
  const art = (chap && (chap.coverTall || chap.cover)) || proj.cover || null;
  const contexto = (chap && chap.descriptor) || proj.domain;
  const resultado = chap && chap.tldr ? chap.tldr.resultado : "";
  const num = (chap && chap.num) || String(index + 1).padStart(2, "0");

  return (
    <li ref={ref} className={`rvm ${flip ? "flip" : ""} ${inView ? "in" : ""}`}>
      <button
        type="button"
        className="rvm-btn"
        onClick={() => onOpen(proj.id)}
        aria-label={t(`Ler o capítulo ${proj.title}`, `Read the ${proj.title} chapter`)}
      >
        <span className="rvm-art">
          <span className="rvm-frame">
            <span className="rvm-mask">
              {capa
                ? <BrandPlate capa={capa} className="bp-rvm" />
                : art
                  ? <img className="rvm-img" src={art} alt="" loading="lazy" draggable="false" />
                  : <MangaPlate className="rvm-plate" />}
            </span>
            <span className="rvm-cap">{projTag(proj)}</span>
          </span>
          {/* a onomatopeia do capítulo, escapando por trás da quina */}
          {chap && chap.sfx ? <span className="rvm-sfx" aria-hidden="true">{chap.sfx}</span> : null}
        </span>

        <span className="rvm-copy">
          <span className="rvm-head">
            <span className="rvm-num" aria-hidden="true">{num}</span>
            <span className="rvm-dom">{proj.domain}</span>
            {/* o volume tem um arco central e o sumário diz qual é: sem
                isso o leitor gasta 16 beats para descobrir sozinho */}
            {chap && chap.principal
              ? <span className="rvm-main">{t("Capítulo principal", "Main chapter")}</span>
              : null}
          </span>
          <span className="rvm-t">{proj.title}</span>
          <span className="rvm-ctx">{renderPH(contexto)}</span>
          {resultado
            ? <span className="rvm-res"><i>{t("Resultado", "Result")}</i> {renderPH(resultado)}</span>
            : null}
          <span className="rvm-go">
            {t("Ler o capítulo", "Read the chapter")} <span className="arr" aria-hidden="true">→</span>
          </span>
        </span>
      </button>
    </li>
  );
}

/* A espinha do volume: os capítulos de caseProjects(), na ordem de leitura.
   Substitui o <ChapterList> compacto na home. "Outras peças" não é tocado. */
function RevealChapters({ onOpen }) {
  const items = caseProjects();
  return (
    <ol className="rvm-list">
      {items.map((p, i) => (
        <RevealImageMask key={p.id} proj={p} chap={chapterFor(p.id)} index={i} onOpen={onOpen} />
      ))}
    </ol>
  );
}

Object.assign(window, { RevealImageMask, RevealChapters, useReenter });

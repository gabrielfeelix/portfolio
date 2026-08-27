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
   de ler como imagem quebrada.

   O quadro é uma CHAPA DE COR com o print flutuando em cima, não o print
   preenchendo a moldura. A cor vem de `chap.capa.bg`, que é a cor da marca
   do cliente, e a retícula por cima é o que mantém isso como quadro de
   mangá e não como card de template. Sem `capa` a chapa cai para tinta. */
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
        <span className="rvm-art" style={capa ? { "--rvm-bg": capa.bg } : undefined}>
          {/* a retícula: é ela que impede a chapa de cor de virar bloco
              chapado e mantém o quadro no idioma do volume */}
          <span className="rvm-tone" aria-hidden="true"></span>
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

/* ---------- O BARALHO QUE SE DISTRIBUI --------------------------------
   Os cinco capítulos chegavam já sentados na grade. Agora chegam como um
   baralho na mão: empilhados no centro da primeira fileira, em leque, e
   a rolagem distribui carta por carta até o lugar de cada uma.

   A regra que sustenta isso: o LEQUE É SEMPRE UM DELTA sobre o layout que
   o CSS já calculou, nunca uma posição escrita à mão. Mede-se a grade com
   as cartas limpas, guarda-se o vetor de cada uma até o centro do baralho,
   e o scroll interpola esse vetor de volta a zero. Em p = 1 o transform é
   identidade e o que sobra é a `.rvm-list` de sempre. Se a grade mudar de
   colunas, de gap ou de largura, o leque acompanha sozinho.

   Por isso também o desalinho da coluna par virou `margin-block-start` no
   CSS e não `transform`: transform aqui é território do baralho, e duas
   fontes escrevendo a mesma propriedade é bug garantido.

   Custo: rAF com listener passivo, igual ao `Bite`. O scroll só escreve
   `transform`, nunca lê layout. A leitura acontece uma vez na montagem,
   de novo em `fonts.ready` (a fonte chega depois da primeira pintura e
   muda altura) e a cada resize com debounce.

   Não roda com `prefers-reduced-motion`, nem abaixo de 860px, onde a
   grade é de uma coluna só e o leque não teria para onde abrir. Nos dois
   casos as cartas ficam com `transform` vazio, que é a grade de hoje. */

const DECK_MIN_W = 861;   /* o breakpoint da grade de 2 colunas, mais 1 */
const DECK_ATRASO = 0.42; /* quanto do percurso é gasto escalonando as cartas */

/* Quanto de cada quadro a carta caminha em direção ao alvo da rolagem.
   Menor = mais preguiçosa. É o mesmo mecanismo das colunas do `Bite`, e é
   ele que tira o movimento do 1:1: sem lerp a carta é escrava do scroll e
   para no instante em que a roda para, o que lê como arrasto e não como
   peso. Os fatores caem de cima para baixo, então a última carta do
   baralho chega depois das outras e o leque fecha com atraso.

   Mais baixos que os do `Bite` (0,068 a 0,115) de propósito: aqui a peça
   é grande e o percurso é longo, e no fator dele o baralho parecia
   nervoso. */
const DECK_LERP = [0.080, 0.070, 0.061, 0.052, 0.045];
const DECK_PARADO = 0.0016;  /* diferença abaixo da qual a carta assenta */

/* A pose de cada carta dentro do baralho, relativa ao lugar final dela.
   `i = 0` é a carta de cima. O leque abre para os dois lados a partir do
   meio, então o desenho tem centro em vez de ler como pilha torta. */
function poseLeque(i, n) {
  const meio = (n - 1) / 2;
  return {
    rot: (i - meio) * 6,
    dx:  (i - meio) * 26,
    dy:  i * 10,
    esc: 0.9 - i * 0.014,
  };
}

/* A espinha do volume: os capítulos de caseProjects(), na ordem de leitura. */
function RevealChapters({ onOpen }) {
  const items = caseProjects();
  const listRef = useRef(null);

  useEffect(() => {
    const lista = listRef.current;
    if (!lista) return;
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cartas = Array.prototype.slice.call(lista.children);
    const n = cartas.length;
    let alvos = [];      /* vetor de cada carta até o centro do baralho */
    let faixa = null;    /* centro absoluto do baralho */
    let raf = 0;
    let vivo = false;    /* o baralho está ligado nesta largura? */
    let suave = [];      /* o progresso AMACIADO de cada carta, que persegue o da rolagem */

    function limpar() {
      cartas.forEach((c) => { c.style.transform = ""; c.style.zIndex = ""; });
    }

    function medir() {
      vivo = !reduz && window.innerWidth >= DECK_MIN_W;
      limpar();
      if (!vivo) { alvos = []; return; }
      const lr = lista.getBoundingClientRect();
      const primeira = cartas[0].getBoundingClientRect();
      /* o baralho se forma no centro horizontal da lista, na altura da
         PRIMEIRA FILEIRA: é onde o olho já está quando a seção entra, e
         evita que as cartas comecem fora da tela. */
      const cx = lr.left + lr.width / 2;
      const cy = primeira.top + primeira.height / 2;
      alvos = cartas.map((c) => {
        const b = c.getBoundingClientRect();
        return { dx: cx - (b.left + b.width / 2), dy: cy - (b.top + b.height / 2) };
      });
      /* a âncora é o CENTRO DO BARALHO, não o topo da lista. Ancorado no
         topo, o leque terminava de distribuir com p = 0,92 antes de o
         baralho chegar ao meio da tela: quem rolava via a grade pronta e
         perdia o movimento inteiro. Medido em 1440 x 900. */
      faixa = { centro: cy + window.scrollY };
      /* nasce já no alvo: quem chega na página com a seção no meio da tela
         não deve ver o baralho se montar do zero. */
      suave = cartas.map((_, i) => alvoDe(i, progresso()));
    }

    /* o progresso cru da rolagem, 0 a 1 */
    function progresso() {
      const vh = window.innerHeight;
      const centro = faixa.centro - window.scrollY;
      /* p = 0 com o baralho entrando por baixo (90% da tela) e p = 1 com
         ele no topo (4%). O alcance foi de 0,62 para 0,86 de tela: o mesmo
         movimento espalhado por mais rolagem é o que o deixa mais lento
         sem deixá-lo mole. */
      return Math.max(0, Math.min(1, (vh * 0.9 - centro) / (vh * 0.86)));
    }

    /* o alvo de UMA carta: o progresso da rolagem, deslocado pelo atraso
       que escalona a distribuição */
    function alvoDe(i, p) {
      return Math.max(0, Math.min(1, (p - (i / n) * DECK_ATRASO) / (1 - DECK_ATRASO)));
    }

    /* Um quadro. A rolagem não escreve o transform: ela só move o ALVO, e
       cada carta persegue o alvo dela por lerp. Enquanto sobrar diferença
       o quadro se reagenda sozinho, então o movimento continua depois de a
       roda parar, que é exatamente o peso que faltava. */
    function passo() {
      raf = 0;
      if (!vivo || !alvos.length) return;
      const p = progresso();
      let mexeu = false;
      for (let i = 0; i < n; i++) {
        const alvo = alvoDe(i, p);
        const d = alvo - suave[i];
        if (Math.abs(d) > DECK_PARADO) { suave[i] += d * DECK_LERP[i]; mexeu = true; }
        else { suave[i] = alvo; }

        const e = 1 - Math.pow(1 - suave[i], 3);
        const L = poseLeque(i, n);
        const a = alvos[i];
        const resto = 1 - e;
        const dx = (a.dx + L.dx) * resto;
        const dy = (a.dy + L.dy) * resto;
        const rot = L.rot * resto;
        const esc = L.esc + (1 - L.esc) * e;
        const c = cartas[i];
        c.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg) scale(${esc})`;
        /* a carta de cima do baralho é a primeira do volume */
        c.style.zIndex = String(n - i);
      }
      if (mexeu) raf = requestAnimationFrame(passo);
    }

    function agenda() { if (!raf) raf = requestAnimationFrame(passo); }
    function remedir() { medir(); agenda(); }

    let t = 0;
    function noResize() { clearTimeout(t); t = setTimeout(remedir, 140); }

    remedir();
    /* a fonte chega depois da primeira pintura e muda a altura da barra
       embaixo do card: sem esta segunda medida o leque erra o alvo */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remedir);

    window.addEventListener("scroll", agenda, { passive: true });
    window.addEventListener("resize", noResize);
    return () => {
      window.removeEventListener("scroll", agenda);
      window.removeEventListener("resize", noResize);
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
      limpar();
    };
  }, []);

  return (
    <ol className="rvm-list" ref={listRef}>
      {items.map((p, i) => (
        <RevealImageMask key={p.id} proj={p} chap={chapterFor(p.id)}
                         index={i} total={items.length} onOpen={onOpen} />
      ))}
    </ol>
  );
}

Object.assign(window, { RevealImageMask, RevealChapters, useReenter, Dots, poseLeque });

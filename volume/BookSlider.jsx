/* =====================================================================
   VOLUME, BookSlider.jsx
   O livro das outras peças.

   Página dupla de verdade: DOIS projetos por vez, um em cada página. A
   primeira versão gastava o livro inteiro num só projeto (arte à esquerda,
   texto à direita), que é um card com moldura de livro, não um livro.

   Sem preview de imagem — a página é tipográfica. O espaço da logo fica
   reservado e entra quando o Gabriel tiver os arquivos.

   A virada corre da DIREITA para a ESQUERDA, que é o sentido de leitura do
   mangá e o mesmo sentido da faixa de marcas na segunda dobra. Por isso a
   peça de número menor ocupa a folha da DIREITA e a seguinte a da esquerda:
   a ordem do DOM continua 001, 002 (que é a ordem de leitura, e é o que o
   leitor de tela anuncia) e quem posiciona é o `grid-column` no app.css.
   Avançar gira a folha da direita; voltar gira a da esquerda.

   A folha gira na lombada (`transform-origin` no vinco, `preserve-3d`,
   verso escondido por `backface-visibility`), e o verso é papel com
   screentone: virando, aparece o avesso da folha, não um retângulo chapado.

   `book-slider` do briefing é componente de outro stack (shadcn/Next, com
   alias de import). Este repo é script global transpilado sem bundle, então
   o livro é escrito aqui, no idioma do volume.
   ===================================================================== */

const LV_DUR = 620;   /* casa com a animação lv-vira no app.css */

/* Cada página do livro carrega UMA animação de tinta diferente, no slot que
   antes era um quadrado tracejado vazio. São as treze do `organic.jsx`, na
   ordem em que a folha as encontra: a peça 001 abre com `magatama` e nenhuma
   se repete até virar o livro inteiro. O índice do projeto é que escolhe,
   então a mesma peça mostra sempre a mesma tinta. */
const LV_TINTAS = ["magatama", "orbit", "drip", "yin", "amoeba", "ripple",
                   "cluster", "split", "trail", "merge", "bounce", "three", "twin"];

/* uma página: só tipografia, o destino real e o espaço da logo */
function Pagina({ proj, n, tinta }) {
  const ref = useRef(null);

  /* A FOLHA TEM ALTURA FIXA. Quando a peça tem texto demais, quem cede é o
     corpo do texto e não o livro: `--lv-fit` desce em passos até o conteúdo
     caber na página. Antes era o contrário, o livro crescia para acomodar a
     peça mais falante, e uma folha de 640px ao lado de uma de 360 não é
     livro, é acordeão.

     Roda em `useLayoutEffect` (antes da pintura) para o leitor nunca ver o
     texto grande piscar e encolher. */
  const ajusta = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    /* A medida é por RETÂNGULO, não por `scrollHeight`. Num container flex
       com `overflow: hidden`, `scrollHeight` pode empatar com `clientHeight`
       mesmo com o texto visivelmente cortado, e foi o que aconteceu: o laço
       nunca entrava. O fundo do último filho em fluxo contra o fundo útil da
       página é medida que não depende de interpretação do motor. */
    const fundoUtil = () => {
      const r = el.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      return r.bottom - pad;
    };
    const fundoConteudo = () => {
      let y = -Infinity;
      for (let i = 0; i < el.children.length; i++) {
        const c = el.children[i];
        /* a tinta é absoluta e decorativa: não conta como conteúdo */
        if (c.classList.contains("lv-marca")) continue;
        y = Math.max(y, c.getBoundingClientRect().bottom);
      }
      return y;
    };

    let f = 1;
    el.style.setProperty("--lv-fit", "1");
    /* Piso em .82. A folha já é dimensionada para caber a peça mais falante,
       então o ajuste aqui é retoque, não salvamento: se alguma página chegar
       ao piso, o problema é texto longo demais no data.jsx e é lá que se
       resolve, porque abaixo disso o corpo sai do mínimo legível do volume. */
    while (f > 0.82 && fundoConteudo() > fundoUtil() + 0.5) {
      f -= 0.035;
      el.style.setProperty("--lv-fit", f.toFixed(3));
    }
  }, []);

  useLayoutEffect(ajusta);
  useEffect(() => {
    window.addEventListener("resize", ajusta, { passive: true });
    /* as fontes do volume chegam depois da primeira pintura e mudam a altura
       do texto: sem re-medir aqui, o ajuste calcularia sobre a fonte de
       fallback e erraria a conta na hora que mais importa, o primeiro olhar */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusta);
    return () => window.removeEventListener("resize", ajusta);
  }, [ajusta]);

  if (!proj) {
    /* número ímpar de peças: a última folha fica com o verso à mostra */
    return (
      <span className="lv-pg is-vazia" aria-hidden="true">
        <span className="lv-fim">終</span>
      </span>
    );
  }
  const live = pieceLink(proj);
  const dest = proj.destino || "ar";
  const destLabel = dest === "proto" ? t("Ver protótipo", "See prototype")
    : dest === "figma" ? t("Abrir no Figma", "Open in Figma")
    : dest === "loja" ? t("Ver na Play Store", "See on Play Store")
    : t("Ver no ar", "See it live");

  return (
    <span className="lv-pg" ref={ref}>
      <span className="lv-topo">
        {/* o logo entra DENTRO da linha de topo, ao lado da categoria: ali ele
            não custa altura nenhuma e o branco do meio da folha continua
            livre, que é onde a tela do produto vai entrar depois */}
        {proj.marca
          ? <img className="lv-logo" src={proj.marca} alt="" aria-hidden="true"
                 loading="lazy" draggable="false" />
          : null}
        <span className="lv-cat">{catLabel(proj.cat)}</span>
        <span className="lv-num">{String(n).padStart(3, "0")}</span>
      </span>

      {/* o quadrado tracejado vazio virou a tinta da página */}
      <span className="lv-marca">
        <Organic variant={tinta} size={62} />
      </span>

      <span className="lv-t">{proj.title}</span>
      <span className="lv-dom">{proj.domain}</span>
      {proj.desc ? <span className="lv-desc">{proj.desc}</span> : null}
      {/* o argumento da peça ocupa o branco que sobrava no meio da folha */}
      {proj.sobre ? <span className="lv-sobre">{proj.sobre}</span> : null}

      {live ? (
        <a className="btn btn-seta lv-go" href={live} target="_blank" rel="noreferrer"
           onClick={(e) => e.stopPropagation()}>
          <span className="arr" aria-hidden="true">→</span> {destLabel}
        </a>
      ) : (
        <span className="lv-sem">{t("Ainda sem link público", "No public link yet")}</span>
      )}
    </span>
  );
}

function BookSlider({ items }) {
  const [par, setPar] = useState(0);          /* índice do projeto da DIREITA (o primeiro a ler) */
  const [vira, setVira] = useState(null);     /* {dir, esq, dir2} durante a virada */
  const [aberto, setAberto] = useState(false);
  const stage = useRef(null);
  const capaRef = useRef(null);
  const janelaRef = useRef(null);
  const blocoRef = useRef(null);
  const toque = useRef(null);
  const trava = useRef(false);

  /* A CAPA FECHADA.

     O livro chegava escancarado: quem descia a página caía numa página
     dupla aberta sem nunca ter visto que aquilo era um volume.

     A primeira tentativa girava uma chapa vermelha e a fazia evaporar aos
     90 graus por `backface-visibility`, enquanto o miolo acendia por
     opacidade. São dois eventos separados acontecendo junto, e lia como
     "girou e cortou para outro frame", não como livro abrindo. O que
     faltava são as duas coisas que fazem a leitura ser de livro:

     1. A FOLHA TEM DOIS LADOS. Girando, o verso dela é papel com trama, e
        ela POUSA do outro lado em vez de sumir no meio do caminho. Mesma
        estrutura da folha de virar página (`.lv-folha`), que já provou
        funcionar aqui.
     2. O LIVRO CRESCE. Fechado tem UMA página de largura. A segunda página
        é DESCOBERTA pela folha saindo da frente dela, por recorte, não
        acesa por transparência. É o crescimento que diz "isto abriu".

     A geometria copia a virada de página que já existe: a folha ocupa a
     metade ESQUERDA, a dobradiça é a borda direita dela (o vinco), e ela
     gira para a direita por cima do vinco. Mangá é encadernado à direita,
     as folhas lidas se acumulam desse lado, e a capa é só a primeira
     folha dessa pilha.

     O tempo é dividido: até a metade do percurso só a folha gira e o livro
     fica parado, de uma página, centrado. Da metade em diante o livro
     cresce e desliza para o centro enquanto a folha termina de pousar. Sem
     essa divisão o miolo aparece embaixo de uma capa ainda fechada e
     entrega o truque. */
  useEffect(() => {
    const capa = capaRef.current, corpo = janelaRef.current, palco = stage.current;
    const bloco = blocoRef.current;
    if (!capa || !corpo || !palco || !bloco) return;
    const reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) { capa.style.display = "none"; bloco.style.display = "none"; return; }

    let raf = 0, suave = 0;

    function alvo() {
      const r = palco.getBoundingClientRect();
      const vh = window.innerHeight;
      const centro = r.top + r.height / 2;
      /* Fecha com o livro entrando por baixo e termina de abrir com ele
         ainda na metade da tela. Era 0,62 de percurso e a abertura só
         completava com o livro quase saindo por cima, indo para a seção
         seguinte: quem rolava normal nunca via o livro aberto parado. */
      return Math.max(0, Math.min(1, (vh * 0.98 - centro) / (vh * 0.48)));
    }

    function passo() {
      raf = 0;
      const a = alvo();
      const d = a - suave;
      /* 0,11 e não 0,075: no fator anterior a folha arrastava atrás da
         rolagem tempo demais e a virada parecia lenta. */
      if (Math.abs(d) > 0.0016) { suave += d * 0.11; raf = requestAnimationFrame(passo); }
      else { suave = a; }

      /* `abre` é a segunda metade do percurso: enquanto ela é zero o livro
         está fechado e parado, e é a folha que trabalha sozinha. */
      const abre = Math.max(0, Math.min(1, (suave - 0.5) / 0.42));

      /* A FOLHA. Gira 176 graus, o mesmo ângulo da virada de página, então
         ela termina deitada sobre a metade direita em vez de encostar no
         plano e desaparecer.

         O translate vem ANTES do rotate porque o eixo tem que ser a borda
         já deslocada. Fechada, ele empurra a metade esquerda para o meio
         da caixa: 50% da largura da folha é 25% da caixa. Aberta, zera. */
      /* SEM `perspective()` aqui, e isso é o conserto de um defeito real:
         a função `perspective()` dentro do transform usa como ponto de
         fuga o `transform-origin` do PRÓPRIO elemento, que aqui é a borda
         direita. A borda que vem para a frente explodia de tamanho e a
         capa girando ficava muito maior que o livro. A perspectiva certa é
         a propriedade `perspective` do palco, cujo ponto de fuga é o
         centro da cena, e ela chega até aqui porque a caixa é
         `preserve-3d`. */
      capa.style.transform =
        `translateX(${((1 - abre) * 50).toFixed(2)}%) rotateY(${(suave * 176).toFixed(2)}deg)`;
      /* Ela só apaga no fim, já deitada: some dentro da página em vez de
         evaporar no ar no meio do giro.

         A opacidade vai numa VARIÁVEL que as duas faces consomem, nunca na
         folha. Opacidade menor que 1 é grouping property e achata o
         `preserve-3d`, o que colapsa as duas faces num plano só e faz a
         frente vermelha continuar visível passados os 90 graus em vez de o
         `backface-visibility` cortar. Foi exatamente esse o bug: a 127
         graus a medição achou 37,7% de vermelho onde devia haver papel. */
      capa.style.setProperty("--lv-capa-op",
        String(1 - Math.max(0, Math.min(1, (suave - 0.82) / 0.16))));
      capa.style.visibility = suave > 0.995 ? "hidden" : "visible";

      /* O CORPO. Uma página de largura enquanto fechado, e o recorte abre
         para a segunda conforme a folha sai da frente dela. */
      /* ABERTO, o recorte SAI. Em `inset(0 0% 0 0)` ele corta exatamente na
         caixa de borda: comia a borda de nanquim do lado direito e a
         sombra dura de 14px, e o livro ficava com as laterais brancas. Sem
         recorte o livro volta inteiro, e de quebra some a grouping
         property, então o tombo em `rotateX` volta a ser 3D de verdade. */
      corpo.style.clipPath = abre >= 1
        ? "none"
        : `inset(-40px ${(50 * (1 - abre)).toFixed(2)}% -40px -40px)`;
      corpo.style.transform = `translateX(${((1 - abre) * 25).toFixed(2)}%)`;

      /* O BLOCO. Acompanha o corpo no deslocamento, para o corte das folhas
         ficar no lugar certo enquanto o livro está fechado, e apaga junto
         com a capa: aberto o livro, quem desenha a página é a página. */
      bloco.style.transform = `translateX(${((1 - abre) * 50).toFixed(2)}%)`;
      bloco.style.opacity = String(1 - Math.max(0, Math.min(1, (suave - 0.72) / 0.2)));
    }

    function agenda() { if (!raf) raf = requestAnimationFrame(passo); }
    agenda();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(agenda);
    window.addEventListener("scroll", agenda, { passive: true });
    window.addEventListener("resize", agenda);
    return () => {
      window.removeEventListener("scroll", agenda);
      window.removeEventListener("resize", agenda);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const total = items.length;
  const spreads = Math.ceil(total / 2);
  const spread = Math.floor(par / 2);

  const ir = (d) => {
    if (trava.current) return;
    const n = par + d * 2;
    if (n < 0 || n >= total) return;
    trava.current = true;
    /* a folha que gira carrega o conteúdo que está saindo de cena:
       avançando sai a folha da direita (items[par]), voltando sai a da
       esquerda (items[par + 1]) */
    setVira({ dir: d, folhaDir: items[par], folhaEsq: items[par + 1] });
    setPar(n);
    setTimeout(() => { setVira(null); trava.current = false; }, LV_DUR);
  };

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onKey = (e) => {
      if (!el.contains(document.activeElement)) return;
      /* leitura mangá: a seta ESQUERDA avança, como no volume impresso */
      if (e.key === "ArrowLeft")  { e.preventDefault(); ir(1); }
      if (e.key === "ArrowRight") { e.preventDefault(); ir(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [par, total]);

  const onStart = (e) => { toque.current = e.touches[0].clientX; };
  const onEnd = (e) => {
    if (toque.current == null) return;
    const dx = e.changedTouches[0].clientX - toque.current;
    if (Math.abs(dx) > 46) ir(dx < 0 ? 1 : -1);
    toque.current = null;
  };

  if (!total) return null;

  return (
    <div className="livro">
      {/* a direção do volume, acima do livro. A seta aponta para onde a
          leitura corre, que é o mesmo sentido do `※` da barra do topo e o
          mesmo das setas da navegação: à esquerda avança. */}
      <div className="lv-dir" aria-hidden="true">
        <span className="lv-dir-s">←</span>
        <span className="lv-dir-k">※ {t("da direita para a esquerda", "right to left")}</span>
      </div>

      <div className="lv-stage" ref={stage} onTouchStart={onStart} onTouchEnd={onEnd}>
        <div className="lv-caixa">
        {/* A JANELA existe só para carregar o recorte que faz o livro
            crescer de uma para duas páginas. Separada do `.lv-book`
            porque `clip-path` é grouping property: no próprio livro ela
            forçaria `transform-style: flat` e mataria o 3D da virada de
            página. */}
        <div className="lv-janela" ref={janelaRef}>
        <div className="lv-book">
          <Pagina proj={items[par]} n={par + 1} tinta={LV_TINTAS[par % LV_TINTAS.length]} />
          <Pagina proj={items[par + 1]} n={par + 2} tinta={LV_TINTAS[(par + 1) % LV_TINTAS.length]} />

          {/* a folha que vira: frente é a página que sai, verso é o avesso */}
          {vira ? (
            <span className={`lv-folha ${vira.dir > 0 ? "adiante" : "atras"}`} aria-hidden="true">
              <span className="lv-face lv-frente">
                {/* avançar levanta a folha da ESQUERDA; voltar, a da direita */}
                <Pagina proj={vira.dir > 0 ? vira.folhaEsq : vira.folhaDir} n={0}
                        tinta={LV_TINTAS[(vira.dir > 0 ? par + 1 : par) % LV_TINTAS.length]} />
              </span>
              <span className="lv-face lv-verso"></span>
            </span>
          ) : null}
        </div>
        </div>

        {/* O BLOCO DE PÁGINAS. É o que faz o objeto ter espessura em vez de
            ser um plano girando: fica PARADO embaixo da capa, com o corte
            das folhas na borda solta e a lombada na dobradiça. Quem gira é
            só a capa, e o que ela descobre girando é isto. */}
        <span className="lv-bloco" ref={blocoRef} aria-hidden="true"></span>

        {/* A CAPA. Irmã da janela, não filha: precisa continuar visível
            enquanto o corpo do livro ainda está recortado, e dentro dela
            seria cortada junto. Decorativa para leitor de tela, porque o
            conteúdo real são as páginas, que continuam no DOM e continuam
            anunciadas mesmo com o livro fechado por cima. */}
        <span className="lv-capa" ref={capaRef} aria-hidden="true">
          {/* a frente: a capa do volume */}
          <span className="lv-capa-face lv-capa-frente">
            <span className="lv-capa-tone"></span>
            <span className="lv-capa-linhas"></span>
            <span className="lv-capa-in">
              <span className="lv-capa-vol">{VOL}</span>
              <span className="lv-capa-t">{t("Outras peças", "Other pieces")}</span>
              <span className="lv-capa-n">
                {String(items.length).padStart(2, "0")} {items.length === 1 ? t("peça", "piece") : t("peças", "pieces")}
              </span>
              <span className="lv-capa-rtl">※ {t("da direita para a esquerda", "right to left")}</span>
            </span>
          </span>
          {/* o verso: o lado de dentro da capa, papel com trama. É ele que
              impede a folha de evaporar no meio do giro. */}
          <span className="lv-capa-face lv-capa-verso"></span>
        </span>
        </div>
      </div>

      <div className="lv-nav">
        {/* a seta da esquerda avança: o volume se lê da direita pra esquerda */}
        <button type="button" className="lv-arr" onClick={() => ir(1)}
                disabled={par + 2 >= total}
                aria-label={t("Próximas peças", "Next pieces")}>←</button>
        <span className="lv-count" aria-live="polite">
          {String(spread + 1).padStart(2, "0")} <i>/</i> {String(spreads).padStart(2, "0")}
        </span>
        <button type="button" className="lv-arr" onClick={() => ir(-1)} disabled={par === 0}
                aria-label={t("Peças anteriores", "Previous pieces")}>→</button>
      </div>

      {/* quem tem pressa não vira sete folhas: o índice abre tudo de uma vez */}
      <div className="lv-index-btn">
        <button type="button" className="btn btn-ghost btn-sm" aria-expanded={aberto}
                onClick={() => setAberto((v) => !v)}>
          {aberto ? t("Fechar o índice", "Close the index") : t("Ver o índice inteiro", "See the whole index")}
        </button>
      </div>

      <div className="lv-index" hidden={!aberto}>
        {items.map((x) => {
          const l = pieceLink(x);
          const d = x.destino || "ar";
          const label = d === "proto" ? t("Protótipo", "Prototype")
            : d === "figma" ? "Figma"
            : d === "loja" ? "Play Store"
            : t("No ar", "Live");
          const Tag = l ? "a" : "div";
          return (
            <Tag key={x.id} className="lv-irow" {...(l ? { href: l, target: "_blank", rel: "noreferrer" } : {})}>
              <span className="lv-it">{x.title}</span>
              <span className="lv-ic">{catLabel(x.cat)}</span>
              {l ? <span className="lv-id">{label} ↗</span> : <span className="lv-ic">—</span>}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { BookSlider, Pagina });

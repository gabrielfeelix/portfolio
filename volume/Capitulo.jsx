/* =====================================================================
   VOLUME — Capitulo.jsx
   Page 2: the chapter template (one per project). Tobira-e + TL;DR ·
   Problema · Decisões (decisão→razão) · Solução · Resultado · Próximo.
   ===================================================================== */

/* ---- [1] TOBIRA-E (inverted chapter cover) ---- */
/* each chapter cover gets its own ink loader (deterministic per project) */
const CHAP_ORG = ["split", "twin", "bounce", "merge", "trail", "jelly", "drip", "yin"];
function chapOrg(id) {
  const h = [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return CHAP_ORG[h % CHAP_ORG.length];
}
function Tobira({ chap }) {
  return (
    <section className="cover">
      <div className="cover-linhas" aria-hidden="true"></div>
      <div className="cover-brilho" aria-hidden="true"></div>
      <div className="cover-varre" aria-hidden="true"></div>
      <div className="cover-tone" aria-hidden="true"></div>
      <div className="shell">
        <div className="cover-copy">
          <div className="cover-k">{chap.cap} · {chap.domain}</div>
          {chap.descriptor ? <div className="cover-sub">{chap.descriptor}</div> : null}
          <Brush as="h1" className="cover-title">{chap.title}</Brush>
          <p className="cover-lead">{renderPH(chap.premise)}</p>
          <div className="cover-ficha">
            {chap.surface ? <span>{chap.surface}</span> : null}
            {chap.periodo ? <span>{chap.periodo}</span> : null}
          </div>
          <ProtoLinks links={chap.links} />
          <div className="cover-scroll"><span className="dn">↓</span> {t("Role para ler", "Scroll to read")}</div>
        </div>
        <div className="cover-art">
          {/* a capa de marca manda também aqui: a abertura do capítulo mostra
              a marca sobre a cor dela, e as telas reais vêm no miolo */}
          {chap.capa
            ? <BrandPlate capa={chap.capa} className="bp-cover" />
            : chap.coverTall || chap.cover
              ? <img className="cover-img" src={chap.coverTall || chap.cover} alt={t(`Tela de ${chap.title}`, `${chap.title} screen`)} loading="lazy" draggable="false" />
              : <><MangaPlate dark label={false} /><Organic variant={chapOrg(chap.id)} size={150} className="cover-org" onInk /></>}
        </div>
      </div>
    </section>
  );
}

/* ---- TL;DR strip (+ live link cell when the project is on the air) ---- */
function Tldr({ tldr, links }) {
  const live = links && links.vercel;
  const cell = (l, v) => (
    <div className="cell"><div className="l">{l}</div><div className="v">{renderPH(v)}</div></div>
  );
  // um bloco só. "Papel" estava duplicado com o hero e "O quê" repetia a
  // premissa: sobra o par que o recrutador procura — papel e resultado.
  return (
    <div className={`tldr ${live ? "has-live" : ""}`}>
      {cell(t("Papel", "Role"), tldr.papel)}
      {cell(t("Resultado", "Result"), tldr.resultado)}
      {live ? (
        <div className="cell cell-live">
          <div className="l">{t("Ao vivo", "Live")}</div>
          <div className="v"><a className="tldr-live" href={live} target="_blank" rel="noreferrer">{t("Ver no ar", "See it live")} <span className="ext" aria-hidden="true">↗</span></a></div>
        </div>
      ) : null}
    </div>
  );
}

/* render a string, wrapping any [bracketed] spans as marked placeholders */
function renderPH(str) {
  if (typeof str !== "string") return str;
  const parts = str.split(/(\[[^\]]*\])/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\[[^\]]*\]$/.test(p) ? <PH key={i}>{p.slice(1, -1)}</PH> : <span key={i}>{p}</span>
  );
}

/* ---- LIGHTBOX: a prova em tamanho cheio ------------------------------
   Print pequeno na página serve para o argumento; quem quiser ler a
   interface abre aqui, em resolução cheia, com zoom seguindo o ponteiro.
   Um evento no window liga a figura ao painel, então qualquer bloco novo
   ganha o comportamento sem precisar carregar estado pela árvore. */
function abrirFigura(fig) {
  window.dispatchEvent(new CustomEvent("vol-figura", { detail: fig }));
}

function Lightbox() {
  const [fig, setFig] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [origem, setOrigem] = useState({ x: 50, y: 50 });
  const fechar = useRef(null);
  const anterior = useRef(null);

  useEffect(() => {
    const abre = (e) => {
      anterior.current = document.activeElement;
      setZoom(false); setOrigem({ x: 50, y: 50 }); setFig(e.detail);
    };
    window.addEventListener("vol-figura", abre);
    return () => window.removeEventListener("vol-figura", abre);
  }, []);

  useEffect(() => {
    if (!fig) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); setFig(null); }
      if (e.key === "Tab") { e.preventDefault(); if (fechar.current) fechar.current.focus(); }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (fechar.current) fechar.current.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (anterior.current && anterior.current.focus) anterior.current.focus();
    };
  }, [fig]);

  if (!fig) return null;
  const mover = (e) => {
    if (!zoom) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigem({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div className="lb" role="dialog" aria-modal="true"
         aria-label={fig.alt || t("Imagem ampliada", "Enlarged image")}
         onClick={(e) => { if (e.target === e.currentTarget) setFig(null); }}>
      <button className="lb-x" type="button" ref={fechar} onClick={() => setFig(null)}
              aria-label={t("Fechar", "Close")}>✕</button>
      <figure className="lb-fig">
        <div className={`lb-quadro ${zoom ? "zoom" : ""}`} onMouseMove={mover}
             onClick={() => setZoom((z) => !z)}>
          <img src={fig.src} alt={fig.alt || ""} draggable="false"
               style={zoom ? { transform: "scale(2.4)", transformOrigin: `${origem.x}% ${origem.y}%` } : undefined} />
        </div>
        {fig.legenda ? <figcaption className="lb-cap">{renderPH(fig.legenda)}</figcaption> : null}
        <div className="lb-dica">{zoom ? t("Clique para reduzir · Esc fecha", "Click to zoom out · Esc closes")
                                       : t("Clique na imagem para ampliar · Esc fecha", "Click the image to zoom · Esc closes")}</div>
      </figure>
    </div>
  );
}

/* ---- FIGURA: a prova ao lado da afirmação ---------------------------
   Toda evidência do capítulo passa por aqui: o print quando existe, a
   moldura marcada como pendente quando ainda não subiu. A legenda carrega
   argumento, nunca "tela de checkout": quem só lê as legendas do capítulo
   tem que sair entendendo o case. */
function Figura({ fig, n, ar, className = "" }) {
  if (!fig) return null;
  const legenda = fig.legenda;
  // o quadro estoura quando entra na viewport (o respingo vive no CSS) e,
  // tendo arquivo, abre no lightbox para quem quiser ler os detalhes.
  const [ref, seen] = useReveal({ threshold: 0.22 });
  return (
    <figure className={`fig ${className} ${seen || REDUCED ? "revelada" : ""}`} ref={ref}>
      <div className="fig-frame" style={{ aspectRatio: fig.ar || ar || "16/10" }}>
        {fig.src
          ? <img className="fig-img" src={fig.src} alt={fig.alt || ""} loading="lazy" draggable="false" />
          : <MangaPlate />}
        {fig.src ? <>
          <button className="fig-abrir" type="button" onClick={() => abrirFigura(fig)}
                  aria-label={t("Abrir a imagem em tamanho cheio", "Open the image full size")}></button>
          <span className="fig-lupa">{t("Ampliar", "Zoom")}</span>
        </> : null}
      </div>
      {legenda ? (
        <figcaption className="fig-cap">
          {n ? <i className="fig-n">fig. {String(n).padStart(2, "0")}</i> : null}
          <span>{renderPH(legenda)}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ---- CENA: a figura de linha inteira que corta o texto ---------------
   Entra onde a leitura precisa respirar e ver o estado inteiro da tela.
   Sangra até a borda porque é o equivalente da splash page: o painel que
   ocupa a folha sozinho. */
function Cena({ fig, n }) {
  if (!fig) return null;
  const [ref, seen] = useReveal({ threshold: 0.18 });
  return (
    <div className={`cena bleed fig ${seen || REDUCED ? "revelada" : ""}`} ref={ref}>
      <div className="fig-frame" style={{ aspectRatio: fig.ar || "21/9" }}>
        {fig.src
          ? <img className="fig-img" src={fig.src} alt={fig.alt || ""} loading="lazy" draggable="false" />
          : <MangaPlate />}
        {fig.src ? <>
          <button className="fig-abrir" type="button" onClick={() => abrirFigura(fig)}
                  aria-label={t("Abrir a imagem em tamanho cheio", "Open the image full size")}></button>
          <span className="fig-lupa">{t("Ampliar", "Zoom")}</span>
        </> : null}
      </div>
      {fig.legenda ? (
        <div className="fig-cap">
          {n ? <i className="fig-n">fig. {String(n).padStart(2, "0")}</i> : null}
          <span>{renderPH(fig.legenda)}</span>
        </div>
      ) : null}
    </div>
  );
}

/* "16/9" | "1.78" -> número. O `ar` das figuras vive como string no data. */
function razaoAR(ar) {
  if (typeof ar === "number") return ar;
  const m = String(ar).split("/");
  const v = m.length === 2 ? Number(m[0]) / Number(m[1]) : Number(m[0]);
  return Number.isFinite(v) && v > 0 ? v : 16 / 9;
}

/* ---- CENA-SCROLL: a prova que se abre enquanto a página rola ---------
   A abertura do capítulo não é uma figura entre parágrafos, é a tela que
   a pessoa via antes de tudo. Aqui ela fica presa na viewport enquanto o
   scroll corre e o recorte abre das laterais para o centro: a leitura
   entra no print em vez de passar por ele. Fora isso é a mesma Cena --
   mesma moldura, mesma legenda numerada, mesmo lightbox.

   A revelação é de fora a fora: o quadro entra pequeno, no meio da página,
   e cresce até encostar nas bordas da tela mostrando a página inteira. A
   abertura acontece na primeira metade do trilho -- o resto é a imagem
   aberta, parada, para dar tempo de ler.
   Com prefers-reduced-motion a imagem entra aberta e parada. */
function CenaScroll({ fig, n, altura = 1900, arAberto = "16/9", largIni = 34 }) {
  if (!fig) return null;
  const trilho = useRef(null);
  const [p, setP] = useState(REDUCED ? 1 : 0);
  // a mesma batida de tinta das outras figuras: sem `revelada` a .fig-img
  // fica em opacity 0 (chapter.css) e o quadro sai vazio
  const [refRev, visto] = useReveal({ threshold: 0.05, rootMargin: "0px" });

  useEffect(() => {
    if (REDUCED) return;
    const el = trilho.current; if (!el) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 quando o topo do trilho encosta no topo da tela, 1 quando o
      // trilho acabou de passar: é o intervalo em que a imagem está presa
      const curso = r.height - window.innerHeight;
      if (curso <= 0) { setP(1); return; }
      setP(Math.min(1, Math.max(0, -r.top / curso)));
    };
    const agenda = () => { if (!raf) raf = requestAnimationFrame(medir); };
    medir();
    window.addEventListener("scroll", agenda, { passive: true });
    window.addEventListener("resize", agenda);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agenda);
      window.removeEventListener("resize", agenda);
    };
  }, []);

  // a abertura termina em 70% do trilho: depois disso a imagem fica aberta
  // e parada, que é quando dá para de fato olhar o print
  const a = Math.min(1, p / 0.70);
  const e = 1 - Math.pow(1 - a, 3);   // desacelera na chegada

  // o quadro cresce de verdade -- de `largIni`% da tela até 100%. Antes só
  // o clip-path fechava, e a moldura ja entrava do tamanho da pagina.
  const larg = largIni + (100 - largIni) * e;
  // enquanto pequeno, mostra a primeira dobra (21/9); abrindo, vai até a
  // proporcao do arquivo inteiro
  const ARI = 21 / 9;
  const arf = razaoAR(arAberto);
  const arAtual = ARI + (arf - ARI) * e;
  const escala = 1.06 - 0.06 * e;

  return (
    <div className={`cena-scroll bleed fig ${visto || REDUCED ? "revelada" : ""}`}
         ref={trilho} style={{ height: altura }}>
      <div className="cena-scroll-cola" ref={refRev}>
        <div className="fig-frame cena-scroll-frame"
             style={{ width: `${larg}%`, aspectRatio: arAtual }}>
          {fig.src
            ? <span className="cena-scroll-zoom" style={{ transform: `scale(${escala})` }}>
                <img className="fig-img" src={fig.src} alt={fig.alt || ""} draggable="false" />
              </span>
            : <MangaPlate />}
          {fig.src ? <>
            <button className="fig-abrir" type="button" onClick={() => abrirFigura(fig)}
                    aria-label={t("Abrir a imagem em tamanho cheio", "Open the image full size")}></button>
            <span className="fig-lupa">{t("Ampliar", "Zoom")}</span>
          </> : null}
        </div>
        {/* a legenda viaja junto com o quadro preso: fora do sticky ela
            ficava orfa no topo do trilho, longe da imagem que descreve */}
        {fig.legenda ? (
          <div className="fig-cap cena-scroll-cap">
            {n ? <i className="fig-n">fig. {String(n).padStart(2, "0")}</i> : null}
            <span>{renderPH(fig.legenda)}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ---- ABERTURA: a cena antes do diagnóstico --------------------------
   O capítulo começava no problema já formulado. Faltava o momento em que
   o projeto chega na mesa: o que a empresa vendia, o que pediram e o que
   eu ainda não sabia. É o que dá o que perder no resto da leitura. */
function Abertura({ chap, figN }) {
  const ab = chap.abertura;
  if (!ab) return null;
  const fig = ab.fig && chap.figuras ? chap.figuras[ab.fig] : null;
  return (
    <>
      <Beat>
        <div className="c8 text-col">
          <div className="panel text">
            <div className="beat-k">{ab.k || t("A cena", "The scene")}</div>
            {ab.t ? <Brush as="h2" className="beat-t">{renderPH(ab.t)}</Brush> : null}
            {(ab.p || []).map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
          </div>
        </div>
        {/* a coluna que sobrava ao lado da abertura recebe tinta viva: o
            capítulo abre com movimento antes da primeira prova */}
        <div className="c4 ab-tinta">
          <Organic variant={ab.tinta || "cluster"} size={250} />
        </div>
      </Beat>
      {/* a cena de abertura entra presa no scroll: o recorte abre das
          laterais enquanto a página corre, e a V1 se revela em vez de
          aparecer pronta. As outras figuras seguem em <Cena> normal. */}
      {fig ? <CenaScroll fig={fig} n={figN[ab.fig]} arAberto={fig.ar} /> : null}
    </>
  );
}

/* ---- CITAÇÃO: a frase que virou o projeto ---- */
function Citacao({ dados }) {
  if (!dados || !dados.q) return null;
  return (
    <Beat>
      <blockquote className="citacao">
        <Organic variant={dados.tinta || "merge"} size={150} className="cit-org" onInk />
        <p className="cit-q">{renderPH(dados.q)}</p>
        {dados.fonte ? <div className="cit-f">{renderPH(dados.fonte)}</div> : null}
      </blockquote>
    </Beat>
  );
}

/* ---- O QUE EU RECUSEI ----
   O beat que separa quem escolheu de quem entregou tudo que pediram. Vem
   depois das decisões porque só faz sentido depois de saber o que entrou. */
function Recusei({ dados }) {
  if (!dados || !dados.itens || !dados.itens.length) return null;
  return (
    <Beat>
      <div className="recusei">
        <Organic variant={dados.tinta || "split"} size={120} className="rec-org" />
        <div className="beat-k">{dados.k || t("O que eu recusei", "What I turned down")}</div>
        {dados.p ? <p className="beat-p" style={{ marginTop: 10 }}>{renderPH(dados.p)}</p> : null}
        <ul className="rec-lista">
          {dados.itens.map((it, i) => (
            <li key={i}>
              <h3 className="rec-o">{renderPH(it.o)}</h3>
              <p className="rec-r">{renderPH(it.r)}</p>
            </li>
          ))}
        </ul>
      </div>
    </Beat>
  );
}

/* ---- PAINEL DE NÚMEROS ------------------------------------------------
   Print de dashboard é foto de ferramenta, não argumento. Aqui o dado é
   desenhado: mil pontos de retícula com os poucos que compraram acesos,
   contadores que sobem e barras que crescem quando o bloco entra na tela.
   Cada bloco carrega a sua fonte e o seu período, porque número sem
   procedência em portfólio é decoração. */
function ContaAte({ alvo, decimais = 0, sufixo = "", ligado }) {
  const [n, setN] = useState(ligado ? alvo : 0);
  useEffect(() => {
    if (!ligado) return;
    if (REDUCED) { setN(alvo); return; }
    let raf, inicio;
    const dur = 1100;
    const passo = (t) => {
      if (!inicio) inicio = t;
      const p = Math.min(1, (t - inicio) / dur);
      setN(alvo * (1 - Math.pow(1 - p, 3)));   // desacelera no fim
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [ligado, alvo]);
  const fmt = decimais
    ? n.toLocaleString(LANG === "en" ? "en-US" : "pt-BR", { minimumFractionDigits: decimais, maximumFractionDigits: decimais })
    : Math.round(n).toLocaleString(LANG === "en" ? "en-US" : "pt-BR");
  return <span>{fmt}{sufixo}</span>;
}

/* a retícula de mil: cada ponto é uma pessoa que entrou na loja */
function Mil({ acesos, ligado }) {
  const total = 1000;
  const marcados = useRef(null);
  if (!marcados.current) {
    // posições fixas e espalhadas, para o olho ver que são poucos e onde
    marcados.current = new Set([137, 481, 803].slice(0, Math.max(1, Math.round(acesos))));
  }
  return (
    <div className={`mil ${ligado ? "on" : ""}`} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <i key={i} className={marcados.current.has(i) ? "aceso" : ""}
           style={{ transitionDelay: `${Math.min(700, (i % 50) * 8 + Math.floor(i / 50) * 14)}ms` }}></i>
      ))}
    </div>
  );
}

function Painel({ dados }) {
  if (!dados) return null;
  const [ref, seen] = useReveal({ threshold: 0.25 });
  const on = seen || REDUCED;
  return (
    <Beat>
      <div className="painel" ref={ref} style={{ gridColumn: "1 / -1" }}>
        <div className="pn-topo">
          <div>
            <div className="beat-k">{dados.k}</div>
            <Brush as="h2" className="pn-t">{renderPH(dados.t)}</Brush>
          </div>
          {dados.fonte ? <div className="pn-fonte">{renderPH(dados.fonte)}</div> : null}
        </div>

        <div className="pn-grade">
          <div className="pn-mil">
            <Mil acesos={dados.acesos || 2} ligado={on} />
            <p className="pn-mil-legenda">{renderPH(dados.milLegenda)}</p>
          </div>

          <div className="pn-lado">
            <div className="pn-numeros">
              {(dados.numeros || []).map((num, i) => (
                <div className="pn-num" key={i}>
                  <div className="pn-v">
                    <ContaAte alvo={num.v} decimais={num.d || 0} sufixo={num.s || ""} ligado={on} />
                  </div>
                  <div className="pn-l">{renderPH(num.l)}</div>
                </div>
              ))}
            </div>

            <ul className="pn-barras">
              {(dados.barras || []).map((bar, i) => (
                <li key={i}>
                  <div className="pb-topo">
                    <span className="pb-l">{renderPH(bar.l)}</span>
                    <span className="pb-v"><ContaAte alvo={bar.v} decimais={bar.d || 0} sufixo="%" ligado={on} /></span>
                  </div>
                  <div className="pb-trilho">
                    <span className="pb-fill" style={{ width: on ? `${bar.v}%` : 0, transitionDelay: `${140 + i * 110}ms` }}></span>
                  </div>
                  {bar.n ? <span className="pb-n">{renderPH(bar.n)}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {dados.nota ? <p className="pn-nota">{renderPH(dados.nota)}</p> : null}
      </div>
    </Beat>
  );
}

/* ---- FUNIL: onde a leitura perde gente -------------------------------
   O painel de números diz o tamanho do buraco. Este diz onde ele estava.
   Cada etapa é uma barra que encolhe, e a última carrega a comparação
   com o mercado: sem referência externa, 0,16% é só um número pequeno.
   Como no painel, o dado é desenhado e não fotografado. */
function Funil({ dados }) {
  if (!dados) return null;
  const [ref, seen] = useReveal({ threshold: 0.25 });
  const on = seen || REDUCED;
  const etapas = dados.etapas || [];
  const topo = etapas.length ? etapas[0].v : 1;
  const m = dados.marca;
  return (
    <Beat>
      <div className="painel funil" ref={ref} style={{ gridColumn: "1 / -1" }}>
        <div className="pn-topo">
          <div>
            <div className="beat-k">{dados.k}</div>
            <Brush as="h2" className="beat-t">{renderPH(dados.t)}</Brush>
          </div>
          {dados.fonte ? <div className="pn-fonte">{dados.fonte}</div> : null}
        </div>

        <ol className="fn-etapas">
          {etapas.map((e, i) => {
            const pct = topo ? (e.v / topo) * 100 : 0;
            return (
              <li key={i} className="fn-etapa">
                <div className="fn-cab">
                  <span className="fn-l">{e.l}</span>
                  <span className="fn-v">
                    <ContaAte alvo={e.v} ligado={on} />
                  </span>
                </div>
                <div className="fn-trilho">
                  <i className="fn-preenche" style={{ width: on ? `${pct}%` : 0, transitionDelay: `${i * 110}ms` }} />
                </div>
                {e.n ? <p className="fn-n">{e.n}</p> : null}
              </li>
            );
          })}
        </ol>

        {/* a comparação: o número da loja ao lado do que a categoria faz */}
        {m ? (
          <div className="fn-marca">
            <div className="fn-marca-l">{m.l}</div>
            {/* a régua vai de 0 até o teto da faixa saudável (1,5%): a
                faixa cinza é o intervalo aceitável, o traço é a média da
                categoria e o losango é onde a loja estava */}
            <div className="fn-regua">
              <i className="fn-faixa" style={{ left: `${(m.piso / m.teto) * 100}%`, right: 0 }} />
              <i className="fn-alvo" style={{ left: `${(m.mercado / m.teto) * 100}%` }} />
              <i className="fn-nosso" style={{ left: `${(m.nosso / m.teto) * 100}%`, opacity: on ? 1 : 0 }} />
            </div>
            <div className="fn-marca-legendas">
              <span className="fn-tag nosso">
                <b><ContaAte alvo={m.nosso} decimais={2} ligado={on} />%</b> a loja
              </span>
              <span className="fn-tag mercado"><b>{String(m.mercado).replace(".", ",")}%</b> a categoria</span>
            </div>
            {m.n ? <p className="fn-marca-n">{renderPH(m.n)}</p> : null}
            {m.fonte ? <div className="fn-marca-fonte">{m.fonte}</div> : null}
          </div>
        ) : null}

        {dados.nota ? <p className="pn-nota">{renderPH(dados.nota)}</p> : null}
      </div>
    </Beat>
  );
}

/* ---- GESTO: o que a mão fazia enquanto a pessoa estava lá ------------
   O funil diz onde param; o mapa de calor diz o que fazem. O achado é
   que os dois cliques mais comuns não têm nada a ver com comprar, e é
   isso que a barra deixa ver de uma vez: o ruído em tinta viva, a compra
   quase invisível ao lado. */
function Gesto({ dados }) {
  if (!dados) return null;
  const [ref, seen] = useReveal({ threshold: 0.25 });
  const on = seen || REDUCED;
  const itens = dados.itens || [];
  const topo = itens.length ? Math.max(...itens.map((i) => i.p)) : 1;
  return (
    <Beat>
      <div className="painel gesto" ref={ref} style={{ gridColumn: "1 / -1" }}>
        <div className="pn-topo">
          <div>
            <div className="beat-k">{dados.k}</div>
            <Brush as="h2" className="beat-t">{renderPH(dados.t)}</Brush>
          </div>
          {dados.fonte ? <div className="pn-fonte">{dados.fonte}</div> : null}
        </div>
        <ol className="ge-lista">
          {itens.map((it, i) => (
            <li key={i} className={`ge-item ${it.tipo}`}>
              <div className="ge-cab">
                <span className="ge-el">{it.el}</span>
                <code className="ge-sel">{it.sel}</code>
                <span className="ge-p">{String(it.p).replace(".", ",")}%</span>
              </div>
              <div className="ge-trilho">
                <i className="ge-preenche" style={{ width: on ? `${(it.p / topo) * 100}%` : 0, transitionDelay: `${i * 90}ms` }} />
              </div>
              <span className="ge-v">{it.v} cliques</span>
            </li>
          ))}
        </ol>
        {dados.leitura ? <p className="pn-nota">{renderPH(dados.leitura)}</p> : null}
      </div>
    </Beat>
  );
}

/* ---- BUSCA: o beat que ampliou o escopo do projeto -------------------
   Texto à esquerda, os dois estados da falha à direita. Fica sozinho
   num beat porque é o achado que muda o que o projeto entende por
   "quem compra aqui". */
function Busca({ dados, chap, figN = {} }) {
  if (!dados) return null;
  const figs = (dados.figs || []).map((k) => [k, chap.figuras && chap.figuras[k]]).filter(([, f]) => f);
  return (
    <Beat className="beat-busca">
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{dados.k}</div>
          <Brush as="h2" className="beat-t">{renderPH(dados.t)}</Brush>
          {(dados.p || []).map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
      <div className="c7">
        <div className="mod-figs serie">
          {figs.map(([k, f]) => <Figura key={k} fig={f} n={figN[k]} />)}
        </div>
      </div>
    </Beat>
  );
}

/* ---- MÓDULO EM PASSOS: o argumento que se conta descendo -------------
   Um bloco de texto no topo e quatro telas empilhadas embaixo lê como
   mosaico: quem desce vê prova sem saber o que está provando. Aqui o
   texto fica preso à esquerda e troca quando a figura correspondente
   entra na tela -- a leitura é uma sequência de estados, que é como o
   diagnóstico aconteceu de verdade.
   Sem sticky, ou com motion reduzido, vira a mesma coisa em coluna:
   cada passo com o seu texto logo acima da sua prova. */
function ModuloPassos({ mod, chap, figN = {} }) {
  const passos = (mod.passos || []).filter((s) => s && s.fig);
  if (!passos.length) return null;
  const [ativo, setAtivo] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (REDUCED || !("IntersectionObserver" in window)) return;
    // o passo vira ativo quando a prova dele cruza a faixa central da tela
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          const i = refs.current.indexOf(e.target);
          if (i >= 0) setAtivo(i);
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [passos.length]);

  const p = passos[ativo] || passos[0];
  return (
    <Beat className="mod-passos">
      <div className="c5 text-col">
        <div className="passos-cola">
          <div className="panel text">
            <div className="beat-k">{mod.k}</div>
            <Brush as="h2" className="beat-t">{renderPH(mod.t)}</Brush>
            {(mod.p || []).map((para, j) => <p className="beat-p" key={j}>{renderPH(para)}</p>)}
          </div>
          {/* o trecho que troca: é o mesmo lugar da página, texto novo */}
          <div className="passo-vivo" key={ativo}>
            <div className="passo-k">{p.k}</div>
            <h3 className="passo-t">{renderPH(p.t)}</h3>
            <p className="passo-p">{renderPH(p.p)}</p>
          </div>
          {/* a régua de onde a leitura está na sequência */}
          <ol className="passo-regua" aria-hidden="true">
            {passos.map((_, i) => <li key={i} className={i === ativo ? "aqui" : (i < ativo ? "passou" : "")} />)}
          </ol>
        </div>
      </div>
      <div className="c7">
        <div className="passos-figs">
          {passos.map((s, i) => {
            const f = chap.figuras && chap.figuras[s.fig];
            if (!f) return null;
            return (
              <div className="passo-fig" key={s.fig} ref={(el) => (refs.current[i] = el)}>
                {/* o texto do passo também vem junto no mobile, onde a
                    coluna da esquerda deixa de ser sticky */}
                <div className="passo-movel">
                  <div className="passo-k">{s.k}</div>
                  <h3 className="passo-t">{renderPH(s.t)}</h3>
                  <p className="passo-p">{renderPH(s.p)}</p>
                </div>
                <Figura fig={f} n={figN[s.fig]} />
              </div>
            );
          })}
        </div>
      </div>
    </Beat>
  );
}

/* ---- MÓDULOS: as partes do produto que merecem beat próprio ---------
   Pré-venda, Monte seu PC e o que a V2 ganhou de novo. Cada módulo é um
   argumento com as telas dele ao lado; com mais de uma tela, a coluna vira
   grade e as legendas seguem embaixo de cada uma. */
function Modulos({ chap, figN = {} }) {
  const mods = chap.modulos;
  if (!mods || !mods.length) return null;
  return (
    <>
      {mods.map((m, i) => {
        // o módulo com escolha nunca inverte: a pergunta vem antes das abas
        if (m.caminhos) return <ModuloCaminhos key={i} mod={m} chap={chap} figN={figN} />;
        // o módulo em passos conta uma sequência: texto preso, prova rolando
        if (m.passos) return <ModuloPassos key={i} mod={m} chap={chap} figN={figN} />;
        const figs = (m.figs || []).map((k) => [k, chap.figuras && chap.figuras[k]]).filter(([, f]) => f);
        const grade = figs.length > 1;
        return (
          <Beat key={i} className={i % 2 === 1 ? "rev" : ""}>
            <div className="c5 text-col">
              <div className="panel text">
                <div className="beat-k">{m.k}</div>
                <Brush as="h2" className="beat-t">{renderPH(m.t)}</Brush>
                {(m.p || []).map((para, j) => <p className="beat-p" key={j}>{renderPH(para)}</p>)}
              </div>
            </div>
            <div className="c7">
              {/* série: os estados empilham em coluna, porque a leitura é
                  uma sequência (antes, antes em rede lenta, depois) e não
                  um mosaico de telas soltas */}
              <div className={`mod-figs ${m.serie ? "serie" : (grade ? "grade" : "")}`}>
                {figs.map(([k, f]) => <Figura key={k} fig={f} n={figN[k]} ar={grade ? "16/10" : "16/10"} />)}
              </div>
            </div>
          </Beat>
        );
      })}
    </>
  );
}

/* ---- MÓDULO COM CAMINHOS: a escolha que o próprio produto oferece ----
   Quando o módulo do produto é "escolha um caminho", ler três parágrafos
   seguidos desmonta o argumento. Aqui quem lê escolhe o caminho e vê a
   tela grande dele, com a troca em corte seco: a página faz o que a tela
   que ela está descrevendo faz. Teclado: setas andam entre os caminhos. */
function ModuloCaminhos({ mod, chap, figN = {} }) {
  const caminhos = mod.caminhos || [];
  const [ativo, setAtivo] = useState(0);
  const cam = caminhos[ativo] || {};
  const fig = cam.fig && chap.figuras ? chap.figuras[cam.fig] : null;
  const onKey = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const passo = e.key === "ArrowRight" ? 1 : -1;
    const prox = (ativo + passo + caminhos.length) % caminhos.length;
    setAtivo(prox);
    const alvo = e.currentTarget.parentNode.querySelectorAll(".cam-tab")[prox];
    if (alvo) alvo.focus();
  };
  return (
    <>
      <Beat>
        <div className="c5 text-col">
          <div className="panel text">
            <div className="beat-k">{mod.k}</div>
            <Brush as="h2" className="beat-t">{renderPH(mod.t)}</Brush>
            {(mod.p || []).map((para, j) => <p className="beat-p" key={j}>{renderPH(para)}</p>)}
          </div>
        </div>
        <div className="c7">
          <div className="cam-tabs" role="tablist" aria-label={mod.t}>
            {caminhos.map((c, i) => (
              <button key={i} type="button" role="tab" id={`cam-t-${i}`}
                      className={`cam-tab ${i === ativo ? "on" : ""}`}
                      aria-selected={i === ativo} aria-controls={`cam-p-${i}`}
                      tabIndex={i === ativo ? 0 : -1}
                      onClick={() => setAtivo(i)} onKeyDown={onKey}>
                <span className="cam-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="cam-t">{c.t}</span>
                <span className="cam-para">{c.para}</span>
              </button>
            ))}
          </div>
          <div className="cam-palco" role="tabpanel" id={`cam-p-${ativo}`} aria-labelledby={`cam-t-${ativo}`}>
            {/* sem key variável: o quadro não remonta ao trocar de aba, então
                a troca é seca. O respingo é da entrada na página, não da
                navegação entre caminhos. */}
            <Figura fig={fig} n={figN[cam.fig]} ar="16/10" className="cam-fig" />
            {cam.p ? <p className="cam-p">{renderPH(cam.p)}</p> : null}
          </div>
        </div>
      </Beat>
    </>
  );
}

/* ---- CALENDÁRIO: a data de publicação, rabiscada ---------------------
   Outubro de 2026 desenhado como folha de calendário, com o 26 circulado
   a mão quando o bloco entra na viewport. O rabisco é um path SVG que se
   desenha; com reduced-motion, já nasce desenhado. */
function Calendario({ dados }) {
  if (!dados) return null;
  const [ref, seen] = useReveal({ threshold: 0.4 });
  const semanas = dados.semanas || [];
  const dia = dados.dia;
  return (
      <div className="cal-wrap" ref={ref}>
        <div className={`cal ${seen || REDUCED ? "in" : ""}`}>
          <div className="cal-top">
            <span className="cal-mes">{dados.mes}</span>
            <span className="cal-ano">{dados.ano}</span>
          </div>
          <div className="cal-dow">
            {(dados.dow || []).map((d, i) => <span key={i}>{d}</span>)}
          </div>
          <div className="cal-grid">
            {semanas.map((sem, i) => sem.map((n, j) => (
              <span key={`${i}-${j}`} className={`cal-d ${n === dia ? "hit" : ""} ${n ? "" : "vazio"}`}>
                {n || ""}
                {n === dia ? (
                  <svg className="cal-rabisco" viewBox="0 0 100 74" aria-hidden="true">
                    <path d="M69 15 C 54 5, 26 6, 16 20 C 6 34, 14 55, 34 63 C 55 71, 84 65, 88 48 C 91 34, 78 20, 60 16 C 46 13, 30 17, 22 27" />
                  </svg>
                ) : null}
              </span>
            )))}
          </div>
        </div>
        <div className="cal-legenda">
          <span className="cal-k">{dados.k}</span>
          <p>{renderPH(dados.legenda)}</p>
        </div>
      </div>
  );
}

/* numeração contínua das figuras do capítulo, na ordem de leitura: quem
   cita "fig. 04" no texto está apontando para a mesma imagem que o leitor
   acabou de ver. */
function figOrder(chap) {
  const mapa = {};
  let n = 0;
  const marca = (k) => { if (k && chap.figuras && chap.figuras[k] && !mapa[k]) mapa[k] = ++n; };
  if (chap.abertura) marca(chap.abertura.fig);
  if (chap.problema) marca(chap.problema.fig);
  if (chap.investigacao) marca(chap.investigacao.fig);
  if (chap.busca) (chap.busca.figs || []).forEach(marca);
  (chap.decisoes || []).forEach((d) => { marca(d.fig); marca(d.figExtra); });
  (chap.modulos || []).forEach((m) => {
    (m.figs || []).forEach(marca);
    (m.caminhos || []).forEach((c) => marca(c.fig));
    (m.passos || []).forEach((s) => marca(s.fig));
  });
  return mapa;
}

/* ---- [2] PROBLEMA ----
   The arc-opening panel: the problem title shouted in display type inside
   a thick manga frame, the seal kanji 問 (question) ghosted vertically
   behind. The title lives IN the panel; the text column carries the story. */
function Problema({ chap, figN = {} }) {
  const fig = chap.problema.fig && chap.figuras ? chap.figuras[chap.problema.fig] : null;
  return (
    <>
    <Beat>
      <div className="c7">
        <div className="panel art prob">
          <span className="prob-tone" aria-hidden="true"></span>
          <span className="prob-kanji" lang="ja" translate="no" aria-hidden="true">問題</span>
          <Brush as="h2" className="prob-t">{renderPH(chap.problema.t)}</Brush>
        </div>
      </div>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Problema", "Problem")}</div>
          {chap.problema.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
    </Beat>
    {fig ? (
      <Beat>
        <div style={{ gridColumn: "1 / -1" }}>
          <Figura fig={fig} n={figN[chap.problema.fig]} ar="16/9" />
        </div>
      </Beat>
    ) : null}
    </>
  );
}

/* ---- ANTES E DEPOIS: a cortina arrastável ---------------------------
   O beat mais forte que um redesign tem: a mesma dobra nos dois estados,
   e quem lê move a divisa. Sem arrastar, a cortina revela sozinha uma vez
   ao entrar na viewport (a informação nunca fica só dentro do gesto).
   Teclado: setas movem 4% por vez; reduced-motion nasce em 50% sem animar. */
function AntesDepois({ dados }) {
  if (!dados) return null;
  // o par principal continua sendo antes/depois na raiz; `pares` guarda as
  // outras dobras comparadas. Par sem arquivo entra como moldura pendente,
  // então dá para planejar a comparação antes de ter o print da V1.
  const pares = [
    ...(dados.antes && dados.depois ? [{ antes: dados.antes, depois: dados.depois, rotuloAntes: dados.rotuloAntes, rotuloDepois: dados.rotuloDepois, legenda: dados.legenda }] : []),
    ...(dados.pares || []),
  ];
  if (!pares.length) return null;
  return (
    <div className="ad-wrap">
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("Antes e depois", "Before and after")}</Brush>
        <span className="kicker">{t("arraste a divisa", "drag the divider")}</span>
      </div>
      <div className="ad-seq">
        {pares.map((par, i) => (par.antes && par.depois)
          ? <ADPar key={i} dados={par} />
          : <Figura key={i} className="ad-pendente" ar="16/9"
                    fig={{ legenda: par.legenda || t("Comparação a subir", "Comparison pending") }} />)}
      </div>
    </div>
  );
}

/* um par comparado: a cortina arrastável de uma dobra */
function ADPar({ dados }) {
  const [ref, seen] = useReveal({ threshold: 0.45 });
  const [pos, setPos] = useState(REDUCED ? 50 : 100);   // 100 = só o "antes"
  const [arrastando, setArrastando] = useState(false);
  const tocado = useRef(false);
  const caixa = useRef(null);

  useEffect(() => {
    if (!seen || REDUCED || tocado.current) return;
    // ma de 380ms, depois a cortina corre uma vez até assentar em 50%
    const t = setTimeout(() => { if (!tocado.current) setPos(50); }, 380);
    return () => clearTimeout(t);
  }, [seen]);

  const mover = (clientX) => {
    const el = caixa.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    tocado.current = true;
    setPos(Math.max(0, Math.min(100, p)));
  };
  const onDown = (e) => { setArrastando(true); mover(e.clientX); e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = (e) => { if (arrastando) mover(e.clientX); };
  const onUp   = (e) => { setArrastando(false); try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {} };
  const onKey  = (e) => {
    const passo = e.shiftKey ? 12 : 4;
    if (e.key === "ArrowLeft")  { e.preventDefault(); tocado.current = true; setPos((p) => Math.max(0, p - passo)); }
    if (e.key === "ArrowRight") { e.preventDefault(); tocado.current = true; setPos((p) => Math.min(100, p + passo)); }
    if (e.key === "Home") { e.preventDefault(); tocado.current = true; setPos(0); }
    if (e.key === "End")  { e.preventDefault(); tocado.current = true; setPos(100); }
  };

  const rotA = dados.rotuloAntes || t("Antes", "Before");
  const rotD = dados.rotuloDepois || t("Depois", "After");
  return (
    <div className="ad-par" ref={ref}>
      <div className={`ad-box ${arrastando ? "arrastando" : ""} ${pos < 100 ? "aberto" : ""}`}
           ref={caixa} style={{ "--ad-pos": pos + "%" }}
           onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <img className="ad-img ad-depois" src={dados.depois} alt={t(`${rotD}: a versão nova`, `${rotD}: the new version`)} loading="lazy" draggable="false" />
        <div className="ad-clip">
          <img className="ad-img ad-antes" src={dados.antes} alt={t(`${rotA}: a versão anterior`, `${rotA}: the previous version`)} loading="lazy" draggable="false" />
        </div>
        <span className="ad-tag ad-tag-a" style={{ opacity: pos > 12 ? 1 : 0 }}>{rotA}</span>
        <span className="ad-tag ad-tag-d" style={{ opacity: pos < 88 ? 1 : 0 }}>{rotD}</span>
        <div className="ad-linha" aria-hidden="true"><span className="ad-punho">↔</span></div>
        <input className="ad-range" type="range" min="0" max="100" value={Math.round(pos)}
               onChange={(e) => { tocado.current = true; setPos(+e.target.value); }} onKeyDown={onKey}
               aria-label={t(`Comparar ${rotA} e ${rotD}`, `Compare ${rotA} and ${rotD}`)} />
      </div>
      {dados.legenda ? <p className="ad-legenda">{renderPH(dados.legenda)}</p> : null}
    </div>
  );
}

/* ---- [2.5] COMO INVESTIGUEI ----
   O que separa opinião de decisão. Só aparece nos capítulos que trazem o
   bloco; os achados entram numerados, porque foram eles que viraram corte. */
function Investigacao({ chap, figN = {} }) {
  const inv = chap.investigacao;
  if (!inv) return null;
  const fig = inv.fig && chap.figuras ? chap.figuras[inv.fig] : null;
  return (
    <>
    <Beat>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Como investiguei", "How I investigated")}</div>
          <Brush as="h2" className="beat-t">{renderPH(inv.t)}</Brush>
          {(inv.p || []).map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
        </div>
      </div>
      <div className="c7">
        <div className="panel art inv">
          <span className="inv-kanji" lang="ja" translate="no" aria-hidden="true">調査</span>
          <div className="inv-k">{t("O que apareceu", "What showed up")}</div>
          <ol className="inv-list">
            {(inv.achados || []).map((a, i) => <li key={i}>{renderPH(a)}</li>)}
          </ol>
        </div>
      </div>
    </Beat>
    {fig ? (
      <Beat>
        <div style={{ gridColumn: "1 / -1" }}>
          <Figura fig={fig} n={figN[inv.fig]} ar="16/9" />
        </div>
      </Beat>
    ) : null}
    </>
  );
}

/* ---- [7] O QUE APRENDI — o fecho honesto do capítulo ---- */
function Aprendi({ chap }) {
  const ap = chap.aprendi;
  if (!ap || !ap.p || !ap.p.length) return null;
  return (
    <Beat>
      <div className="aprendi" style={{ gridColumn: "1 / -1" }}>
        <div className="beat-k">{t("O que aprendi", "What I learned")}</div>
        {ap.p.map((para, i) => <p className="apr-p" key={i}>{renderPH(para)}</p>)}
      </div>
    </Beat>
  );
}

/* ---- punctuating SFX ---- */
function SfxBeat({ word }) {
  return (
    <Beat>
      <div className="beat-sfx"><div className="word"><span lang="ja" translate="no">{word}</span><i className="sfx-ro">{sfxRo(word)}</i></div></div>
    </Beat>
  );
}

/* ---- [3] DECISÕES (decisão -> razão) ---- */
function Decisoes({ chap, figN = {} }) {
  return (
    <>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("As decisões", "The decisions")}</Brush>
        <span className="kicker">{t("o porquê de cada corte", "the why behind each cut")}</span>
      </div>
      {/* cada decisão é um beat de largura cheia, alternando o lado do número.
          A grade de cards iguais lia como lista de features; assim lê como
          argumento numerado, que é o que o capítulo está fazendo. */}
      <ol className="dec-seq">
        {chap.decisoes.map((dec, i) => (
          <DecBeat key={i} n={i + 1} dec={dec} par={i % 2 === 1}
                   fig={dec.fig && chap.figuras ? chap.figuras[dec.fig] : null}
                   figN={figN[dec.fig]}
                   figExtra={dec.figExtra && chap.figuras ? chap.figuras[dec.figExtra] : null}
                   figExtraN={figN[dec.figExtra]} />
        ))}
      </ol>
    </>
  );
}

/* um beat de decisão: número grande em editorial, a escolha em display e a
   razão em corpo de leitura. Entra em corte seco quando cruza a viewport. */
function DecBeat({ n, dec, par, fig, figN, figExtra, figExtraN }) {
  const [ref, seen] = useReveal({ threshold: 0.3 });
  return (
    <li ref={ref} className={`dec-beat ${par ? "par" : ""} ${seen ? "in" : ""}`}>
      <div className="db-n" aria-hidden="true">{String(n).padStart(2, "0")}</div>
      <div className="db-copy">
        <h3 className="db-d">{renderPH(dec.d)}</h3>
        <p className="db-r"><i className="db-k">{t("Por quê", "Why")}</i>{renderPH(dec.r)}</p>
      </div>
      {/* a decisão que tem prova mostra a prova aqui mesmo, embaixo do
          argumento, e não num bloco de prints no fim do capítulo */}
      {fig ? (
        <div className={`db-fig ${figExtra ? "dupla" : ""}`}>
          <Figura fig={fig} n={figN} ar="16/10" />
          {figExtra ? <Figura fig={figExtra} n={figExtraN} ar="16/10" /> : null}
        </div>
      ) : null}
      <span className="db-tone" aria-hidden="true"></span>
    </li>
  );
}

/* ---- VOCABULÁRIO — o léxico do produto, ensinado enquanto se lê -------
   Quando a decisão central de um case é fixar uma linguagem comum, a prova
   não é um print: é o próprio vocabulário na tela. Cada termo acende em
   sequência conforme a lista entra na viewport, então quem lê aprende o
   léxico no ritmo da leitura. reduced-motion: já nasce tudo aceso. */
function Vocabulario({ dados }) {
  if (!dados || !dados.termos || !dados.termos.length) return null;
  const [ref, seen] = useReveal({ threshold: 0.3 });
  const [ate, setAte] = useState(REDUCED ? dados.termos.length : 0);
  useEffect(() => {
    if (!seen) return;
    if (REDUCED) { setAte(dados.termos.length); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1; setAte(i);
      if (i >= dados.termos.length) clearInterval(id);
    }, 180);   // o ataque seco da casa
    return () => clearInterval(id);
  }, [seen, dados.termos.length]);

  return (
    <div className="voc" ref={ref}>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{renderPH(dados.t)}</Brush>
        {dados.kicker ? <span className="kicker">{renderPH(dados.kicker)}</span> : null}
      </div>
      <ol className="voc-list">
        {dados.termos.map((termo, i) => (
          <li className={`voc-row ${i < ate ? "on" : ""}`} key={i} style={{ transitionDelay: `${i * 24}ms` }}>
            <span className="voc-marca" aria-hidden="true"></span>
            <span className="voc-nome">{renderPH(termo.n)}</span>
            <span className="voc-sep" aria-hidden="true"></span>
            <span className="voc-def">{renderPH(termo.d)}</span>
          </li>
        ))}
      </ol>
      {dados.nota ? <p className="voc-nota">{renderPH(dados.nota)}</p> : null}
    </div>
  );
}

/* ---- [4] SOLUÇÃO ---- */
function Solucao({ chap }) {
  const shots = chap.solucao.shots || [];
  const legendas = chap.solucao.legendas || [];
  const n = shots.length;
  return (
    <>
      <div className="sec-head" style={{ margin: "0 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("A solução", "The solution")}</Brush>
        <span className="kicker live" style={{ color: "var(--vermilion-ink)" }}>{t("no ar", "live")}</span>
      </div>
      <Beat>
        <div className="c5 text-col">
          <div className="panel text">
            <div className="beat-k">{t("Solução", "Solution")}</div>
            <Brush as="h2" className="beat-t">{renderPH(chap.solucao.t)}</Brush>
            {chap.solucao.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
            <div className="ai-note"><span className="b"></span> {t("Protótipo → produto no ar", "Prototype → product, live")}</div>
            <ProtoLinks links={chap.links} />
          </div>
        </div>
        <div className={n ? "c7" : "c7 sol-vazio"}>
          <div className="sol-grid">
            {/* Todos os painéis têm a mesma medida e a mesma proporção (16:10,
                a dos arquivos), então qualquer quantidade de prints empilha
                sem corte. Antes havia um esquema de spans (c8/c4/wide) que
                espremia o 2º print em 167px e decepava o 3º num 21/9. */}
            {shots.map((sh, i) => {
              // um shot pode ser string (usa a proporção padrão 16:10) ou
              // { src, ar, meia }: `ar` faz o painel nascer na proporção EXATA
              // do arquivo, então print em retrato também cabe sem tarja nem
              // corte; `meia` põe dois lado a lado em vez de largura cheia.
              const src = typeof sh === "string" ? sh : (sh && sh.src);
              const ar = sh && sh.ar;
              const cls = "sol-panel" + (sh && sh.meia ? " meia" : "");
              const cap = legendas[i];
              return (
                <React.Fragment key={i}>
                  <div className={cls} style={ar ? { aspectRatio: ar } : undefined}>
                    {src
                      ? <img className="sol-img" src={src} alt={cap || t(`${chap.title} · tela ${i + 1}`, `${chap.title} · screen ${i + 1}`)} loading="lazy" draggable="false" />
                      : <MangaPlate />}
                  </div>
                  {cap ? <p className="sol-cap" style={{ gridColumn: "1 / -1" }}>{renderPH(cap)}</p> : null}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </Beat>
    </>
  );
}

/* ---- [5] RESULTADO ----
   The payoff beat. The art panel is an inked IMPACT PANEL: the chapter's
   real anchor fact set huge on ink, with the SFX kana ghosted behind —
   the number/fact gets a stage instead of an empty plate. */
function Resultado({ chap }) {
  return (
    <Beat className="rev" hold={380 /* a ma before the reveal */}>
      <div className="c5 text-col">
        <div className="panel text">
          <div className="beat-k">{t("Resultado", "Result")}</div>
          <Brush as="h2" className="beat-t">{renderPH(chap.resultado.t)}</Brush>
          {chap.resultado.p.map((para, i) => <p className="beat-p" key={i}>{renderPH(para)}</p>)}
          {chap.resultado.lista && chap.resultado.lista.length ? (
            <div className="res-lista">
              <div className="rl-k">{chap.resultado.listaK || t("O que vai ser acompanhado", "What will be tracked")}</div>
              <ul>{chap.resultado.lista.map((it, i) => <li key={i}>{renderPH(it)}</li>)}</ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className="c7">
        {/* com data marcada, o painel do resultado é o calendário: a folha
            de outubro diz o que a chapa preta dizia, e diz com a data. */}
        {chap.calendario ? <Calendario dados={chap.calendario} /> : (
          <div className="panel art impact">
            {chap.fact ? (
              <div className="impact-inner">
                <span className="impact-kana" lang="ja" translate="no" aria-hidden="true">{chap.sfx}</span>
                <div className="impact-k">{t("Preto no branco", "In black and white")}</div>
                <div className="impact-t">{chap.fact}</div>
                {chap.links && chap.links.vercel
                  ? <a className="impact-live" href={chap.links.vercel} target="_blank" rel="noreferrer">{t("No ar", "Live")} <span className="ext" aria-hidden="true">↗</span></a>
                  : null}
              </div>
            ) : <MangaPlate />}
          </div>
        )}
      </div>
    </Beat>
  );
}

/* ---- [5.5] O SISTEMA POR TRÁS DO VOLUME (só no CAP. 05) ----
   The strongest seniority signal in this repo is the design system itself:
   tokens, a colour thesis, a spacing scale named after ma (間), a motion
   language and audited a11y. This spread surfaces it as specification. */
const SIS_WASHES = [
  ["--ink", "#0A0A0A", t("tinta", "ink")],
  ["--wash-4", "#38362F", t("sombra", "shade")],
  ["--wash-3", "#635E52", t("meio", "mid")],
  ["--wash-2", "#B4AFA3", t("diluída", "diluted")],
  ["--wash-1", "#DEDAD0", t("véu", "veil")],
  ["--paper", "#F6F3EC", t("papel", "paper")],
];
const SIS_MA = [["ma-1", 8], ["ma-2", 16], ["ma-3", 24], ["ma-4", 40], ["ma-5", 64], ["ma-6", 104]];
function SistemaVolume() {
  return (
    <>
      <div className="sec-head" style={{ margin: "var(--ma-6) 0 var(--ma-3)" }}>
        <Brush as="h2" style={{ fontSize: "var(--t-d2)" }}>{t("O sistema por trás do volume", "The system behind the volume")}</Brush>
        <span className="kicker">{t("extra · a especificação", "extra · the specification")}</span>
      </div>
      <Beat>
        <div className="sis-grid" style={{ gridColumn: "1 / -1" }}>
          <div className="sis">
            <div className="sis-k">{t("Cor é intenção", "Color is intent")}</div>
            <div className="sis-swatches">
              {SIS_WASHES.map(([tk, hex, nm]) => (
                <div className="sw" key={tk}><span className="sw-chip" style={{ background: hex }}></span><span className="sw-n">{nm}</span></div>
              ))}
              <div className="sw"><span className="sw-chip sw-red"></span><span className="sw-n">{t("selo", "seal")}</span></div>
            </div>
            <p className="sis-p">{t("O mundo é tinta sobre papel. O vermelho-selo só aparece na interação, no estado vivo e na assinatura. Nunca é decoração.", "The world is ink on paper. The seal red only appears on interaction, the live state and the signature. Never as decoration.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Tipo com papel definido", "Type with defined roles")}</div>
            <div className="sis-type">
              <span className="st-display">Anton</span>
              <span className="st-cond">{t("OSWALD · rótulos e navegação", "OSWALD · labels and navigation")}</span>
              <span className="st-body">{t("Hanken Grotesk, a voz da leitura.", "Hanken Grotesk, the reading voice.")}</span>
              <span className="st-kana" lang="ja" translate="no">ドン · 墨</span>
            </div>
            <p className="sis-p">{t("Display grita, condensada organiza, humanista lê. O kana é SFX de verdade, com romaji pra quem não lê japonês.", "Display shouts, condensed organizes, humanist reads. The kana is real SFX, with romaji for whoever doesn't read Japanese.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Espaço é ma ", "Space is ma ")}<span lang="ja" translate="no">間</span></div>
            <div className="sis-ma">
              {SIS_MA.map(([n, w]) => (
                <div className="ma-row" key={n}><span className="ma-bar" style={{ width: w }}></span><span className="ma-n">{n}</span></div>
              ))}
            </div>
            <p className="sis-p">{t("O branco é a calha entre painéis: uma pausa, não área a preencher. A escala inteira vive em tokens.", "White space is the gutter between panels: a pause, not an area to fill. The whole scale lives in tokens.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Movimento é corte", "Motion is a cut")}</div>
            <div className="sis-motion" aria-hidden="true"><span className="sm-box"></span></div>
            <p className="sis-p">{t("Anime corta, não flutua: 180ms de ataque seco e um ma de 380ms antes do reveal. Reduced-motion desliga tudo, sem perder conteúdo.", "Anime cuts, it doesn't float: a 180ms dry attack and a 380ms ma before the reveal. Reduced-motion turns it all off, losing no content.")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Acessível de verdade", "Actually accessible")}</div>
            <div className="sis-big">0<span className="sb-s">{t("violações axe", "axe violations")}</span></div>
            <p className="sis-p">{t("Auditado view a view em 3 viewports: foco visível, skip-link, ordem de Tab traçada, contraste AA e o texto rotativo parando sozinho (WCAG 2.2.2).", "Audited view by view in 3 viewports: visible focus, skip link, traced Tab order, AA contrast and the rotating text stopping on its own (WCAG 2.2.2).")}</p>
          </div>
          <div className="sis">
            <div className="sis-k">{t("Dois modos, uma capa", "Two modes, one cover")}</div>
            <div className="sis-modes" aria-hidden="true">
              <span className="md md-paper">A</span>
              <span className="md md-ink">A</span>
            </div>
            <p className="sis-p">{t("O modo tinta ", "Ink mode ")}<span lang="ja" translate="no">墨</span>{t(" troca os polos do mundo e inverte a escala de washes. A capa vermelha não muda: capa é capa.", " swaps the world's poles and inverts the wash scale. The red cover doesn't change: a cover is a cover.")}</p>
          </div>
        </div>
      </Beat>
    </>
  );
}

/* ---- [6] NEXT CHAPTER ----
   A small tankōbon thumb keeps the "turn the page" feeling: B&W at rest,
   colours on hover (colour = interaction). */
function NextChapter({ next, onOpen, onHome }) {
  return (
    <div className="shell">
      <div className="next-chap" onClick={() => onOpen(next.id)} role="button" tabIndex={0}
           onKeyDown={(e) => { if (e.key === "Enter") onOpen(next.id); }}>
        <span className="nc-thumb" aria-hidden="true">
          {/* mesma capa de marca da home: a miniatura mostra a marca, não um
              recorte de print espremido em 3:4 que não se lê */}
          {next.capa
            ? <BrandPlate capa={next.capa} className="bp-thumb" />
            : next.cover
              ? <img src={next.cover} alt="" loading="lazy" draggable="false" />
              : <MangaPlate />}
        </span>
        <div className="nc-copy">
          <div className="nc-k">{t("Próximo capítulo", "Next chapter")} · {next.cap} · {next.domain}</div>
          <div className="nc-t">{next.title}</div>
        </div>
        <div className="nc-arr">→</div>
      </div>
      <div style={{ padding: "var(--ma-4) 0 var(--ma-6)" }}>
        <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr" style={{ display: "inline-block", transform: "scaleX(-1)" }}>→</span> {t("Voltar ao sumário", "Back to contents")}
        </a>
      </div>
    </div>
  );
}

/* ---- the assembled chapter ---- */
function Capitulo({ chap, next, onOpen, onHome, onNav }) {
  useEffect(() => { window.scrollTo(0, 0); }, [chap.id]);
  const figN = figOrder(chap);
  return (
    <main key={chap.id} className="chapter-main">
      <div className="chapter-back">
        <a className="back" href="#" onClick={(e) => { e.preventDefault(); onHome(); }}>
          <span className="arr">←</span> {t("Voltar ao volume", "Back to the volume")}
        </a>
        <span className="cap">{chap.cap} · {VOL}</span>
      </div>

      <Tobira chap={chap} />

      <div className="chapter-body shell">
        <Tldr tldr={chap.tldr} links={chap.links} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Abertura chap={chap} figN={figN} />
        <Problema chap={chap} figN={figN} />
        <Painel dados={chap.painel} />
        {/* o funil diz onde a leitura perdia gente; o gesto, o que a mão
            fazia enquanto isso. Os dois vêm antes da investigação porque
            são o que mandou olhar para onde ela olhou. */}
        <Funil dados={chap.funil} />
        <Gesto dados={chap.gesto} />
        <Investigacao chap={chap} figN={figN} />
        {/* o achado da busca fecha a investigação: é ele que amplia o
            escopo de "corrigir o checkout" para "quem consegue comprar" */}
        <Busca dados={chap.busca} chap={chap} figN={figN} />
        <Citacao dados={chap.citacao} />
        <SfxBeat word={chap.sfx} />
        <Decisoes chap={chap} figN={figN} />
        <div style={{ height: "var(--ma-6)" }}></div>
        <Recusei dados={chap.recusei} />
        <Modulos chap={chap} figN={figN} />
        <Solucao chap={chap} />
        <div style={{ height: "var(--ma-6)" }}></div>
        {chap.vocabulario ? <><div style={{ height: "var(--ma-6)" }}></div><Vocabulario dados={chap.vocabulario} /></> : null}
        {chap.antesDepois ? <><div style={{ height: "var(--ma-6)" }}></div><AntesDepois dados={chap.antesDepois} /></> : null}
        <div style={{ height: "var(--ma-6)" }}></div>
        <Resultado chap={chap} />
        <Aprendi chap={chap} />
        {chap.id === "portfolio" && <SistemaVolume />}
      </div>

      <Lightbox />
      {next && <NextChapter next={next} onOpen={onOpen} onHome={onHome} />}
      <Colofao onNav={onNav} />
    </main>
  );
}

Object.assign(window, { Tobira, Tldr, renderPH, Lightbox, abrirFigura, Figura, Cena, ADPar, Abertura, Citacao, Recusei, Painel, ContaAte, Mil, Modulos, ModuloCaminhos, Calendario, figOrder, Problema, Investigacao, Aprendi, AntesDepois, DecBeat, Vocabulario, SfxBeat, Decisoes, Solucao, Resultado, SistemaVolume, NextChapter, Capitulo });

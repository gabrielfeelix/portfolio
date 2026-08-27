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

/* uma página: só tipografia, o destino real e o espaço da logo */
function Pagina({ proj, n }) {
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
    <span className="lv-pg">
      <span className="lv-topo">
        <span className="lv-cat">{catLabel(proj.cat)}</span>
        <span className="lv-num">{String(n).padStart(3, "0")}</span>
      </span>

      {/* o slot da marca fica declarado e vazio até as logos entrarem */}
      <span className="lv-marca" aria-hidden="true"></span>

      <span className="lv-t">{proj.title}</span>
      <span className="lv-dom">{proj.domain}</span>
      {proj.desc ? <span className="lv-desc">{proj.desc}</span> : null}

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
  const toque = useRef(null);
  const trava = useRef(false);

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
      <div className="lv-stage" ref={stage} onTouchStart={onStart} onTouchEnd={onEnd}>
        <div className="lv-book">
          <Pagina proj={items[par]} n={par + 1} />
          <Pagina proj={items[par + 1]} n={par + 2} />

          {/* a folha que vira: frente é a página que sai, verso é o avesso */}
          {vira ? (
            <span className={`lv-folha ${vira.dir > 0 ? "adiante" : "atras"}`} aria-hidden="true">
              <span className="lv-face lv-frente">
                <Pagina proj={vira.dir > 0 ? vira.folhaDir : vira.folhaEsq} n={0} />
              </span>
              <span className="lv-face lv-verso"></span>
            </span>
          ) : null}
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

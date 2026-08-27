/* =====================================================================
   VOLUME, BookSlider.jsx
   O livro das outras peças. Substitui as tabs por categoria.

   Por que o filtro saiu: ele exigia que o visitante soubesse o que
   procurar ANTES de olhar, e escondia 15 das 18 peças atrás de um clique
   em "SaaS" ou "Mobile". Ninguém chega num portfólio sabendo que quer ver
   desktop. O livro inverte a ordem: mostra uma peça inteira, do tamanho de
   uma página, e deixa virar. Quem tem pressa abre o índice e vê tudo.

   O briefing pedia `@/components/ui/book-slider`, que é componente de
   outro stack (shadcn/Next, com alias de import). Este repo é script
   global transpilado sem bundle, então o livro é escrito aqui, no mesmo
   idioma do resto do volume: sem dependência nova, mesma paleta, mesmo
   traço de nanquim.

   A arte de cada página é SHOT do trabalho — tela real, não capa nem logo.
   `shots` (data.jsx) só existe onde há print no disco; sem ele o quadro
   cai pra `cover`, e sem os dois o MangaPlate assume. Nunca imagem quebrada.
   ===================================================================== */

/* virar página: clique, seta do teclado, e arrasto no toque. Os três
   apontam pro mesmo `ir()` — um só conceito de navegação. */
function BookSlider({ items }) {
  const [i, setI] = useState(0);
  const [turning, setTurning] = useState(false);
  const [aberto, setAberto] = useState(false);
  const stage = useRef(null);
  const toque = useRef(null);

  const total = items.length;
  const p = items[i];

  const ir = (d) => {
    const n = i + d;
    if (n < 0 || n >= total) return;
    setI(n);
    setTurning(true);
    setTimeout(() => setTurning(false), 500);
  };

  /* teclado: só quando o livro está em cena, senão as setas roubam a
     rolagem da página inteira */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onKey = (e) => {
      if (!el.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); ir(1); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); ir(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, total]);

  const onStart = (e) => { toque.current = e.touches[0].clientX; };
  const onEnd = (e) => {
    if (toque.current == null) return;
    const dx = e.changedTouches[0].clientX - toque.current;
    if (Math.abs(dx) > 46) ir(dx < 0 ? 1 : -1);
    toque.current = null;
  };

  if (!total) return null;

  const arte = (p.shots && p.shots[0]) || p.cover || null;
  const live = pieceLink(p);
  const dest = p.destino || "ar";
  const destLabel = dest === "proto" ? t("Ver protótipo", "See prototype")
    : dest === "figma" ? t("Abrir no Figma", "Open in Figma")
    : dest === "loja" ? t("Ver na Play Store", "See on Play Store")
    : t("Ver no ar", "See it live");

  return (
    <div className="livro">
      <div className="lv-stage" ref={stage} onTouchStart={onStart} onTouchEnd={onEnd}>
        <div className="lv-book">
          <div className={`lv-page ${turning ? "turning" : ""}`} key={p.id}>
            <span className="lv-face lv-art">
              {arte
                ? <img className="lv-img" src={arte} alt={t(`Tela de ${p.title}`, `${p.title} screen`)} loading="lazy" draggable="false" />
                : <MangaPlate className="lv-plate" />}
            </span>
            <span className="lv-face lv-side">
              <span className="lv-cat">{catLabel(p.cat)}</span>
              <span className="lv-t">{p.title}</span>
              <span className="lv-dom">{p.domain}</span>
              {p.desc ? <span className="lv-desc">{p.desc}</span> : null}
              {live ? (
                <a className="btn btn-seta lv-go" href={live} target="_blank" rel="noreferrer">
                  <span className="arr" aria-hidden="true">→</span> {destLabel}
                </a>
              ) : (
                <span className="lv-go lv-dom">{t("Ainda sem link público", "No public link yet")}</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="lv-nav">
        <button type="button" className="lv-arr" onClick={() => ir(-1)} disabled={i === 0}
                aria-label={t("Peça anterior", "Previous piece")}>←</button>
        <span className="lv-count" aria-live="polite">
          {String(i + 1).padStart(2, "0")} <i>/</i> {String(total).padStart(2, "0")}
        </span>
        <button type="button" className="lv-arr" onClick={() => ir(1)} disabled={i === total - 1}
                aria-label={t("Próxima peça", "Next piece")}>→</button>
      </div>

      {/* quem tem pressa não vira 18 páginas: o índice abre tudo de uma vez */}
      <div className="lv-index-btn">
        <button type="button" className="btn btn-ghost btn-sm" aria-expanded={aberto}
                onClick={() => setAberto((v) => !v)}>
          {aberto ? t("Fechar o índice", "Close the index") : t("Ver o índice inteiro", "See the whole index")}
        </button>
      </div>

      <div className="lv-index" hidden={!aberto}>
        {items.map((x, n) => {
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

Object.assign(window, { BookSlider });

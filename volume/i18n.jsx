/* =====================================================================
   VOLUME — i18n.jsx  ·  o núcleo de idioma, nos dois idiomas

   Detecta a língua pela URL, expõe `LANG` e `t(pt, en)`, e ajusta o cromo do
   documento que vive fora do React.

   Carregado logo DEPOIS de data.jsx, e a ordem é contrato: os espelhos
   ingleses — que hoje moram em i18n.en.jsx — mutam `CHAPTERS` e `PROJECTS`
   in loco, e quem declara esses dois é data.jsx. São `const` léxicos
   compartilhados entre scripts clássicos, então trocar o que está em
   `window` não alcançaria as referências nuas.

   Trocar de idioma é navegar: a mutação tem de acontecer antes do primeiro
   render, e por isso não existe troca sem carga de página.
   ===================================================================== */
/* O IDIOMA MORA NA URL, e não mais no localStorage.
 *
 * Era localStorage até 31/08, e a troca foi feita por um motivo prático que
 * anula qualquer conveniência: com o idioma guardado no navegador de quem
 * visita, o LINK NÃO CARREGA O IDIOMA. Mandar 4yu.com.br/case/pcyes para um
 * recrutador lá fora abria em português, porque a escolha estava na máquina
 * errada — na do Gabriel, não na de quem recebe. Um site em inglês que não
 * pode ser ENVIADO em inglês não serve para a coisa que ele existe para fazer.
 *
 * De quebra resolve o SEO: dois endereços é o que permite declarar `hreflang`,
 * e sem endereço próprio o Google indexa uma versão só.
 *
 * O prefixo é `/en`. Qualquer outro caminho é português, que é o padrão — o
 * português não ganha prefixo porque é a língua da casa e porque `/pt` mudaria
 * todos os endereços que já estão indexados e circulando por aí. */
const PREFIXO_EN = "/en";
const LANG = (() => {
  try {
    const p = window.location.pathname;
    return (p === PREFIXO_EN || p.indexOf(PREFIXO_EN + "/") === 0) ? "en" : "pt";
  } catch (e) { return "pt"; }
})();
function t(pt, en) { return LANG === "en" ? en : pt; }

/* O caminho sem o prefixo — o endereço "puro" da rota, que é o que o roteador
   da V2 entende. `/en/case/pcyes` e `/case/pcyes` devolvem os dois
   `/case/pcyes`. */
function semPrefixo(caminho) {
  const p = String(caminho || "/");
  if (p === PREFIXO_EN) return "/";
  if (p.indexOf(PREFIXO_EN + "/") === 0) return p.slice(PREFIXO_EN.length) || "/";
  return p;
}

/* O mesmo endereço no outro idioma. */
function comIdioma(caminho, lang) {
  const puro = semPrefixo(caminho);
  if (lang !== "en") return puro;
  return puro === "/" ? PREFIXO_EN : PREFIXO_EN + puro;
}

/* Trocar de idioma é NAVEGAR, e continua sendo carga de página inteira: a
   mutação do conteúdo abaixo acontece antes do primeiro render, e não existe
   trocar sem isso. A diferença é que agora a barra de endereço acompanha, e o
   que a pessoa copiar dali abre no idioma que ela está vendo.

   `hash` e `search` viajam junto: quem está em /#casos e troca de idioma
   continua na dobra dos casos, e não no topo. */
function toggleLang() {
  const alvo = comIdioma(window.location.pathname, LANG === "en" ? "pt" : "en");
  window.location.assign(alvo + window.location.search + window.location.hash);
}

/* document chrome that lives outside React */
document.documentElement.lang = LANG === "en" ? "en" : "pt-BR";
if (LANG === "en") {
  const sk = document.querySelector(".skip-link");
  if (sk) sk.textContent = "Skip to content";
  const bl = document.querySelector("#boot .boot-label");
  if (bl && bl.firstChild) bl.firstChild.textContent = "Opening the volume";
}


/* Os espelhos ingleses saíram deste arquivo em 31/08 e moram em
   volume/i18n.en.jsx — 78 KB que só as páginas em inglês carregam. O porquê
   está lá. Aqui ficou o que vale nos dois idiomas: a detecção pela URL, o
   `t()`, os utilitários de caminho e o cromo de fora do React. */

Object.assign(window, { LANG, t, toggleLang, semPrefixo, comIdioma, PREFIXO_EN });

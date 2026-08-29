/* Adaptador de conteúdo.
 *
 * A V1 termina data.jsx com Object.assign(window, { CHAPTERS, PROJECTS, ... }),
 * então depois que /volume/data.js carrega todo o conteúdo já está em window.
 * A V2 não duplica nem reescreve nada: lê daqui.
 *
 * Se alguma coisa faltar, falha alto e cedo em vez de renderizar meia tela. */

function g(nome) {
  const v = window[nome];
  if (v === undefined) {
    throw new Error(
      `V2: window.${nome} não existe. /volume/data.js carregou depois do app, ` +
      `ou data.jsx parou de publicar essa chave.`
    );
  }
  return v;
}

export const CHAPTERS   = () => g("CHAPTERS");
export const PROJECTS   = () => g("PROJECTS");
export const CASE_ORDER = () => g("CASE_ORDER");
export const PIECE_ORDER = () => (window.PIECE_ORDER || []);
export const PROCESSO   = () => g("PROCESSO");
export const COMPANIES  = () => g("COMPANIES");
export const CERTS      = () => g("CERTS");
export const CONTATO    = () => g("CONTATO");
export const ALL_MARKS  = () => g("ALL_MARKS");
export const AUTOR      = () => g("AUTOR");
export const VOL        = () => g("VOL");

/* Helpers que a V1 já expõe. Chamados por função para nunca congelar o
   resultado: `projTag` depende de LANG, que muda em tempo de execução. */
export const pieceProjects = () => (window.pieceProjects ? window.pieceProjects() : []);
export const projTag   = (p) => (window.projTag ? window.projTag(p) : "");
export const pieceLink = (p) => (window.pieceLink ? window.pieceLink(p) : null);

export function chapterById(id) {
  return CHAPTERS().find((c) => c.id === id) || null;
}

export function projectById(id) {
  return PROJECTS().find((p) => p.id === id) || null;
}

/* Os casos, na ordem que a V1 já definiu, com capítulo e projeto casados. */
export function casos() {
  return CASE_ORDER()
    .map((id) => ({ id, chap: chapterById(id), proj: projectById(id) }))
    .filter((c) => c.chap);
}

export function proximoCaso(id) {
  const ordem = CASE_ORDER();
  const i = ordem.indexOf(id);
  if (i === -1) return null;
  return ordem[(i + 1) % ordem.length];
}

/* Diagnóstico da Fase 0: o que chegou de verdade. */
export function diagnostico() {
  const alvo = ["CHAPTERS", "PROJECTS", "CASE_ORDER", "PROCESSO", "COMPANIES", "CONTATO", "ALL_MARKS"];
  return alvo.map((nome) => {
    const v = window[nome];
    return {
      nome,
      ok: v !== undefined,
      tipo: Array.isArray(v) ? `array(${v.length})` : typeof v,
    };
  });
}

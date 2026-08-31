import { t } from "./i18n.js";
/* As ferramentas da dobra 04 da /sobre.
 *
 * A lista tem duas metades, e a ordem diz qual é qual. As seis primeiras
 * aparecem escritas em volume/data.jsx, nos `skills` das empresas ou no corpo
 * de um capítulo: são as que os casos provam. As sete seguintes são as que eu
 * sei usar e uso no dia a dia, e entram declaradas, não provadas. A ordem é a
 * única coisa que separa as duas coisas — nenhuma etiqueta, porque etiqueta
 * de "avançado/intermediário" em ferramenta é ruído.
 *
 * A forma é um quadrado por ferramenta, com a marca de verdade dentro. Em
 * repouso ela é preto e branco (`filter: grayscale`), e a cor oficial só
 * chega no hover — é a mesma troca do `.nc-thumb` da V1, e é por isso que
 * `hex` existe: ele tinge a borda e o fundo do quadrado, não a marca.
 *
 * `arquivo` aponta para volume/assets/ferramentas/, onde cada marca foi
 * baixada da fonte mais oficial que existia publicamente. Quem tem assinatura
 * horizontal entra pela versão `-simbolo`, que é a única que fecha em
 * quadrado. Ver o README.txt da pasta para a procedência de cada arquivo.
 *
 * Sobre o Clarity: é o único raster da lista, porque a Microsoft não publica
 * o vetor em lugar nenhum e o maior tamanho que existe é o favicon de 256px.
 *
 * O uso das marcas aqui é nominativo — dizer com o que eu trabalho. Cada uma
 * continua sendo de quem é dela.
 */

const P = "/volume/assets/ferramentas/";

export const FERRAMENTAS = [
  /* ---- as que os casos provam ---- */
  { id: "figma",     nome: "Figma",       arquivo: P + "figma.svg",             hex: "#F24E1E", nota: t("Onde tudo começa", "Where everything starts") },
  { id: "magento",   nome: "Magento",     arquivo: P + "magento-simbolo.svg",   hex: "#EE672F", nota: t("Implementação no PCYES e na Odex", "Implementation at PCYES and Odex") },
  { id: "rd",        nome: "RD Station",  arquivo: P + "rdstation-simbolo.svg", hex: "#19C1CE", nota: t("Esteira de lead e régua por segmento", "Lead pipeline and cadence by segment") },
  { id: "ga4",       nome: "GA4",         arquivo: P + "ga4.svg",               hex: "#E37400", nota: t("O funil do PCYES", "The PCYES funnel") },
  { id: "clarity",   nome: "Clarity",     arquivo: P + "clarity.png",           hex: "#0F6CBD", nota: t("Gravação de sessão", "Session recordings") },
  { id: "trello",    nome: "Trello",      arquivo: P + "trello.svg",            hex: "#0052CC", nota: t("Backlog e ritual de squad", "Backlog and squad rituals") },

  /* ---- as que eu uso e os casos não citam ---- */
  { id: "jira",      nome: "Jira",        arquivo: P + "jira.svg",              hex: "#1868DB", nota: t("Backlog e sprint", "Backlog and sprints") },
  { id: "vscode",    nome: "VS Code",     arquivo: P + "vscode.svg",            hex: "#007ACC", nota: t("Onde o protótipo vira código", "Where the prototype becomes code") },
  { id: "claude",    nome: "Claude",      arquivo: P + "claude.svg",            hex: "#D97757", nota: t("Par de trabalho", "Pair work") },
  { id: "antigrav",  nome: "Antigravity", arquivo: P + "antigravity.svg",       hex: "#4285F4", nota: t("Protótipo em código", "Prototyping in code") },
  { id: "premiere",  nome: "Premiere",    arquivo: P + "premiere.svg",          hex: "#9999FF", nota: t("Edição de vídeo", "Video editing") },
  { id: "ppt",       nome: "PowerPoint",  arquivo: P + "powerpoint.svg",        hex: "#D24726", nota: t("Apresentação para stakeholder", "Stakeholder decks") },
  { id: "excel",     nome: "Excel",       arquivo: P + "excel.svg",             hex: "#217346", nota: t("Planilha e cruzamento de dado", "Spreadsheets and cross-checking data") },
];

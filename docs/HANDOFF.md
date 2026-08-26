# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Dir: `/home/gabrielbarbosa/dev/gabriel/portfolio`
- Repo: github.com/gabrielfeelix/portfolio · push na `main` = auto-deploy Vercel
- No ar: https://portfolio-volume.vercel.app

> Este arquivo é relido a cada sessão, então guarda só o que **muda o que
> você vai fazer**: regras, armadilhas que custaram retrabalho, decisões já
> fechadas e o que está pendente. O histórico de features entregues está no
> `git log`, que é fonte melhor. Ao terminar uma rodada, prefira **substituir**
> uma seção a empilhar outra.

---

## Arquitetura (leia antes de editar)

- `volume/*.jsx` são **scripts clássicos** que compartilham estado via `window`. **Não há import/export.**
- `build.mjs` (esbuild) transpila cada jsx individualmente (`bundle:false`, **nunca** `minifyIdentifiers` — os nomes de topo são a API entre arquivos) → `dist/`, vendoriza React 18, copia assets, gera `dist/index.html`.
- Ordem dos scripts importa: tweaks-panel → data → i18n → organic → cursor → RevealMask → Capa → Capitulo → Processo → Posfacio → EmpresaPage → app.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits terminam com `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`. Mensagens em português, no tom dos commits anteriores.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`. Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`, `i18n.jsx`) é normal.

## Regras duras

- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA". Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código pode.
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no Posfácio, uma razão no Rodapé. Não re-adicionar.
- Outros repos em `~/dev/` são **somente leitura**. Cópia só na direção projeto → portfólio.
- **Não confie nestas notas: valide.** Rode o axe, tire screenshot e dê `Read` no PNG antes de dizer que está bom. Teste teclado de verdade.

## Ferramentas

**Playwright** — use `~/.npm/_npx/1ac161d228dd2210/node_modules/playwright`. Chromium do cache em `~/.cache/ms-playwright`. Funciona direto, sem `LD_LIBRARY_PATH` (a receita antiga de `dpkg -x` não é mais necessária).

- Servir o build: `npm run dev` (cai em outra porta se a 5173 estiver ocupada; veja o log).
- **Unity WebGL (VLibras e afins) só renderiza em `headless:false`** via WSLg (`DISPLAY=:0`). Leva ~60s e o canvas vive num shadow root, então `document.querySelector` não acha — sonde dentro do `shadowRoot` ou simplesmente espere e capture.
- Sempre dê `Read` no PNG. Build que passa não prova que a tela está certa: nesta rodada o sticky estava quebrado com o build verde.

**Figma MCP** — funciona. Arquivo PCYES V2 DS: key `A0Zg3I15KcYI82zZocmyjD`. `get_metadata` puxa a árvore por `nodeId` sem seleção; `get_variable_defs` e `get_screenshot` exigem o node selecionado no Figma desktop.

**Memória do projeto** em `~/.claude/projects/-home-gabrielbarbosa-dev-gabriel-portfolio/memory/`. Leia.

## Padrões do capítulo (o idioma da página)

- **Dado é desenhado, não fotografado.** Print de dashboard é foto de ferramenta; o número desenhado é argumento. Ver `Painel`, `Funil` e `Gesto` em `Capitulo.jsx`.
- **Toda figura carrega o argumento na legenda**, não a descrição da tela. Quem lê só as legendas tem que sair entendendo o case.
- **Moldura sem `src` vira `MangaPlate`** ("print a subir"): honesto, e não abre buraco no layout.
- Números precisam de procedência. Todo painel tem `fonte` e, quando a amostra é curta, uma `nota` dizendo o que ela sustenta e o que não sustenta.

### Armadilhas de `position: sticky` neste projeto

Custaram uma rodada inteira de retrabalho. As três agem juntas:

1. `.beat` tem `align-items: center`, que **centraliza a coluna curta** e a faz começar milhares de px abaixo da coluna alta. Corrija com `align-items: stretch` no módulo.
2. Sticky **precisa de um pai mais alto que ele** pra ter trilho por onde correr. Sem isso a coluna sobe junto com o scroll. Use `.text-col { align-self: stretch }`.
3. `.beat .panel` nasce `opacity: 0` e só acende com a classe `.in`. Numa coluna presa, essa faixa já passou e o conteúdo **some**. Force `opacity: 1` no módulo.

## Decisões fechadas (não relitigar)

- **Coverflow**: as capas laterais esmaecidas violam contraste no axe. Gabriel decidiu (2026-05-29) **aceitar** — é preview periférico decorativo e a capa focada carrega o texto legível. Exceção consciente à WCAG 1.4.3. Não mexer.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Onde entra o Design System** (2026-08-26): depois das Decisões, antes dos Módulos. Nunca no começo. O argumento é "antes de desenhar 40 telas, construí o vocabulário", então o DS chega como resposta a um problema já posto e cada tela vira prova de que o sistema funciona.
- **Profundidade do DS**: "sistema em uso", não catálogo de swatches. Mostrar token semântico funcionando (mesmo componente em dark/light; cor com função: verde = compra, laranja = pré-venda, dourado = Coin). O argumento: *a V1 tinha cores; a V2 tem um sistema que sabe o que cada cor faz*. `ink-muted` não é cinza, é o papel "texto secundário", e vira sozinho quando o tema flipa.
- **Índice do capítulo** (2026-08-26): variante **LISTA** escolhida entre três protótipos (lombada fina, lista com títulos, fina que expande no hover). As outras duas e o seletor **já foram removidos** — não reintroduzir. Ele fica na margem esquerda e **o conteúdo não estreita pra abrir lugar**: uma versão em `grid` que dividia a tela foi recusada.

## Pendente

**1. Índice só aparece em 1700px+.** O `.shell` trava em 1240px, então abaixo disso a margem livre (menos de 100px de cada lado) não comporta os 236px do índice sem espremer a leitura ou passar por cima dela. **Na tela do Gabriel (1440px) o índice não aparece.** Decisão pendente dele: aceitar assim, ou estreitar o conteúdo em 1440 pra abrir lugar. Não mexer sem ele decidir.

**2. Cinco violações de contraste pré-existentes no capítulo.** Confirmadas contra baseline limpo (`git stash`), não são regressão desta rodada: `.cit-f > span` e `.cam-n` (#e4231b sobre #0a0a0a = 4,29:1, precisa 4,5) e `.db-n` / `.cam-n` claro (#b4afa3 sobre #f6f3ec = 1,97:1). O padrão de correção já existe no repo: trocar `--vermilion` por `--vermilion-ink` e `--wash-2` por `--wash-3`. Ficaram fora de escopo de propósito.

**3. Antes/depois de um componente real (opcional).** O DS prova sistema em cima de token. Faltaria provar em cima de uma tela: card de produto da V1 ao lado do da V2. Não há documentação de token da V1 em lugar nenhum, então o enquadramento honesto é "a V1 não tinha sistema", não inventar números da V1.

**4. Prints que só o Gabriel pode dar.** As molduras já existem marcadas como pendentes em `data.jsx`:

| Chave | O que é |
|---|---|
| `buscaMouse` | V1 buscando "mouse" e devolvendo mousepad na frente |
| `buscaMause` | V1 buscando "mause" e devolvendo tela vazia |
| `buscaV2` | V2 sugerindo produtos e termos antes de digitar |
| `popup` | Pop-up da V2 aparecendo após 15% de rolagem |

Ele mostrou os dois primeiros no chat, mas imagem de chat não serve: precisa de **arquivo em disco**. Falta também o FigJam da análise inicial (10 artefatos: mapa do site, inventário de telas, personas, jornada, fluxos, taxonomia, microcopy, auditoria heurística, service blueprint, wireflows) em resolução alta.

**5. Conteúdo de outros capítulos.** Traxium sem print (ele tem em casa). IMMO sem logo (`logo: null` em `data.jsx:755`) — ele vai mandar o Figma. Um `src: null` restante no par mobile do PCYES (`data.jsx`, o segundo shot da biblioteca do design system).

**6. Quirk pré-existente, fora de escopo.** Ao navegar pra um capítulo a partir de uma posição rolada, a pill do nav começa escondida até rolar pra cima. Mexer só com cuidado: o Nav é comportamento sensível.

## Estado do capítulo PCYES

O mais desenvolvido do volume. A leitura hoje:

abertura → problema → painel de números → funil → gesto → investigação → busca → citação → decisões → recusei → **design system** → módulos → solução → antes/depois → resultado → aprendi

São 15 seções, e é o que o índice da esquerda lista.

Três beats usam dado desenhado (nenhum é print de dashboard):

- **Funil**: 1.705 na home → 27 no checkout. Régua comparando os 0,16% da loja com 1,1% da categoria (faixa saudável 0,8–1,5%, [Prax 2025](https://www.prax.ai/blog/benchmark-taxa-de-conversao), mais de mil e-commerces brasileiros).
- **Gesto**: mapa de calor. 182 cliques em fechar o pop-up contra 5 em comprar.
- **Busca**: o achado que ampliou o escopo. "mause" devolvia tela vazia, "mouse" devolvia mousepad. O argumento central é **letramento**: exigir ortografia exata numa loja de hardware escolhe um público e dispensa o resto.

Os dois primeiros sustentam duas decisões da V2, ambas rastreáveis ao dado: pop-up só após 15% de rolagem, e busca tolerante a erro com ranqueamento e termos sugeridos.

Dois componentes de scroll, ambos em `Capitulo.jsx`:

- **`CenaScroll`** — a cena de abertura entra num quadro pequeno (34% da tela) que cresce até a página inteira. Trilho de 1900px, abertura completa em 70% dele. Calibre por `altura` e `largIni`.
- **`ModuloPassos`** — texto preso à esquerda que troca quando cada prova cruza o meio da tela (IntersectionObserver, `rootMargin: -45%`), com régua de progresso. No mobile o sticky solta e o texto vai acima de cada figura. Dados em `modulos[].passos[{k,t,p,fig}]`.

### O beat do Design System (`Sistema`, 2026-08-26)

Entra entre `Recusei` e `Modulos`: o vocabulário vem antes das telas, então tudo que vem depois lê como prova. Dados em `chapter.sistema` (`data.jsx`), inglês em `i18n.jsx`. **Nada é print** — as amostras são cor renderizada em elemento, no idioma dos beats de dado desenhado.

Primeira dobra, a cor:

- **`escada`** — o mesmo token nos dois temas, lado a lado. A leitura horizontal é o argumento: valor muda, papel não.
- **`funcoes`** — cor amarrada a pergunta do cliente (comprar, economizar, esperar, saldo).
- **`caso`** — o verde de economia guarda dois valores (#15803d claro 5,02:1, #4ade80 escuro 11,08:1) justamente para não trocar de papel.

Abaixo, as outras fundações (`CurvaMotion`, `Tipografia`, `EspacoRaio`, `Derivado`):

- **Motion** — a curva `[0.16,1,0.3,1]` em SVG, com um ponto que percorre o próprio path (`offset-path`) contra a diagonal linear tracejada. `pathLength="1"` é **atributo do SVG**, não CSS, senão o desenho do traço não funciona.
- **Tipografia** — Figtree/Inter, escala 80/48/40/32/16 em tamanho real. O h2 é o único em light (300), e isso é decisão, não acidente.
- **Espaço e raio** — ritmo 56/88/128/168 em barra proporcional com a compressão mobile (40/56/72/96) ao lado; 6 raios com o uso escrito.
- **`Derivado`** — o fecho: o card de produto **não guarda cor nenhuma**. O fundo é `rgba(var(--foreground-rgb), .10 → .03)`, então deriva do tema. É a diferença entre paleta e sistema.

**Fonte dos valores:** `/home/gabrielbarbosa/dev/v3-codigo-fonte/src/styles/theme.css` (protótipo, **somente leitura**). De lá saíram 239 tokens, 69 componentes, a sombra copiada em 43 lugares, e os comentários que já documentam as razões de contraste. O Figma expõe **só a página Cover** pela API (`get_metadata` sem nodeId lista as páginas); o resto exige seleção no desktop, então o arquivo de tema é a fonte melhor.

### O índice do capítulo (`IndiceCapitulo`)

Lista agrupada em atos, à esquerda. **Derivada do dado** (`indiceDo` + a constante `ATOS`): ato sem seção some, então serve o volume inteiro sem manutenção por capítulo. Âncoras via `<Sec id>`, que só dá endereço e alvo de foco.

- **Sticky, não fixed.** Mora dentro de `.chapter-body`, então aparece depois da capa e sai quando o capítulo acaba.
- **Não divide a tela.** `height: 0` + `transform: translateX(...)` põe ele na margem sem ocupar coluna: a leitura continua centrada e na largura de antes. Uma tentativa anterior usou `grid-template-columns` e **espremeu o conteúdo** — o Gabriel recusou. Não repetir.
- **Ativo por scroll**, medido na faixa de 34% da tela (a última seção cujo topo já passou). IO puro fazia seção alta e baixa disputarem e o marcador piscava.
- O traço vermelho do ativo **cresce a partir do centro** (`height` de 0 a 20px), então trocar de seção lê como movimento contínuo.

### Armadilhas desta rodada (custaram retrabalho)

1. **`.sis-` já era namespace do `SistemaVolume`** (`app.css`, 9 classes). A colisão em `.sis-motion` deu `display:flex; height:56px` no meu painel e ele **colapsou** — build verde, tela quebrada. Prefixo virou `ds-`. Antes de criar prefixo novo, `grep` no `app.css`.
2. **`opacity` sobre `--fg-2` reprova no axe.** Aconteceu duas vezes: 2,93:1 no painel que argumenta sobre contraste, e 3,4:1 nos números do índice. Texto de apoio leva **cor neutra explícita**, nunca opacidade.
3. **Deletar bloco por índice de string come vizinho.** Ao remover o seletor de variantes, o `function Sec` foi junto e a página caiu em `Sec is not defined` (o ErrorBoundary segurou, por isso não ficou em branco). Conferir o que sobrou depois de cortar.
4. **Cena full bleed passa por cima do índice.** `.cena-scroll` sangra em 100vw; o teto dela agora é a coluna livre à direita da lista (`@media min-width: 1700px`).

### Validação feita

axe **0 violação** no que foi construído (seção de DS + índice), em 1920/1700/1440/768/390, modo papel e tinta, PT e EN. Sem elemento focável novo no índice além dos links. Hierarquia: H2 da seção, H3 nos sub-painéis. As 5 violações que sobram no capítulo são pré-existentes (ver Pendente 2).

## Planos antigos

`docs/superpowers/plans/` guarda os planos de 2026-05-29 (build/deploy, a11y, integração de conteúdo). Histórico, não roteiro.

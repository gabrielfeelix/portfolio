# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Dir: `/home/gabrielbarbosa/dev/gabriel/portfolio`
- Repo: github.com/gabrielfeelix/portfolio · push na `main` = auto-deploy Vercel
- No ar: https://portfolio-volume.vercel.app

**A auditoria do portfólio está em `docs/AUDITORIA-PORTFOLIO.md`**: veredito
de triagem, o que está bom, o que está fraco por impacto, e o plano de
revisão do PCYES em quatro atos com ordem de execução. É de lá que sai o
próximo trabalho, e o registro de execução no fim dele diz o que já caiu.

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
- **Desde `f01e90b`:** os scripts vão com `defer` (preserva a ordem, e por isso o contrato de `window` continua valendo) e os cinco CSS do volume são **concatenados e minificados** num arquivo só, na ordem `colors_and_type` primeiro, `app` e `organic` por último. `Capitulo.js` e `EmpresaPage.js` **saem do carregamento inicial** e chegam quando a rota pede, então `renderPH` mora em `data.jsx` (não em `Capitulo.jsx`): a home usa e cairia com `renderPH is not defined`.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits terminam com `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`. Mensagens em português, no tom dos commits anteriores.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`. Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`, `i18n.jsx`) é normal.

## Regras duras

- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA". Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código pode.
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no Posfácio, uma razão no Rodapé. Não re-adicionar.
- Outros repos em `~/dev/` são **somente leitura**. Cópia só na direção projeto → portfólio.
- **Não confie nestas notas: valide.** Rode o axe e meça na página servida antes de dizer que está bom. Teste teclado de verdade.
- **Screenshot aqui mede pouco e engana.** `.beat .panel` nasce `opacity: 0`, `CenaScroll` cresce ao longo de 1900px de trilho e `ModuloPassos` troca o texto em meio à rolagem: print pega estado de transição, que parece quebrado mesmo quando está certo. Para verificar, **meça no DOM** (`getComputedStyle`, `getBoundingClientRect`, contagem de elemento, contraste calculado), não por imagem. Julgamento visual é do Gabriel, na tela dele.

## Ferramentas

**Playwright** — use `~/.npm/_npx/1ac161d228dd2210/node_modules/playwright`. Chromium do cache em `~/.cache/ms-playwright`. Funciona direto, sem `LD_LIBRARY_PATH` (a receita antiga de `dpkg -x` não é mais necessária).

- Servir o build: **prefira `python3 -m http.server <porta> --bind 127.0.0.1` de dentro de `dist/`**, com uma porta que você conferiu livre (`ss -ltn | grep :<porta>`). O `npm run dev` escolhe porta sozinho e, quando 5173/5174 já estão tomadas por outra sessão, o job morre sem aviso: aconteceu nesta rodada e o agente ficou "rodando" sem nunca ter servido nada.
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
- **PCYES é o capítulo principal** (2026-08-26, decisão do Gabriel): é o mais longo, o mais medido e o único com dado de comportamento. **Continua Cap. 01** e o sumário marca isso com o selo "Capítulo principal" (`chap.principal` em `data.jsx`, `.rvm-main` em `RevealMask.jsx`). Sem a marca, o leitor gasta 16 beats para descobrir sozinho e quem abre por outro capítulo forma opinião pelo case mais curto.
- **`fact` ancora em efeito, não em entrega** (2026-08-26): particípio ("caminho encurtado", "checkout reconstruído") descreve o que foi feito. O PCYES não tem número porque publica em outubro, então ancora no que já é verificável: a direção proposta contrariava o briefing e foi a aprovada. O padrão de referência é o Locar Mais, que troca número ausente por **mudança de comportamento verificável**. **Não inventar número para o Locar Mais.**
- **Índice do capítulo** (2026-08-26): variante **LISTA** escolhida entre três protótipos (lombada fina, lista com títulos, fina que expande no hover). As outras duas e o seletor **já foram removidos** — não reintroduzir. Ele fica na margem esquerda e **o conteúdo não estreita pra abrir lugar**: uma versão em `grid` que dividia a tela foi recusada.

## Pendente

> Itens 1 e 2 da rodada anterior (índice em 1440, cinco violações de
> contraste) foram **resolvidos** em `e45aca3`. Não reabrir.

> A **reordenação do PCYES foi feita** em `c3112ef` (Rodada 2). Não
> reabrir: a ordem em quatro atos, as 4 âncoras sem figura e o módulo
> "O acabamento" são decisão executada e medida. O próximo trabalho é a
> **Rodada 3 (os atalhos)** em `docs/AUDITORIA-PORTFOLIO.md`: títulos de
> ato no índice, que é o nível 2 de leitura (3 minutos) e hoje não existe.

**1. O que a reordenação deixou pendente.** Duas coisas, as duas
dependendo de material:

- `buscaV2` e `popup` agora são **passos 1 e 2** do módulo "O acabamento"
  e caem em `MangaPlate` até o print subir. São os dois primeiros passos
  de um módulo de nove, então é o buraco mais visível do capítulo hoje.
- A figura `marca` está declarada em `chap.figuras` e **não é usada por
  ninguém** (já era assim antes desta rodada). Ou entra em algum lugar, ou
  sai do `data.jsx`.

**2. Prints que só o Gabriel pode dar.** Molduras já marcadas como
pendentes em `data.jsx` (sem `src`, caem em `MangaPlate`):

| Chave | O que é | Prioridade |
|---|---|---|
| `buscaMouse` | V1 buscando "mouse" e devolvendo mousepad na frente | alta |
| `buscaMause` | V1 buscando "mause" e devolvendo tela vazia | alta |
| `buscaV2` | V2 sugerindo produtos e termos antes de digitar | média |
| `popup` | Pop-up da V2 aparecendo após 15% de rolagem | média |

As duas primeiras sustentam o achado da busca, que é o melhor momento do
melhor case. Imagem de chat não serve: precisa de **arquivo em disco**.
Ele já combinou que entrega depois da reordenação.

**3. FigJam: NÃO despejar os 10 artefatos.** Decisão da auditoria. O
capítulo já tem 16 beats e o Ato I/II já é denso. Critério para um
artefato entrar: **mudou uma decisão?** Se sim, entra junto da decisão
que mudou; se não, fica fora. Os que não entram viram **uma figura só**
em `investigacao` (vista do FigJam inteiro), com legenda que argumenta
("dez artefatos antes da primeira tela"), não dez beats. Quais mudaram
decisão é resposta do Gabriel, ainda pendente.

**4. Os outros capítulos** (depois do PCYES, Rodada 5 da auditoria):
promover o resultado do Oderço (a API do RD Station que eliminou um
sistema de três está enterrada no 3º parágrafo) e inverter a abertura do
Odex (hoje pede desculpa antes de argumentar).

**5. Antes/depois de um componente real (opcional).** O DS prova sistema
em cima de token; faltaria provar em cima de tela: card de produto da V1
ao lado do da V2. Não há documentação de token da V1, então o
enquadramento honesto é "a V1 não tinha sistema", não inventar números.

**6. Conteúdo de outros capítulos.** Traxium sem print (ele tem em casa).
IMMO sem logo (`logo: null` em `data.jsx`) — ele vai mandar o Figma.

**7. Quirk pré-existente, fora de escopo.** Ao navegar pra um capítulo a
partir de uma posição rolada, a pill do nav começa escondida até rolar
pra cima. Mexer só com cuidado: o Nav é comportamento sensível.

## Estado do capítulo PCYES

O mais desenvolvido do volume. Desde `c3112ef` corre em **quatro atos**,
com um `Respiro` entre eles:

```
ATO I  · a cena e o buraco   abertura → problema → painel → funil
ATO II · o que o dado disse  gesto → busca → investigação → citação
ATO III· como eu resolvi     recusei → design system → decisões → módulos
ATO IV · o que mudou         solução → antes/depois → resultado → aprendi
```

São 15 seções, e é o que o índice da esquerda lista (a `citacao` não tem
`Sec`, então não entra no índice).

**A regra que sustenta a ordem: decisão argumenta, módulo prova.**
`decisoes` são **4 âncoras sem figura** (busca tolerante, pop-up após
15%, pagamento na primeira dobra, comprar do card): as escolhas que mudam
a tese do projeto. As **6 execuções** que a implementam viram passos do
módulo **"O acabamento"**, com as figuras. Antes eram 10 itens com figura
acoplada, e por isso o clímax acontecia no meio e `solucao` virava resumo.
Não reacoplar figura em `decisoes`.

`calendario` **não é beat**: é desenhado dentro de `Resultado`, no slot de
arte (`c7`). A ordem das chaves em `data.jsx` não é a ordem de render.

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

1. **`ChapterBlock` / `ChapterList` em `Capa.jsx` são código morto.** Quem
   desenha a lista de capítulos da home é `RevealImageMask` /
   `RevealChapters` em `RevealMask.jsx` (classes `.rvm-*`), chamado pelo
   `Sumario` via `<RevealChapters>`. O selo do capítulo principal foi
   escrito primeiro no componente errado, buildou verde e **renderizou
   zero vezes**. Antes de editar a home, confirme quem o `Sumario` chama.
2. **`--vermilion-lift` não existe mais.** O `e45aca3` trocou por
   `--vermilion-sobre-ink`. CSS com token inexistente **não quebra o
   build**: cai no valor herdado e passa despercebido (o selo ficou
   quase-branco no modo tinta sem nenhum aviso).
3. **Escolher o vermelho pelo fundo, não pelo nome.** São dois sistemas
   opostos e é fácil pegar o errado:
   - `--vermilion-ink`: #B01510 no papel, **#F4695C sobre tinta**. Para
     texto sobre `--paper`, o fundo que acompanha o tema. É o caso comum.
   - `--vermilion-sobre-ink`: #F4695C no papel, **#B01510 sobre tinta**.
     Para superfícies que pintam `var(--ink)` e por isso **invertem**
     (capa do capítulo, citação, aba ligada).
   - `--vermilion` puro **nunca** aguenta texto em cima (4,0 a 4,3:1) em
     nenhum dos dois modos.
4. **Verificação que mede, não que olha.** As três armadilhas acima
   passaram pelo build verde e só apareceram medindo a página servida:
   contagem de elemento no DOM, `getComputedStyle().color` e contraste
   calculado nos dois modos. Delegue a execução a um subagente (o barulho
   fica fora do contexto), mas peça **números e strings de volta**, não
   impressão.

### Validação feita

- **Contraste**: 0 violação em 1920/1700/1440/768/390, modo papel e tinta,
  PT e EN (`e45aca3`, varredura sobre o capítulo inteiro).
- **Selo do capítulo principal** (`192f838`): renderiza exatamente uma
  vez, no PCYES, em PT ("Capítulo principal") e EN ("Main chapter").
  `.rvm-main` a 6,40:1 no papel e 6,19:1 na tinta, medido na página
  servida. Sem erro de console em `#/`, `#/rapido` e no capítulo.
- **Leitura rápida** (`192f838`): as três células (papel, o quê,
  resultado) preenchidas nos cinco capítulos, nos dois idiomas.
- **Performance** (`f01e90b`, mobile, throttling simulado): perf 43 → 74,
  FCP 4,9s → 1,5s, TBT 770ms → 190ms, CLS 0 → 0,017. Acessibilidade 100,
  SEO 100. As doze rotas renderizam sem erro de console.

## Planos antigos

`docs/superpowers/plans/` guarda os planos de 2026-05-29 (build/deploy, a11y, integração de conteúdo). Histórico, não roteiro.

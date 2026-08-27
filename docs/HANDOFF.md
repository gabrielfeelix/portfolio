# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Repo: github.com/gabrielfeelix/portfolio · push na `main` = auto-deploy Vercel
- **No ar: https://gabrielfelix-ux.4yu.com.br** (oficial). O push publica
  em mais de um projeto Vercel; o que vale para conferir mudança é esse.
  `portfolio-volume.vercel.app` é a versão antiga: não validar por ele.
- O Gabriel trabalha em **duas máquinas** (trabalho e casa) e o caminho do
  repositório muda entre elas. Nada aqui deve gravar caminho absoluto de
  `$HOME`: descubra com `git rev-parse --show-toplevel`.

**São duas auditorias, e elas não se sobrepõem:**

- `docs/AUDITORIA-PORTFOLIO.md` (volume inteiro, calibrada para mid):
  veredito de triagem, o plano do PCYES em quatro atos. Rodadas 1, 2, 3 e
  5 fechadas. **Explicitamente não avalia craft visual, motion nem
  leiturabilidade.**
- `docs/AUDITORIA-PCYES-2026-08-26.md` (o capítulo só, e é justamente o
  que a outra deixou de fora): craft, motion, leiturabilidade, escala das
  imagens e apresentação do design. **Nota atual: 8,3 para mid**, era
  7,4. Traz os números medidos e a receita pra reproduzir a medição, e o
  registro das três rodadas já executadas (a A, a de escala e a D+E).

O próximo trabalho sai da seção **Pendente** deste arquivo, que consolida
as duas.

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

**Playwright** — vem do cache do npx, e **o hash da pasta muda por máquina**, então não copie caminho daqui. Liste com `ls -d ~/.npm/_npx/*/node_modules/playwright` e teste um `chromium.launch()`: várias versões convivem e algumas pedem um build de chromium que não está em `~/.cache/ms-playwright`, falhando com "Executable doesn't exist". Funciona sem `LD_LIBRARY_PATH` (a receita antiga de `dpkg -x` não é mais necessária).

**Servindo o build, o que o teste vê a mais:** `_vercel/insights/script.js` e `_vercel/speed-insights/script.js` dão **404 em servidor local** porque só existem no deploy. Não é regressão: filtre `_vercel/` antes de contar erro de console, senão toda rota "falha".

- Servir o build: **prefira `python3 -m http.server <porta> --bind 127.0.0.1` de dentro de `dist/`**, com uma porta que você conferiu livre (`ss -ltn | grep :<porta>`). O `npm run dev` escolhe porta sozinho e, quando 5173/5174 já estão tomadas por outra sessão, o job morre sem aviso: aconteceu nesta rodada e o agente ficou "rodando" sem nunca ter servido nada.
- **Unity WebGL (VLibras e afins) só renderiza em `headless:false`** via WSLg (`DISPLAY=:0`). Leva ~60s e o canvas vive num shadow root, então `document.querySelector` não acha — sonde dentro do `shadowRoot` ou simplesmente espere e capture.
- Sempre dê `Read` no PNG. Build que passa não prova que a tela está certa: nesta rodada o sticky estava quebrado com o build verde.

**Figma MCP** — funciona. Arquivo PCYES V2 DS: key `A0Zg3I15KcYI82zZocmyjD`. `get_metadata` puxa a árvore por `nodeId` sem seleção; `get_variable_defs` e `get_screenshot` exigem o node selecionado no Figma desktop.

**Memória do projeto** fica em `~/.claude/projects/<slug-do-caminho-do-repo>/memory/`, e o slug muda com a máquina. Liste `~/.claude/projects/` e procure o que termina em `portfolio`. Leia.

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

> Esta terceira mordeu de novo em `fb823c9`: o beat `sistema` tinha as
> duas primeiras resolvidas e **não** a terceira, então a abertura do
> Design System (kicker, título e dois parágrafos) ficou em `opacity: 0`
> por semanas, com build verde e sem erro de console. Só apareceu medindo
> a opacidade máxima de cada painel enquanto ele está na faixa de
> leitura. **Se criar módulo novo com coluna presa, aplique as três.**
> Hoje quem força são `.mod-passos` e `.beat-sistema`.

## Decisões fechadas (não relitigar)

- **Coverflow**: as capas laterais esmaecidas violam contraste no axe. Gabriel decidiu (2026-05-29) **aceitar** — é preview periférico decorativo e a capa focada carrega o texto legível. Exceção consciente à WCAG 1.4.3. Não mexer.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Onde entra o Design System** (2026-08-26): depois das Decisões, antes dos Módulos. Nunca no começo. O argumento é "antes de desenhar 40 telas, construí o vocabulário", então o DS chega como resposta a um problema já posto e cada tela vira prova de que o sistema funciona.
- **Profundidade do DS**: "sistema em uso", não catálogo de swatches. Mostrar token semântico funcionando (mesmo componente em dark/light; cor com função: verde = compra, laranja = pré-venda, dourado = Coin). O argumento: *a V1 tinha cores; a V2 tem um sistema que sabe o que cada cor faz*. `ink-muted` não é cinza, é o papel "texto secundário", e vira sozinho quando o tema flipa.
- **PCYES é o capítulo principal** (2026-08-26, decisão do Gabriel): é o mais longo, o mais medido e o único com dado de comportamento. **Continua Cap. 01** e o sumário marca isso com o selo "Capítulo principal" (`chap.principal` em `data.jsx`, `.rvm-main` em `RevealMask.jsx`). Sem a marca, o leitor gasta 16 beats para descobrir sozinho e quem abre por outro capítulo forma opinião pelo case mais curto.
- **`fact` ancora em efeito, não em entrega** (2026-08-26): particípio ("caminho encurtado", "checkout reconstruído") descreve o que foi feito. O PCYES não tem número porque publica em outubro, então ancora no que já é verificável: a direção proposta contrariava o briefing e foi a aprovada. O padrão de referência é o Locar Mais, que troca número ausente por **mudança de comportamento verificável**. **Não inventar número para o Locar Mais.**
- **Índice do capítulo** (2026-08-26): variante **LISTA** escolhida entre três protótipos (lombada fina, lista com títulos, fina que expande no hover). As outras duas e o seletor **já foram removidos** — não reintroduzir. Ele fica na margem esquerda e **o conteúdo não estreita pra abrir lugar**: uma versão em `grid` que dividia a tela foi recusada.

## Pendente

> **Estado em 2026-08-26.** Fecharam, nesta ordem: a **Rodada A**
> (`fb823c9`), o **Grupo B** (escala e zoom, `68855dd`) e os **Grupos D e
> E** (motion e maneirismo). Os registros de execução, com números e com
> o método pra reproduzir a medição, estão em
> `docs/AUDITORIA-PCYES-2026-08-26.md`. Nada do que sobrou abaixo foi
> tentado e falhou: é trabalho que ainda não começou ou que depende do
> Gabriel.

Sete grupos, **quatro fechados**. O que resta de verdade é o **A**, que o
Gabriel decidiu tratar como projeto à parte, mais o **C** e o **F**, que
dependem de material que só ele tem.

**As duas decisões de escala continuam com ele, e não entraram aqui:**
se o clímax da V2 (1033px) deve empatar com a abertura da V1 (~1180px)
sangrando em `100vw`, e se o crescimento de 7,9% do documento incomoda
mais que a escala. Se incomodar, o caminho é o Grupo A, não desfazer.

---

### A · RITMO E LEITURABILIDADE (o maior item aberto)

**Tem documento próprio: `docs/GRUPO-A-RITMO.md`.** Ele traz o custo
medido **beat a beat**, as três frentes (cortar ou dobrar, atalho de 3
minutos, medida tipográfica sistemática), o que é decisão do Gabriel e o
critério de aceite. O prompt para abrir a sessão está em
`docs/PROMPT-GRUPO-A.md`.

**Decisão do Gabriel: isto é projeto à parte, não se ataca por partes.**
Palavra dele: *"o ritmo vai ser um design à parte, vai exigir um esforço
considerável"*. Não comece numa sessão que também vai fazer outra coisa.

O tamanho do problema: **39.302px, 43,7 telas, 4.029 palavras, ~20 min**,
contra 9.234 a 11.504px dos outros capítulos. E o achado que reordena o
ataque: **`sec-modulos` (14,9 telas) e `sec-sistema` (4,7 telas) são
47% do documento**, enquanto os oito beats de diagnóstico do Ato I e II
somam ~8 telas juntos. Cortar diagnóstico é o corte caro e resolve pouco.

### B · A ESCALA DAS TELAS · **FECHADO em 2026-08-26**

O achado era: a V1 que o capítulo critica era mostrada maior que a V2 que
o Gabriel desenhou. Está resolvido onde era comparável. Medido em 1440:

| | Antes | Depois |
|---|---|---|
| Telas de produto abaixo de 600px | 21 de 27 | **0** |
| `prevenda`, `contador`, `sidecart`, `points` | 240px | **600px** |
| Telas dos módulos e dos passos | 543px | **600px** |
| Telas da `solucao` (o clímax) | 628px | **1033px** |
| Imagens com zoom | 18 de 27 | **21 de 27** |
| Zoom no clímax | 0 de 3 | **3 de 3** |
| Lupa em repouso | `opacity: 0` | `opacity: 1`, 17,87:1 |
| Altura do documento | 36.420px | **39.302px** |

As seis imagens que continuam sem lupa são o antes/depois, que é slider e
está a 976px: é assim de propósito, não procurar de novo.

**O idioma novo, e a regra que ele estabelece.** A coluna de provas mede
549px em 1440 e o texto não pode estreitar (a linha já mede 44
caracteres). Então quem cede é a **margem direita da página**, por
`--sangra-dir`, declarado em `chapter.css` por faixa de viewport. Só a
direita: **a margem esquerda é onde mora o índice do capítulo, e sangrar
para lá bate nele.** Quem usa: `.mod-figs`, `.passos-figs`, `.cam-palco`
e `.sol-col`. Módulo novo com coluna de provas herda a sangria entrando
nessa lista.

Por isso `Modulos` **não alterna mais `rev`**: a coluna de provas fica
sempre à direita, que é o único lado por onde ela pode crescer. O
zigue-zague existia em um único beat e nunca chegou a ler como padrão.

**Armadilha achada e corrigida, para ninguém reintroduzir:** `.sol-grid`
era `repeat(12, 1fr)` com `gap: var(--gutter)` dentro de um pai de 549px.
Onze calhas de 57,6px somam 633,6px, as colunas `1fr` colapsavam a zero e
o painel media **634px dentro de um pai de 549**, vazando 85px para fora
da coluna, sem erro e sem scroll horizontal. Os "628px" que a Rodada A
registrou eram esse vazamento. Hoje são duas colunas e a largura é
declarada. **Grid de 12 colunas com calha de `--gutter` só cabe no
`.beat`, que é filho do `.shell`. Dentro de uma coluna, não cabe.**

**O que sobra, e é decisão visual do Gabriel:** a abertura da V1 é uma
`CenaScroll` que abre em 82% da tela (perto de 1180px) e o clímax da V2
para em 1033px. Para empatar de vez, as telas da `solucao` teriam que
sangrar em `100vw` como a cena da V1 sangra. Não foi feito por conta
própria.

**O preço, e ele é real:** tela maior é página mais alta. O capítulo foi
de 36.420 para 39.302px, de 40,5 para 43,7 telas de rolagem. Isso empurra
o Grupo A, não o resolve.

### C · MATERIAL QUE SÓ O GABRIEL TEM (travado)

**C1. Os quatro prints do PCYES.** Só ele tem acesso à V1.

| Chave | O que é | Onde | Prioridade |
|---|---|---|---|
| `buscaV2` | V2 sugerindo produtos e termos antes de digitar | **passo 1** de "O acabamento" | **alta** |
| `popup` | Pop-up da V2 após 15% de rolagem | **passo 2** de "O acabamento" | **alta** |
| `buscaMouse` | V1 buscando "mouse" e devolvendo mousepad | beat `busca` (Ato II) | **alta** |
| `buscaMause` | V1 buscando "mause" e devolvendo tela vazia | beat `busca` (Ato II) | **alta** |

`buscaV2` e `popup` são os **passos 1 e 2** de um módulo de nove: o
leitor abre "O acabamento" em duas molduras vazias empilhadas. É o buraco
mais visível do capítulo hoje. `buscaMouse` e `buscaMause` sustentam o
achado da busca, que é o melhor momento do melhor case.

**Como entregar:** precisa de **arquivo em disco**, imagem colada em chat
não serve. Salvar em `volume/assets/projetos/pcyes/`, preferir `.webp`,
e apontar o `src` na entrada de `chap.figuras` (`data.jsx`, capítulo
`pcyes`) no formato das vizinhas:
`src: "volume/assets/projetos/pcyes/<arquivo>.webp"`. **Alt e legenda já
estão escritos em PT e EN: não há código a mexer.** Depois `npm run build`.

**C2. Quais artefatos do FigJam mudaram uma decisão.** A resposta é dele.
O critério está em `AUDITORIA-PORTFOLIO.md` e **não se relitiga**: o
artefato entra só se mudou uma decisão, e entra junto da decisão que
mudou. Os que não entram viram **uma figura só** em `investigacao` (vista
do FigJam inteiro), com legenda que argumenta ("dez artefatos antes da
primeira tela"), não dez beats. **Não despejar os 10.**

**C3. Print do Traxium** (ele tem em casa) e **logo do IMMO**
(`logo: null` em `data.jsx`, ele vai mandar o Figma).

---

### D · MOTION · **FECHADO em 2026-08-26**

O capítulo contradizia a própria tese. Agora não contradiz mais, e a
regra virou token. Medido em 1440 na página servida, contando
`transitionTimingFunction` de todo elemento com transição viva:

| Rota | Curvas antes | Curvas depois | Elementos |
|---|---|---|---|
| `#/cap/pcyes` | 6 | **1** | 2.392 |
| home | 6 | **1** | 337 |
| `odex`, `oderco-revenda`, `portfolio`, `locarmais` | 6 | **1** | 146 a 173 |
| `#/rapido`, `#/processo` | 6 | **1** | 94 e 104 |

**O idioma novo, e é ele que a próxima pessoa precisa saber.** Três
tokens em `colors_and_type.css`, e quem foge do primeiro tem nome e
motivo:

- **`--curva`** = `cubic-bezier(.16,1,.3,1)`, a curva que o beat do
  Design System defende. É a de tudo que se move. `--cut` virou
  `180ms var(--curva)`, e como `--cut` é o token de transição usado 94
  vezes, essa linha só sozinha unificou a maior parte do site.
- **`--curva-corte`** = `.85,0,.9,.2`, só no corte de mangá: `cutflash`,
  `viewcut`, `sfxpop`, `ptwipe`, `vcut`, `pvsl`.
- **`--curva-carimbo`** = `.2,1.25,.3,1`, só no que carimba: `stamp`,
  `hanko`, `bm-drop`. Eram quatro overshoots escolhidos na mão
  (`.2,1.4`, `.22,1.2`, `.2,1.3`, `.2,1.1`) sem razão para diferirem.

**Componente novo herda `var(--curva)`.** Escrever `cubic-bezier` na mão
num componente de conteúdo é regressão, e ela é medível pela varredura
acima.

Ficaram de fora de propósito: a camada decorativa `organic` e o campo do
hero (`linear` / `ease-in-out`, que é ambiente, não interface), o
`steps(29)` da tinta, e dois literais do hero aprovado (`rotw-in` /
`rotw-out` e `sig-draw`).

**Bug achado de passagem, e ele era antigo:**
`.view { animation: viewcut var(--cut) cubic-bezier(.85,0,.9,.2) both }`
punha **duas timing functions** na mesma shorthand. Isso invalida a
declaração inteira, sem erro de console e com build verde. A animação
nunca rodou. Corrigido, mas `.view` não existe mais no DOM: hoje é CSS
órfão, sem efeito visual.

### E · TEXTO · **FECHADO em 2026-08-26**

O conteúdo não foi reescrito, e continua não precisando. O que caiu foi o
tique de ritmo. Medido no texto renderizado do capítulo (`innerText`, não
no fonte):

| | Antes | Depois |
|---|---|---|
| Dois-pontos explicativos, PT | 39 | **22** |
| Dois-pontos explicativos, EN | 37 | **22** |
| Travessões | 0 | **0** |
| Palavras, PT | 4.019 | 4.029 |
| Altura do documento | 39.302px | **39.302px** |

Foram 21 quebras em `data.jsx` e as 15 contrapartes em `i18n.jsx`.

**O critério, e ele é o que segura a próxima rodada:** quebrei só
**prosa**, onde o gesto era afirmação, dois-pontos, revelação. As
**legendas** ficaram intactas de propósito: ali o "X: descrição" é rótulo
de legenda, não maneirismo, e uniformizar isso quebraria o idioma das
figuras. Os 22 que restam são majoritariamente legenda.

"deixou de / passou a" e "em vez de" continuam em 9 ocorrências cada.
Não foram alvo.

**Não é cara de IA, e isso continua verificado:** 0 travessões, 0
construções "não é X, é Y", vocabulário idiomático. Não relitigar.

### F · OS OUTROS QUATRO CAPÍTULOS (o problema que ninguém olhou ainda)

Medido: cada um mostra **4 a 6 telas de projeto** e tem 654 a 1.102
palavras. Para portfólio de UI, quatro telas por case é pouco. O volume
hoje é um capítulo de 20 minutos ao lado de quatro de 4 minutos.

Isso **não** se resolve cortando o PCYES (decisão fechada: "não cortar
beats pra equilibrar, o problema é falta de atalho, não excesso de
argumento"). Resolve-se engordando os outros, e isso depende de material.

Aberto e não decidido: **quanto** engordar, e com o quê.

---

### G · OPCIONAIS E MIUDEZAS

- **Antes/depois de um componente real** (opcional, da auditoria antiga):
  card de produto da V1 ao lado do da V2. Não há documentação de token da
  V1, então o enquadramento honesto é "a V1 não tinha sistema". **Não
  inventar número.**
- **Quirk pré-existente, fora de escopo:** ao navegar pra um capítulo a
  partir de uma posição rolada, a pill do nav começa escondida até rolar
  pra cima. O Nav é comportamento sensível, mexer só com cuidado.
- **264 elementos de texto entre 12 e 14px.** Depois da Rodada A o piso é
  12px e **nada** ficou abaixo disso (eram 133). Se um dia quiser subir o
  piso pra 13px, é aqui que se mexe. Não é urgente.

---

### Coisas que parecem pendência e NÃO são (não procurar de novo)

- **As 6 imagens sem lupa são o antes/depois.** É slider, está a 976px, e
  é assim de propósito. As outras 21 abrem em tamanho cheio.
- **A figura `marca` não está órfã.** É a régua do funil, consumida por
  `Funil` via `dados.marca`. Nenhuma figura está órfã.
- **Os `[assim]` não renderizam na página.** Moram só em `synthChapter`
  (`data.jsx`), o fallback de projeto sem capítulo autoral, e os cinco
  `CASE_IDS` têm capítulo em `CHAPTERS`. É código morto.
- **Nenhuma imagem está sem `alt`.** Os dois `bp-logo` têm `alt=""`
  dentro de `<span aria-hidden="true">`, que é o padrão **correto** para
  imagem decorativa. Uma varredura que conta string vazia como ausente dá
  falso positivo aqui.
- **Contraste está resolvido.** 0 violação real em 1920/1700/1440/768/390,
  nos dois modos, PT e EN. As duas que uma varredura acusa são os kanji
  decorativos (`prob-kanji`, `inv-kanji`) em `rgba(0,0,0,0)`.
- **`calendario` não é beat.** É desenhado dentro de `Resultado`, no slot
  de arte (`c7`). A ordem das chaves em `data.jsx` não é a ordem de render.
- **Os títulos de ato já existem no índice** (constante `ATOS` em
  `Capitulo.jsx`, renderizada em `.idx-ato-t`), e o índice **já aparece
  em 1440px**. Rodadas 1, 2, 3 e 5 da auditoria antiga estão fechadas.

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

**Fonte dos valores:** `v3-codigo-fonte/src/styles/theme.css`, um protótipo **somente leitura** que fica ao lado do repo em `~/dev/` (não existe na máquina de casa). De lá saíram 239 tokens, 69 componentes, a sombra copiada em 43 lugares, e os comentários que já documentam as razões de contraste. O Figma expõe **só a página Cover** pela API (`get_metadata` sem nodeId lista as páginas); o resto exige seleção no desktop, então o arquivo de tema é a fonte melhor.

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

**Rodada de escala (Grupo B), 2026-08-26**, tudo medido na página
servida: `scrollWidth == clientWidth` em 1920, 1700, 1440, 1280, 768 e
390; **0 `pageerror`**; nenhum elemento vazando a borda direita; **axe
(wcag2a + wcag2aa) com 0 violação** em 1440 papel, 1440 tinta, 1440 EN e
390. Varredura de reveal em passos de 90px: os **39** painéis chegam a
opacidade ≥ 0,95 na faixa de leitura, **0 morto**. As legendas alargadas
ficaram em 58 a 65 CPL (o teto de 68ch segura). O lightbox abre a partir
do clímax, com `role="dialog"` e `aria-modal`, e fecha no Esc. Em EN a
lupa lê "+ ZOOM" e são os mesmos 21 botões. No mobile de 390px, **26 das
27** imagens ocupam a coluna inteira.

Os outros quatro capítulos herdaram a régua: `odex`, `oderco-revenda`,
`portfolio` e `locarmais-conciliacao` mostram a `solucao` a 1033px, com
zoom. No Locar Mais os prints em retrato usam `meia` e ficam a 485px de
largura por 647 de altura, que é o tamanho certo para um 3:4.

**Rodada A da auditoria do capítulo** (`fb823c9`, 2026-08-26), tudo
medido na página servida, não por print:

| | Antes | Depois |
|---|---|---|
| Painéis que nunca acendem | 1 (abertura do DS) | **0** |
| Telas da `solucao` | 282px (20% da tela) | **628px** (44%) |
| `.beat-p` | 295px, ~35 CPL | **375px, ~44 CPL** |
| Elementos abaixo de 12px | 133 | **0** |
| Altura do documento | 37.030px | 36.420px |

Sem regressão: 1440, 1700, 768 e 390 conferidos, `scrollWidth ==
clientWidth` nos quatro (nenhum scroll horizontal), **0 `pageerror`**, 0
falha real de contraste.

**Anterior, e continua valendo:**

- **Contraste**: 0 violação em 1920/1700/1440/768/390, modo papel e
  tinta, PT e EN (`e45aca3`).
- **Teclado**: focus ring de 2 a 3px visível nos 14 primeiros Tabs, skip
  link presente, ordem de foco sensata.
- **`prefers-reduced-motion`**: tratado em 14 pontos do CSS.
- **Selo do capítulo principal** (`192f838`): renderiza exatamente uma
  vez, no PCYES, PT e EN. `.rvm-main` a 6,40:1 no papel e 6,19:1 na tinta.
- **Leitura rápida** (`192f838`): as três células preenchidas nos cinco
  capítulos, nos dois idiomas.
- **Performance** (`f01e90b`, mobile, throttling simulado): perf 43 → 74,
  FCP 4,9s → 1,5s, TBT 770ms → 190ms, CLS 0 → 0,017. Acessibilidade 100,
  SEO 100.

### Como medir este site (a receita que funciona)

```bash
npm run build
cd dist && python3 -m http.server 8788 --bind 127.0.0.1
# rota do capítulo: http://127.0.0.1:8788/#/cap/pcyes
# é #/cap/, NÃO #/capitulo/ — errar isso serve a página 404 e a medição
# sai toda zerada sem avisar
```

Para medir sem pegar estado de transição, injete antes de medir:

```css
*,*::before,*::after{animation:none!important;transition:none!important}
.beat .panel,.panel{opacity:1!important;transform:none!important}
```

**Mas para verificar reveal, faça o contrário:** deixe os efeitos
ligados, aproxime a seção rolando de cima em passos pequenos e registre a
**opacidade máxima que cada painel atinge enquanto está na faixa de
leitura**. Foi assim que o bug do Design System apareceu, e ele não
aparece de nenhum outro jeito.

Filtre `_vercel/` do console: 404 local é esperado, não é regressão.

## Planos antigos

`docs/superpowers/plans/` guarda os planos de 2026-05-29 (build/deploy, a11y, integração de conteúdo). Histórico, não roteiro.

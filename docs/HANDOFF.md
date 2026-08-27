#**A gramática visual, desde `e7a5e55`:**

- **Duas larguras de imagem, e só duas**: página é `--fig-plena` (976,
  vale para a cena de abertura, a `solucao` e o antes/depois) e coluna é
  a largura da coluna de provas. O grau `apoio` pesa o plano de tinta
  (5px), não muda largura: os 72% à direita serrilhavam a pilha e
  morreram. A cena de abertura é FIGURA PARADA no degrau plena: o
  `CenaScroll` (quadro que crescia no scroll) saiu do código, não
  reintroduzir.
- **Texto sem prova ao lado não fica em meia coluna**: o intro da
  `solucao` corre em duas colunas de imprensa na largura da página
  (`.sol-intro-cols`). As legendas numeradas da solução saíram a pedido:
  a tela fala, o zoom detalha.
- **Figura lateral curta centra contra o texto** no beat com linha plena
  (`.beat:has(.mod-plena) > .c7 { align-self: center }`).
- **CSS morto se remove por regra, com chaves balanceadas**, nunca por
  fatia de string: uma remoção por índice levou junto o plano de tinta e
  a moldura da citação, com build verde, e só o axe pegou.

 Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

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

**O próximo trabalho sai de `docs/O-QUE-FALTA.md`**, que é a lista
completa e medida do que resta. A seção **Pendente** aqui embaixo guarda
só o registro do que já fechou, porque é onde moram as armadilhas.

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

- **A nota do suporte fala só de desktop** (2026-08-27): o bloco vermelho antes do Ato I existe para justificar por que as provas grandes são prints de desktop, e o número publicado é o mix do Q2, **70/30** (116.530 sessões contra 50.352). Ele já teve uma versão que argumentava a favor do celular (conversão 0,17% contra 0,14%, rejeição menor) e o Gabriel recusou: contradiz a própria função do bloco. O dado do celular é real e pode entrar em outro lugar, **não ali**. O bruto de 12 meses (73,6/26,2) não se usa: junho e julho têm pico de desktop com cara de tráfego não humano.
- **Coverflow**: as capas laterais esmaecidas violam contraste no axe. Gabriel decidiu (2026-05-29) **aceitar** — é preview periférico decorativo e a capa focada carrega o texto legível. Exceção consciente à WCAG 1.4.3. Não mexer.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Onde entra o Design System** (2026-08-26): depois das Decisões, antes dos Módulos. Nunca no começo. O argumento é "antes de desenhar 40 telas, construí o vocabulário", então o DS chega como resposta a um problema já posto e cada tela vira prova de que o sistema funciona.
- **Profundidade do DS**: "sistema em uso", não catálogo de swatches. Mostrar token semântico funcionando (mesmo componente em dark/light; cor com função: verde = compra, laranja = pré-venda, dourado = Coin). O argumento: *a V1 tinha cores; a V2 tem um sistema que sabe o que cada cor faz*. `ink-muted` não é cinza, é o papel "texto secundário", e vira sozinho quando o tema flipa.
- **PCYES é o capítulo principal** (2026-08-26, decisão do Gabriel): é o mais longo, o mais medido e o único com dado de comportamento. **Continua Cap. 01** e o sumário marca isso com o selo "Capítulo principal" (`chap.principal` em `data.jsx`, `.rvm-main` em `RevealMask.jsx`). Sem a marca, o leitor gasta 16 beats para descobrir sozinho e quem abre por outro capítulo forma opinião pelo case mais curto.
- **`fact` ancora em efeito, não em entrega** (2026-08-26): particípio ("caminho encurtado", "checkout reconstruído") descreve o que foi feito. O PCYES não tem número porque publica em outubro, então ancora no que já é verificável: a direção proposta contrariava o briefing e foi a aprovada. O padrão de referência é o Locar Mais, que troca número ausente por **mudança de comportamento verificável**. **Não inventar número para o Locar Mais.**
- **Índice do capítulo** (2026-08-26): variante **LISTA** escolhida entre três protótipos (lombada fina, lista com títulos, fina que expande no hover). As outras duas e o seletor **já foram removidos** — não reintroduzir. Ele fica na margem esquerda e **o conteúdo não estreita pra abrir lugar**: uma versão em `grid` que dividia a tela foi recusada.

## Pendente

> **`docs/O-QUE-FALTA.md` é a lista completa**, reescrita em 2026-08-27
> sobre `07c9382`. Esta seção não a repete: guarda só o registro do que
> fechou, porque é onde moram as armadilhas que a próxima pessoa vai
> pisar.

Em uma linha: falta **o print do pop-up** (travado no Gabriel), **engordar
os outros quatro capítulos** (depende de material dele) e **a ordem dos
blocos no celular**, que é o que sobrou do ritmo mobile.

**Fecharam, nesta ordem:** a Rodada A (`fb823c9`), o Grupo B (escala e
zoom, `68855dd`), os Grupos D e E (motion e maneirismo, `4e3b79e`), o
Grupo A (ritmo, `1ab1e88` e `1604128`) e a rodada de 2026-08-27
(`030b1c3` a `07c9382`): nota do suporte, ritmo no celular, bug do reveal
e a troca dos dados do Clarity pelo GA4.

**Três coisas dessa última rodada mudam o que você vai fazer:**

- **o `useReveal` estava quebrado e não era percepção**: rolando rápido, 3
  beats e 9 figuras nunca revelavam em 1440 e 7 e 10 em 390. Corrigido em
  `cdd318f`. Ao mexer em reveal, **meça rolando rápido**, salto de 1400px
  por frame: em passo lento o bug não reproduz.
- **os números do capítulo agora são do GA4 do trimestre**, não da amostra
  de 3 dias do Clarity, e a conclusão do funil mudou junto: o gargalo não
  é o checkout (quem chega lá converte a 25%), é o passo anterior. O
  Clarity ficou com mapa de calor e gravação.
- **as logos do GA4 e do Clarity não podem ser usadas** (política da
  Microsoft proíbe sem licença; a do Google só abre exceção para
  jornalismo e material didático). Nome em texto é permitido. Os selos são
  desenho próprio e é para continuarem assim.

**A instrumentação está em `tools/medir.mjs`.** Ela acha o Playwright
sozinho e traz as seis medições que custaram retrabalho para descobrir:
`beats`, `cpl`, `reveal`, `passos`, `regressao` e `diff`. Não reescreva
medição do zero.

---

### A · RITMO E LEITURABILIDADE · **FECHADO em 2026-08-26** (`1ab1e88`, `1604128`)

Registro completo, com método, no fim de `docs/GRUPO-A-RITMO.md`.

| | Antes | Depois |
|---|---|---|
| Altura do documento | 39.302px | **36.812px** |
| Telas de rolagem | 43,7 | **40,9** |
| Caminho padrão | 19,4 min | **18,0 min** |
| Caminho curto declarado | não existia | **3 min** |
| Palavras de conteúdo | 3.878 | **3.869** |

**O argumento não encolheu: 9 palavras de diferença líquida.** O que saiu
foi repetição; o que entrou foi navegação de tamanho parecido.

**Quatro peças novas, e todas são idioma que se herda:**

- **O atalho de 3 minutos é a célula "Como ler" do `Tldr`** (desde
  `e7a5e55`): um card, três respostas (Papel, Resultado, Como ler). Vem
  de **`minutos` declarado no `data.jsx`** mais `solucao`; sem `minutos`
  a terceira célula volta a ser o "Ao vivo". Só o PCYES tem, e o número é
  medido: atalho de 3 minutos em capítulo de 3 minutos seria mentira, e
  isso já quebrou uma vez. Não recriar barra separada nem "Ao vivo" em
  capítulo com minutos: o hero já tem "ver protótipo".
- **`--med-longa` / `--med-apoio` / `--med-legenda`** em
  `colors_and_type.css`. **Componente de leitura novo amarra num degrau.**
  O quarto degrau é a exceção declarada: dado desenhado e lista curta não
  têm medida de leitura.
- **`Respiro ato={...}`**, a virada de ato com numeral, título e kanji,
  vinda de `ATOS` em `Capitulo.jsx` (que agora tem `n` e `kanji`). Ato sem
  seção não ganha virada, porque o marcador vem de `indiceDo`.
- **`ordinal(i, total)`** no kicker dos módulos (`01/05`), custo zero de
  altura.

**As três armadilhas novas, e elas custam retrabalho:**

1. **`1ch` mente 25% neste projeto.** `ch` é a largura do "0", ~25% mais
   larga que o caractere médio destas fontes: `68ch` rendia **80
   caracteres reais**. A aproximação antiga (`largura / (font-size * 0,5)`)
   erra para o outro lado. **Meça com `Range`**, caractere a caractere:
   `node tools/medir.mjs cpl`.
2. **O `i18n.jsx` substitui, não mescla** (`Object.assign(c, en)` é raso).
   Campo novo em `chap.sistema` sem contraparte em EN **não renderiza em
   inglês**, com build verde e console limpo. Foi assim que o beat do
   Design System perdeu motion, tipografia, espaço e o `Derivado` inteiros
   em EN por semanas. **Confira o EN renderizado, não o fonte.**
3. **Espaço grande escolhido na mão vira telas.** `.passos-figs` tinha
   `gap: 26vh` (234px em 1440x900) e doze dessas somavam 2.808px de
   rolagem vazia. Hoje é `--ma-6`, o mesmo valor que separa dois beats.
   Coluna de provas nova usa a escala `--ma`, não `vh`.

**Decisões desta rodada que não se relitigam:** não dobrar "As nove
correções" (esconder o acabamento piora a dimensão mais fraca da
auditoria), não encolher o `ckMobile` (a 600px cada aparelho já mede
~290px), não alargar o `.beat-p` de 375px (é o `.c5` da composição
`c5 texto + c7 prova`, a gramática do capítulo, e 46 caracteres está no
piso da faixa mas dentro dela), e não mexer na ordem do Ato II (o copy
está soldado entre `gesto` e `busca`).

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
ATO III· como eu resolvi     V1.2 (a ponte) → recusei → design system
                             → decisões → módulos
ATO IV · o que mudou         solução → antes/depois → resultado → aprendi
```

**Desde `b3b131a`, a estrutura é visível na página e tem gramática:**

- **Cada ato abre numa banda de tinta** (`Respiro ato={...}`): fundo
  `--ink`, kanji vazado do ato (現場 数字 設計 変化), "Ato N · n/4" e o
  título. O Ato I também é anunciado. Vermelho em banda é
  `--vermilion-sobre-ink`, nunca `--vermilion-ink`.
- **A V1.2 é `chap.ponte`**, não um item de `modulos`. É o elo
  cronológico (problema → o que não podia esperar → o redesenho) e abre
  o Ato III via `ModuloPassos`. O `figOrder` a lê entre `investigacao` e
  `decisoes`. Não devolver o checkout para dentro de `modulos`.
- **Todo módulo abre com `buraco`**: uma linha "O buraco" antes do
  título, com o traço vermelho do passo vivo. O título do módulo é a
  resposta a essa linha. Módulo novo sem `buraco` renderiza, mas volta a
  ler como catálogo: escreva o buraco.
- **As telas da `solucao` seguem a ordem do caminho** (vitrine →
  checkout → bolso), numeradas 01/02/03 na legenda. Mostrar o fim
  primeiro quebra a cronologia que o título promete.
- **O Derivado mora DENTRO da dobra do vocabulário**, como fecho dela. A
  dobra declara o preço ("três telas") e ele é medido: se crescer o
  conteúdo, atualize o número.
- **Nota de painel largo corre em duas colunas** (`column-width: 40ch`):
  o mínimo por coluna deixa painel estreito com uma coluna sozinho. Não
  voltar nota de card largo para meia largura.

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

### Como medir este site

**A instrumentação está em `tools/medir.mjs`** desde `1604128`, e ela já
traz as receitas que custaram retrabalho para descobrir. Não reescreva
medição do zero.

```bash
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1
cd -
node tools/medir.mjs beats       # o custo de cada batida, com barra de pulso
node tools/medir.mjs cpl         # caracteres por linha REAIS, via Range
node tools/medir.mjs reveal      # painel que nunca acende
node tools/medir.mjs passos      # a troca do ModuloPassos lê limpo?
node tools/medir.mjs regressao   # seis viewports, oito rotas e axe
node tools/medir.mjs diff 8794 8793   # antes contra depois

ROTA=odex node tools/medir.mjs beats   # qualquer capítulo
npm i --no-save axe-core               # o axe não é dependência do site
```

**A rota é `#/cap/pcyes`, NÃO `#/capitulo/`.** Errar isso serve a página
404 e a medição sai toda zerada sem avisar.

**Guarde a baseline antes de mexer:** copie o `dist/` atual para outro
lugar e sirva numa segunda porta. Comparar contra memória não vale.

**As duas medições são opostas e as duas são necessárias.** Para layout,
congele (`animation: none`, `transition: none`, `.panel { opacity: 1 }`),
que é o que o `beats` faz. Para reveal, faça o contrário: deixe os efeitos
ligados e registre a **opacidade máxima que cada painel atinge enquanto
está na faixa de leitura**, rolando de 90 em 90px. Foi assim, e só assim,
que o bug do Design System apareceu.

**Duas alturas, e elas não se contradizem:** rolar a página inteira antes
de medir dá um número maior, porque a `CenaScroll` tem trilho que só
existe depois que ela roda. Use o mesmo método dos dois lados de qualquer
comparação, e diga qual usou. O `tools/medir.mjs` rola antes, sempre.

Filtre `_vercel/` do console: 404 local é esperado, não é regressão.

## Planos antigos

`docs/superpowers/plans/` guarda os planos de 2026-05-29 (build/deploy, a11y, integração de conteúdo). Histórico, não roteiro.

# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

> Reescrito em 2026-08-27 sobre `f1fd504`. Guarda só o que **muda o que você
> vai fazer**: a próxima tarefa, as regras duras e as armadilhas que já
> custaram retrabalho. O histórico de features está no `git log`, que é fonte
> melhor. Ao terminar uma rodada, **substitua** uma seção em vez de empilhar
> outra.

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Repo: `github.com/gabrielfeelix/portfolio` · push na `main` = deploy Vercel
- **No ar: https://gabrielfelix-ux.4yu.com.br** (oficial). O push publica em
  mais de um projeto Vercel; só esse vale para conferir mudança.
  `portfolio-volume.vercel.app` é a versão antiga: não validar por ele.
- O Gabriel trabalha em **duas máquinas** e o caminho do repositório muda
  entre elas. Nada aqui grava caminho absoluto de `$HOME`: descubra com
  `git rev-parse --show-toplevel`.
- **Todos os projetos dele estão em `github.com/gabrielfeelix?tab=repositories`**
  e também localmente em `~/dev/gabriel/`. Os repositórios locais são
  **somente leitura**: cópia só na direção projeto → portfólio.

---

## A PRÓXIMA TAREFA · o creme que sobrou nas imagens

As páginas de empresa **estão prontas** (ver "O que foi feito"). O que ficou
aberto e depende **só de decisão do Gabriel** são nove arquivos com o creme
antigo `#F6F3EC` gravado dentro da imagem. Token de CSS não resolve isso, e
repintar foto ou print é ato de design, não manutenção. Por isso não foi
feito sozinho.

| Arquivo | Creme | O que é | Saída provável |
|---|---|---|---|
| `volume/assets/gabriel.webp` e `.png` | 75% / 60% | retrato dele, fundo creme chapado | repintar muda a foto: perguntar |
| `volume/assets/projetos/portfolio/*.webp` (4) | 22 a 72% | prints do **próprio portfólio quando era creme** | repintar não resolve, o creme está no meio da UI: **refazer o print** |
| `volume/assets/projetos/pcyes/ck-mobile.webp`, `contraste.webp` | 42% / 27% | mockups montados sobre chapa creme | perguntar |
| `volume/assets/og-image.png` | 16% | card social, tipo creme sobre tinta | mecânico: creme → branco |

`projetos/ponto/*` e `marcas/produto/*` ficaram de fora de propósito: o claro
ali é do produto, não é o papel do volume.

Para achar de novo, ou conferir depois de mexer:

```python
# varre volume/assets/** e lista imagem com >=3% de #F6F3EC (tolerância 8)
from PIL import Image; import glob
def dist(p): return max(abs(p[0]-246),abs(p[1]-243),abs(p[2]-236))
```

O resto das pendências continua em **`docs/O-QUE-FALTA.md`**.

---

## O que foi feito em `f1fd504` (não refazer)

**As páginas de empresa viraram capítulo.** `COMPANIES` em `data.jsx` não tem
mais `story[]` de blocos de um parágrafo. Tem `abre` (gancho), `atos[]` (cada
um `{k, p:[...]}`, com título e mais de um parágrafo), `fala` + `falaApos`
(o balão de mangá entra depois daquele ato), `fecha` (frase de saída) e
`anos` (o que a linha do tempo imprime). Quem renderiza é `EmpresaHistoria`
em `EmpresaPage.jsx`. Espelho EN completo em `CO_EN` (`i18n.jsx`).

Também novos: `EmpresaLinha` (linha do tempo das três), `EmpresaFala` (balão,
com retícula atrás, atravessando a medida) e `SetaBeat` (seta de nanquim
entre um ato e o próximo).

**A home tem duas seções onde havia uma.** `QuemSou` perdeu a terceira coluna
e ficou com retrato grande e texto em corpo de leitura; `OndeEstou` é nova e
carrega a empresa atual em chapa cheia mais a trajetória visível de uma vez.

**O bege saiu.** Tokens e arquivos, detalhe nas armadilhas 12 e 13.

---

## Arquitetura (leia antes de editar)

- `volume/*.jsx` são **scripts clássicos** que compartilham estado via
  `window`. **Não há import/export.**
- `build.mjs` (esbuild) transpila cada jsx individualmente (`bundle:false`,
  **nunca** `minifyIdentifiers`, porque os nomes de topo são a API entre
  arquivos) → `dist/`, vendoriza React 18, copia assets, gera `index.html`.
- Ordem dos scripts importa: tweaks-panel → data → i18n → organic → cursor →
  RevealMask → Capa → Capitulo → Processo → Posfacio → EmpresaPage → app.
- Os scripts vão com `defer` (preserva a ordem, e por isso o contrato de
  `window` continua valendo). Os cinco CSS são concatenados e minificados num
  arquivo só, na ordem `colors_and_type`, `kit`, `chapter`, `app`, `organic`.
  **Quem vem depois vence:** regra em `app.css` sobrescreve `kit.css`.
- `Capitulo.js` e `EmpresaPage.js` **saem do carregamento inicial** e chegam
  quando a rota pede, então `renderPH` mora em `data.jsx` e não em
  `Capitulo.jsx`: a home usa e cairia com `renderPH is not defined`.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Hooks disponíveis globalmente: `useState`, `useEffect`, `useLayoutEffect`,
  `useRef`, `useCallback` (destruturados de `React` em `data.jsx:7`).
  `useReveal` também é global e **desconecta no primeiro disparo**: serve para
  animação de entrada única, não para estado que liga e desliga rolando.
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`.
Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`,
`i18n.jsx`) é normal.

## Regras duras

- **NUNCA commitar `empresas-para-o-portfolio.md`** (raiz do repo). É o
  material biográfico que o Gabriel escreveu e tem **salário dele nas duas
  últimas empresas** e a linha "sete meses no cargo sem aumento". O repo é
  **público**. `git add -A` pega o arquivo: confira o `git status` antes de
  commitar. Ele não está no `.gitignore` por decisão dele.
- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA".
  Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código
  pode. Confira com um script que varra só os campos de string, não o arquivo
  inteiro (tirar comentário de bloco e de linha antes de casar aspas).
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no
  Posfácio, uma razão no Rodapé. Não re-adicionar.
- **Paleta: branco, preto, vermelho e cinza.** `--paper` é `#FFFFFF` e os
  `--wash-*` são **neutros** desde 2026-08-27. Não reintroduzir calor neles:
  eram quentes, feitos para o creme, e contra o branco liam como sujeira.
- **Cor de produto tem UM lugar:** o quadro do capítulo na home, que é chapa
  com a cor da marca do cliente, mais a chapa da empresa atual em `OndeEstou`.
  Fora dali o volume é tinta sobre papel: a faixa de marcas é monocromática e
  o logo na folha do livro passa por filtro de tinta.
- **História de emprego não se inventa.** É biografia do Gabriel, não copy de
  produto. A fonte é `empresas-para-o-portfolio.md`. Se algo não está lá,
  pergunte; não deduza.
- **Não confie nestas notas: valide.** Rode o axe e **meça na página
  servida** antes de dizer que está bom. Teste teclado de verdade.
- **Screenshot aqui mede pouco e engana.** `.beat .panel` nasce
  `opacity: 0`, `ModuloPassos` troca o texto em meio à rolagem: print pega
  estado de transição e parece quebrado mesmo quando está certo. Meça no DOM
  (`getComputedStyle`, `getBoundingClientRect`, contagem de elemento,
  contraste calculado). Julgamento visual é do Gabriel, na tela dele.

## Como medir (não reescreva medição do zero)

`tools/medir.mjs` acha o Playwright sozinho e traz seis medições: `beats`,
`cpl`, `reveal`, `passos`, `regressao` e `diff`. **`regressao` é o portão:**
larguras sem scroll horizontal, `pageerror` em oito rotas e axe em papel,
tinta, EN e 390.

```bash
pkill -f chromium; pkill -f 'http.server'      # acumular headless já travou o PC
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1   # a porta que medir.mjs usa
node tools/medir.mjs regressao
```

- **`regressao` NÃO cobre as rotas de empresa** (`/#/empresa/<id>`). Rode o
  axe nelas à parte quando mexer ali: foi assim que apareceram três contrastes
  reprovados que passavam despercebidos.
- **O axe do `regressao` não rola a página**, então componente que só pinta
  depois de entrar na tela não é auditado. Role antes de auditar.
- **Playwright** vem do cache do npx e **o hash da pasta muda por máquina**:
  liste com `ls -d ~/.npm/_npx/*/node_modules/playwright`. O axe é separado:
  `npm i --no-save axe-core`.
- **`_vercel/insights/script.js` e `_vercel/speed-insights/script.js` dão 404
  em servidor local** porque só existem no deploy. Filtre `_vercel/` antes de
  contar erro de console, senão toda rota "falha".
- **O hash na URL não funciona** para chegar numa seção da home: o router
  trata hash desconhecido como 404 (`hashToView` em `app.jsx`). Abra `/` e use
  `scrollIntoView`. Rota de página (`#/empresa/ttt`, `#/cap/pcyes`) funciona.

## Armadilhas que já morderam

1. **`.brandplate` precisa de pai com `position: relative`.** A regra base é
   `position: absolute; inset: 0`. Num pai sem contexto de posicionamento ela
   sobe até o viewport e **pinta a tela inteira com a cor da marca**. Já
   aconteceu duas vezes; a segunda foi o `.oe-chapa` de `OndeEstou`. O
   sintoma (chapa cobrindo o site, tudo intocável, e a sensação de que a
   página está recarregando sozinha) não aponta para a causa.
   As variantes (`.nc-thumb`, `.bp-thumb`, `.qsc-logo`, `.bp-qsc`,
   `.bp-cover`) carregam `inset: auto`, que é override das regras base:
   remover o bloco base quebra ao mesmo tempo a capa dos capítulos e o card
   de empresa, e também sem sintoma óbvio.

2. **`ChapterBlock` / `ChapterList` em `Capa.jsx` são código morto.** Quem
   desenha a lista de capítulos da home é `RevealImageMask` /
   `RevealChapters` em `RevealMask.jsx` (classes `.rvm-*`), chamado pelo
   `Sumario`. Já houve edição que buildou verde e renderizou zero vezes.
   Antes de editar a home, confirme quem o `Sumario` chama.

3. **CSS com token inexistente não quebra o build**: cai no valor herdado e
   passa despercebido. `--vermilion-lift` não existe mais (virou
   `--vermilion-sobre-ink` em `e45aca3`).

4. **Escolha o vermelho pelo fundo, não pelo nome.**
   - `--vermilion-ink`: #B01510 no papel, **#F4695C sobre tinta**. Para texto
     sobre `--paper`. É o caso comum.
   - `--vermilion-sobre-ink`: #F4695C no papel, **#B01510 sobre tinta**. Para
     superfícies que pintam `var(--ink)` e por isso invertem.
   - `--vermilion` puro **nunca** aguenta texto em cima (4,0 a 4,3:1).

5. **Declaração duplicada vence pela última.** Ao injetar propriedade no topo
   de um bloco, confira se a original não vem depois: aconteceu com
   `z-index` em `.rvm-cap` / `.rvm-hov` e com `font-size` em `.lv-t`, os dois
   com build verde.

6. **`grid-column` explícito sem `grid-row` cria linha nova.** Ao inverter as
   colunas do livro (`:first-child { grid-column: 2 }`), o posicionamento
   automático já tinha passado da coluna 1 e mandou a segunda página para uma
   **linha nova**: cada página ficou com metade da altura e o texto foi
   cortado. `grid-row: 1` nas duas resolve.

7. **`scrollHeight` mente em container flex com `overflow: hidden`**: empata
   com `clientHeight` mesmo com o texto visivelmente cortado. Meça por
   retângulo (fundo do último filho em fluxo contra o fundo útil da caixa).

8. **Fonte chega depois da primeira pintura** e muda a altura do texto:
   qualquer ajuste que dependa de medida precisa re-medir em
   `document.fonts.ready`.

9. **Ao mexer em reveal, meça rolando rápido** (salto de 1400px por frame).
   Em passo lento o bug não reproduz: `useReveal` já esteve quebrado com 3
   beats e 9 figuras nunca revelando.

10. **`position: sticky` neste projeto pede três correções juntas**:
    `align-items: stretch` no módulo (senão a coluna curta começa milhares de
    px abaixo), `.text-col { align-self: stretch }` (sticky precisa de pai
    mais alto que ele) e `opacity: 1` forçada (`.beat .panel` nasce
    `opacity: 0` e numa coluna presa a faixa de acender já passou).

11. **Regex que casa por `id` pega o objeto errado**: `signamais`, `isabella`
    e `4yu` existem em `MARKS` **e** em `PROJECTS`, e `MARKS` vem antes no
    arquivo. Restrinja a busca ao bloco `const PROJECTS = [` antes de editar.

12. **Cor de fundo pode estar gravada dentro da imagem, e nenhum token
    conserta.** O bege que o Gabriel via não vinha só do CSS: 15 PNGs de
    marca, logo e certificado tinham `#F6F3EC` chapado como fundo. Antes de
    caçar a cor no CSS, varra `volume/assets/**` amostrando pixel.

13. **`logos/mono-inv/*.png` guardam a marca no canal alpha**, com o RGB
    **uniforme** por todo o arquivo. Converter para RGB e olhar a cor dá
    "100% de uma cor só" e não diz nada. Isso já fez a logo invertida
    renderizar creme em vez de branca por muito tempo, sem ninguém notar.

14. **Trocar cinza quente por cinza neutro sem mexer no contraste:** calcule
    a luminância relativa WCAG do tom original e ache o cinza `#NNNNNN` com a
    mesma luminância (busca inteira em 0..255 sobre `lin(v)`). Fazer a conta
    "de cabeça" erra: dois dos treze tons saíram errados na primeira passada
    e só apareceram quando as razões de contraste foram comparadas antes e
    depois. **Sempre compare antes/depois, nunca confie na substituição.**

## Decisões fechadas (não relitigar)

- **Outros projetos NÃO é chapa vermelha e NÃO tem dentição.** Foi construído
  e o Gabriel recusou depois de ver. O papel branco fica. A dentição continua
  existindo só entre a capa e a segunda dobra (`Bite` em `Capa.jsx`).
- **O rodapé tem retícula** (`.v-foot::before`, pontos de papel a 7% sumindo
  para baixo). Isso ficou.
- **"Quem sou" são duas seções**, não uma de três colunas. A empresa atual
  não volta a ser card de canto, e a troca de empresa não volta a ser par de
  setinhas: as três ficam visíveis.
- **A página de empresa é narrativa, não lista.** Se pedirem "bullet points"
  ou "cards" ali, é regressão: já foi assim e foi recusado.
- **A TT&T não teve teste com usuário, e a página diz isso.** Não "melhorar"
  esse trecho: a honestidade ali é a decisão.
- **A data da TT&T é 2024.** As fontes divergiam e o Gabriel mandou escolher.
- **A LP da IMMO não entra.** O que entra é que ele fez o sistema da IMMO e
  monitorou outro designer, dito por cima.
- **PCYES é o Cap. 01** e o sumário marca isso com o selo "Capítulo
  principal". É o mais longo, o mais medido e o único com dado de
  comportamento.
- **A nota do suporte fala só de desktop**: o número publicado é o mix do Q2,
  **70/30**. Já teve versão argumentando a favor do celular e o Gabriel
  recusou, porque contradiz a função do bloco.
- **Coverflow**: as capas laterais esmaecidas violam contraste no axe e ele
  decidiu **aceitar** (preview periférico decorativo). Exceção consciente à
  WCAG 1.4.3.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Onde entra o Design System**: depois das Decisões, antes dos Módulos.
  Nunca no começo.
- **Tabs por categoria saíram** e não voltam: escondiam 14 peças atrás de um
  clique.
- **Números do "sobre mim" são contados em runtime**, nunca escritos à mão.
- **A arte dos cards é `shots[]`, não `cover`.** Capa de marca é último recurso.
- **O livro das peças é escrito à mão** no idioma do volume. O `book-slider`
  do briefing é shadcn/Next e este repo é script global sem bundle.
- **A folha vira da esquerda para a direita.** Mangá é encadernado à direita,
  então a lombada fica desse lado e a borda solta à esquerda. A peça de
  número menor fica na página da **direita**.
- **A folha tem altura fixa** (`block-size`, não `min-block-size`) e quem
  cede é o texto, via `--lv-fit`. O intervalo `clamp(430px, 42vw, 500px)` sai
  de medição: as páginas pedem 400px em 1440, 395 em 1280 e 423 em 1024.
- **As logos do GA4 e do Clarity não podem ser usadas** (política da
  Microsoft proíbe sem licença; a do Google só abre exceção para jornalismo e
  material didático). Nome em texto é permitido.
- **"Maringá, PR" no rodapé é metadado de praça**, não anúncio de
  disponibilidade. Ele trabalha e não quer sinalizar saída.

## Pendências, fora as imagens com creme

**A lista completa e medida é `docs/O-QUE-FALTA.md`.** Resumo:

Travado nele (material): o print do pop-up do PCYES, **engordar os outros
quatro capítulos** (PCYES tem 17,7 min contra 1,6 a 4,2 dos outros), print do
Traxium, logo do IMMO, e o enquadramento das 27 imagens no celular.

Decisão dele, sem material pendente: sangrar o clímax da `solucao` em `100vw`
(é o que segura a nota de apresentação em 7,5 e não 9) e subir o piso
tipográfico de 12 para 13px.

Aberto de verdade: a ordem dos blocos no celular.

**Quatro peças ainda sem logo**, porque não existe arquivo: **4YU MKT,
Kitamo, Remoctrl e Rodapé**. O Rodapé tem logo só como componente em código
(`~/dev/gabriel/rodape/claude-design/logo.jsx`, balão de fala em `#B85838`),
igual ao caso do Traxium, que foi extraído da variante `mono` do componente
e virou `volume/assets/marcas/mono/traxium.svg`. Dá para fazer o mesmo.

## Auditorias

- `docs/AUDITORIA-PORTFOLIO.md` — o volume inteiro, calibrada para mid.
  **Não avalia craft visual, motion nem leiturabilidade.** Anterior à
  reforma das páginas de empresa.
- `docs/AUDITORIA-PCYES-2026-08-26.md` — o capítulo só, e é justamente o que
  a outra deixou de fora. **Nota atual: 8,3 para mid**, era 7,4.

## Higiene de contexto

O Gabriel roda o `token-hygiene` e o plugin `caveman`. Na prática:

- Nunca leia transcrição de sessão (`~/.claude/projects/**/*.jsonl`). Para se
  situar, nesta ordem: `git log`, `docs/`, `CLAUDE.md`, o código lido
  estreito, e então pergunte.
- Nunca leia arquivo grande inteiro. `sed -n` e `grep`.
- Print custa caro e fica no histórico para sempre. Para erro e log, peça
  texto. Para conferir cor e alinhamento, **meça pixel dentro do navegador e
  devolva número**, não a imagem.
- Trabalho mecânico vai para subagente (`haiku` para o óbvio, `sonnet` para
  localizar e medir). **Julgamento de design fica na thread principal, em
  Opus, sem subagente.** Sonnet e Haiku foram testados no trabalho de design
  dele e não passam. Não sugira rebaixar o modelo principal.
- Resposta terse por padrão. Prosa longa quando ele pedir profundidade.

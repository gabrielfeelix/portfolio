# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

> Reescrito em 2026-08-27 sobre `cb77cbd`. Guarda só o que **muda o que você
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

## A PRÓXIMA TAREFA · as páginas das empresas

**Objetivo do Gabriel, em ordem de importância:** deixar as páginas de
empresa completas, com informação de verdade, ilustração e alguma coisa
criativa. Ele falou em **ilustração dele "meio que zoando"**, em **setas**, e
em contar **a história dele dentro daquela empresa**, não um currículo.

**Ele vai deixar um arquivo com as informações** e avisar onde. **Espere esse
arquivo antes de escrever conteúdo.** Não invente história de emprego: é
biografia dele, não copy de produto. Estrutura e desenho podem começar antes.

### O que já existe (não recomeçar)

| Peça | Onde |
|---|---|
| Página inteira | `volume/EmpresaPage.jsx`, 150 linhas |
| Dados | `COMPANIES` em `volume/data.jsx` |
| Estilo | `.emp-*` e `.es-*` em `volume/app.css` |
| Rota | `view === "empresa:<id>"` em `volume/app.jsx` |

São **três empresas**: `ttt` (início de carreira), `locar` (Locarmais) e
`oderco` (Grupo Oderço, atual). Cada uma já tem:

- `blurb`, `role`, `period`, `note`, `atual`
- `story[]` — blocos `{ k, p }`, hoje 3 a 5 por empresa, renderizados
  numerados (`.es-beat`, com `.es-n` de 01 a 05)
- `skills[]` — blocos `{ k, p }`
- `related[]` — ids de projeto, viram atalhos no fim
- `logo` / `logoInv` (mono e mono invertida) e, em duas, `capa: { logo, bg, accent }`

O conteúdo textual **já é bom**: o Oderço conta o conflito real entre a
diretoria querer minimalismo e a métrica pedir caminho curto, e o efeito
colateral do RD Station. Isso não é para reescrever, é para **ilustrar**.

### O que falta, e é onde está o trabalho

1. **Nenhuma ilustração.** A página é só tipografia numerada. É exatamente o
   que o Gabriel quer resolver.
2. **A `story` não tem imagem nenhuma.** Nem foto, nem desenho, nem seta.
3. **`ttt` não tem logo** (`logo: null`, cai no wordmark) nem `capa`.
4. **Não há retrato ilustrado dele.** Existe `volume/assets/gabriel.webp`,
   que é foto, usada no "sobre mim" da home.

### Material que já está no repo e serve

- **As treze animações de tinta** do `volume/organic.jsx`: `orbit`, `merge`,
  `three`, `amoeba`, `split`, `magatama`, `drip`, `cluster`, `trail`, `yin`,
  `bounce`, `ripple`, `twin`. Uso: `<Organic variant="drip" size={62} />`.
  Já estão em produção nas páginas do livro.
- `volume/assets/ink-splash.png`, `splatter.svg`, `screentone.svg`, `seal.svg`
- `MangaPlate` (moldura "print a subir") e `BrandPlate` (marca sobre a cor
  dela, com retícula)
- O `.btn-seta` (disco com tinta varrendo no hover) em `kit.css`

### Ideias que cabem no idioma do volume

Sem prometer ao Gabriel: **valide com ele antes de construir**.

- **Setas desenhadas de nanquim** ligando um beat ao outro, como anotação de
  prancha. A `.es-beat` já é numerada, então a seta tem onde ancorar.
- **Retrato caricato** dele por empresa, mudando de expressão conforme o
  beat (chegando perdido, discutindo com a diretoria, entregando). É o
  "zoando" que ele pediu. Ele precisa fornecer ou aprovar o desenho.
- **Linha do tempo horizontal** ligando as três empresas, com a atual marcada.
  Hoje a navegação entre empresas é só o par de botões "Antes"/"Depois".
- **Balão de fala de mangá** para a frase que resume o conflito de cada
  empresa. O volume já tem onomatopeia e selo, então balão não é corpo
  estranho.

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
- `Capitulo.js` e `EmpresaPage.js` **saem do carregamento inicial** e chegam
  quando a rota pede, então `renderPH` mora em `data.jsx` e não em
  `Capitulo.jsx`: a home usa e cairia com `renderPH is not defined`.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Hooks disponíveis globalmente: `useState`, `useEffect`, `useLayoutEffect`,
  `useRef`, `useCallback` (destruturados de `React` em `data.jsx:7`).
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`.
Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`,
`i18n.jsx`) é normal.

## Regras duras

- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA".
  Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código
  pode. Confira com um script que varra só os campos de string, não o arquivo
  inteiro.
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no
  Posfácio, uma razão no Rodapé. Não re-adicionar.
- **Paleta: branco, preto, vermelho e cinza.** `--paper` é `#FFFFFF` desde
  2026-08-27 (era o creme `#F6F3EC`). Decisão dele depois de ver na tela.
  Os `--wash-*` continuam **quentes**, feitos para o creme: se algum cinza
  parecer bege, é isso, e a correção é neutralizar os tokens, não o papel.
- **Cor de produto tem UM lugar:** o quadro do capítulo na home, que é chapa
  com a cor da marca do cliente. Fora dali o volume é tinta sobre papel: a
  faixa de marcas é monocromática e o logo na folha do livro passa por filtro
  de tinta.
- **Não confie nestas notas: valide.** Rode o axe e **meça na página
  servida** antes de dizer que está bom. Teste teclado de verdade.
- **Screenshot aqui mede pouco e engana.** `.beat .panel` nasce
  `opacity: 0`, `ModuloPassos` troca o texto em meio à rolagem: print pega
  estado de transição e parece quebrado mesmo quando está certo. Meça no DOM
  (`getComputedStyle`, `getBoundingClientRect`, contagem de elemento,
  contraste calculado). Julgamento visual é do Gabriel, na tela dele.

## Como medir (não reescreva medição do zero)

`tools/medir.mjs` acha o Playwright sozinho e traz seis medições: `beats`,
`cpl`, `reveal`, `passos`, `regressao` e `diff`.

Para medir na mão:

```bash
pkill -f chromium; pkill -f 'http.server'      # acumular headless já travou o PC
npm run build
cd dist && python3 -m http.server 8817 --bind 127.0.0.1
```

- **Playwright** vem do cache do npx e **o hash da pasta muda por máquina**:
  liste com `ls -d ~/.npm/_npx/*/node_modules/playwright` e teste um
  `chromium.launch()`. Várias versões convivem e algumas pedem um build de
  chromium que não está em `~/.cache/ms-playwright`.
- **`_vercel/insights/script.js` e `_vercel/speed-insights/script.js` dão 404
  em servidor local** porque só existem no deploy. Filtre `_vercel/` antes de
  contar erro de console, senão toda rota "falha".
- **O hash na URL não funciona** para chegar numa seção: o router trata hash
  desconhecido como 404 (`hashToView` em `app.jsx`). Abra `/` e use
  `scrollIntoView`.
- Delegue a execução a um subagente (o barulho fica fora do contexto), mas
  peça **números e strings de volta**, não impressão.

## Armadilhas que já morderam

1. **`.brandplate` / `.bp-tone` / `.bp-logo` (app.css) não têm dono óbvio.**
   As variantes (`.nc-thumb`, `.bp-thumb`, `.qsc-logo`, `.bp-qsc`,
   `.bp-cover`) carregam `inset: auto`, que é override das regras base.
   Remover o bloco base quebra ao mesmo tempo a capa das páginas de capítulo
   e o card de empresa na home, e o sintoma não aponta para a causa.

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

## Decisões fechadas (não relitigar)

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

## Pendências, fora as páginas de empresa

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
  **Não avalia craft visual, motion nem leiturabilidade.**
- `docs/AUDITORIA-PCYES-2026-08-26.md` — o capítulo só, e é justamente o que
  a outra deixou de fora. **Nota atual: 8,3 para mid**, era 7,4.

## Higiene de contexto

O Gabriel roda o `token-hygiene` e o plugin `caveman`. Na prática:

- Nunca leia transcrição de sessão (`~/.claude/projects/**/*.jsl`). Para se
  situar, nesta ordem: `git log`, `docs/`, `CLAUDE.md`, o código lido
  estreito, e então pergunte.
- Nunca leia arquivo grande inteiro. `sed -n` e `grep`.
- Print custa caro e fica no histórico para sempre. Para erro e log, peça
  texto.
- Trabalho mecânico vai para subagente (`haiku` para o óbvio, `sonnet` para
  localizar e medir). **Julgamento de design fica na thread principal, em
  Opus, sem subagente.** Sonnet e Haiku foram testados no trabalho de design
  dele e não passam. Não sugira rebaixar o modelo principal.
- Resposta terse por padrão. Prosa longa quando ele pedir profundidade.

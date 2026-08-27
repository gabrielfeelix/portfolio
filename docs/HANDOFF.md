# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

> Atualizado em 2026-08-27 sobre `9355e72`. Este arquivo é **como trabalhar
> aqui**: arquitetura, regras duras, como medir, armadilhas e decisões
> fechadas. **O que falta está em `docs/O-QUE-FALTA.md`**, que é o único
> arquivo de pendência: não duplique lista de tarefa aqui.
>
> O que já foi feito está no `git log`, que é fonte melhor que prosa. Ao
> terminar uma rodada, **substitua** uma seção em vez de empilhar outra.

Portfólio em forma de volume de mangá. SPA React estática, sem backend.

- Repo: `github.com/gabrielfeelix/portfolio` · push na `main` = deploy Vercel
- **No ar: https://gabrielfelix-ux.4yu.com.br** (oficial). O push publica em
  mais de um projeto Vercel; só esse vale para conferir mudança.
  `portfolio-volume.vercel.app` é a versão antiga: não validar por ele.
- Duas máquinas, caminho do repo muda entre elas. Nada aqui grava caminho
  absoluto: descubra com `git rev-parse --show-toplevel`.
- Projetos dele: `github.com/gabrielfeelix?tab=repositories` e localmente em
  `~/dev/gabriel/`. Os repos locais são **somente leitura**: cópia só na
  direção projeto → portfólio.

**Ordem de leitura numa sessão nova:** este arquivo → `docs/O-QUE-FALTA.md`
→ só se precisar de histórico, `docs/AUDITORIA-PCYES-2026-08-26.md`.
**Não vasculhe transcript de conversa.** A resposta está no repo, sai do
`git log`, ou é pergunta para o Gabriel.

---

## Arquitetura

- `volume/*.jsx` são **scripts clássicos** que compartilham estado via
  `window`. **Não há import/export.**
- `build.mjs` (esbuild) transpila cada jsx individualmente (`bundle:false`,
  **nunca** `minifyIdentifiers`, porque os nomes de topo são a API entre
  arquivos) → `dist/`, vendoriza React 18, copia assets, gera `index.html`.
- Ordem dos scripts: tweaks-panel → data → i18n → organic → cursor →
  RevealMask → Capa → Capitulo → Processo → Posfacio → EmpresaPage → app.
  Vão com `defer`, o que preserva a ordem e mantém o contrato de `window`.
- Os cinco CSS são concatenados e minificados num arquivo só, na ordem
  `colors_and_type`, `kit`, `chapter`, `app`, `organic`. **Quem vem depois
  vence:** regra em `app.css` sobrescreve `kit.css`.
- `Capitulo.js` e `EmpresaPage.js` **saem do carregamento inicial** e chegam
  quando a rota pede. Por isso `renderPH` mora em `data.jsx` e não em
  `Capitulo.jsx`: a home usa e cairia com `renderPH is not defined`.
- **`dist/` é apagado a cada build** (`rm -rf`). Nunca deixe arquivo só lá.
- Hooks globais: `useState`, `useEffect`, `useLayoutEffect`, `useRef`,
  `useCallback` (de `React`, em `data.jsx:7`). `useReveal` também é global e
  **desconecta no primeiro disparo**: serve para entrada única, não para
  estado que liga e desliga rolando.
- Fluxo: editar → `npm run build` → commit → `git push origin main`.
- Commits em português, no tom dos anteriores, terminando com
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.

**Formato dos dados que não é óbvio:**

- `COMPANIES` (`data.jsx`) não usa `story[]`. Usa `abre` (parágrafo de
  gancho), `atos[]` (`{k, p:[...]}`, título e vários parágrafos), `fala` +
  `falaApos` (o balão de mangá entra depois daquele ato), `fecha` e `anos`.
  Renderiza em `EmpresaHistoria` (`EmpresaPage.jsx`). Espelho EN em `CO_EN`
  (`i18n.jsx`) precisa das mesmas chaves, ou o inglês volta ao conteúdo
  antigo pela metade.
- Os números do "sobre mim" são **contados em runtime** sobre `PROJECTS`,
  nunca escritos à mão.

**Regra de ouro:** se algo renderiza errado, é bug de CSS ou do `build.mjs`.
Não reescreva os `.jsx` "pra consertar render". Editar conteúdo (`data.jsx`,
`i18n.jsx`) é normal.

## Regras duras

- **NUNCA commitar `empresas-para-o-portfolio.md`** (raiz do repo). É o
  material biográfico do Gabriel e tem **salário dele nas duas últimas
  empresas** e a linha "sete meses no cargo sem aumento". O repo é
  **público**. `git add -A` pega o arquivo: confira o `git status` antes de
  commitar. Não está no `.gitignore` por decisão dele.
- **Zero travessões (—) em texto do site.** Palavra do Gabriel: "cara de IA".
  Use dois-pontos, vírgula ou ponto; em títulos, "·". Em comentário de código
  pode. Confira com script que varra só campo de string (tire comentário de
  bloco e de linha antes de casar aspas), não o arquivo inteiro.
- **História de emprego não se inventa.** É biografia, não copy de produto.
  A fonte é `empresas-para-o-portfolio.md`. Se não está lá, pergunte.
- **IA aparece pouco:** só onde é feature (Hub Oderço), uma filosofia no
  Posfácio, uma razão no Rodapé. Não re-adicionar.
- **Paleta: branco, preto, vermelho e cinza.** `--paper` é `#FFFFFF` e os
  `--wash-*` são **neutros**. Não reintroduzir calor: eram quentes, feitos
  para o papel creme, e contra o branco liam como sujeira.
- **Cor de produto tem UM lugar:** o quadro do capítulo na home e a chapa da
  empresa atual em `OndeEstou`. Fora dali o volume é tinta sobre papel: a
  faixa de marcas é monocromática e o logo na folha passa por filtro.
- **Não confie nestas notas: valide.** Rode o axe e **meça na página
  servida** antes de dizer que está bom. Teste teclado de verdade.
- **Screenshot aqui mede pouco e engana.** `.beat .panel` nasce
  `opacity: 0` e `ModuloPassos` troca o texto em meio à rolagem: print pega
  estado de transição e parece quebrado mesmo quando está certo. Meça no DOM
  (`getComputedStyle`, `getBoundingClientRect`, contagem, contraste
  calculado). Julgamento visual é do Gabriel, na tela dele.

## Como medir

`tools/medir.mjs` acha o Playwright sozinho: `beats`, `cpl`, `reveal`,
`passos`, `regressao`, `diff`. **`regressao` é o portão:** larguras sem
scroll horizontal, `pageerror` em oito rotas, axe em papel, tinta, EN e 390.

```bash
pkill -f chromium; pkill -f 'http.server'      # acumular headless já travou o PC
npm run build
cd dist && python3 -m http.server 8793 --bind 127.0.0.1   # a porta do medir.mjs
node tools/medir.mjs regressao
```

- **`regressao` NÃO cobre as rotas de empresa** (`/#/empresa/<id>`). Rode o
  axe nelas à parte: foi assim que apareceram três contrastes reprovados que
  passavam despercebidos.
- **O axe do `regressao` não rola a página**, então componente que só pinta
  ao entrar na tela não é auditado. Role antes de auditar.
- **Playwright** vem do cache do npx e **o hash da pasta muda por máquina**:
  `ls -d ~/.npm/_npx/*/node_modules/playwright`. O axe é separado:
  `npm i --no-save axe-core`.
- **`_vercel/*/script.js` dá 404 local** (só existe no deploy). Filtre
  `_vercel/` antes de contar erro de console, senão toda rota "falha".
- **Hash não leva a uma seção da home**: o router trata hash desconhecido
  como 404 (`hashToView` em `app.jsx`). Abra `/` e use `scrollIntoView`.
  Rota de página (`#/empresa/ttt`, `#/cap/pcyes`) funciona.
- Delegue a execução a um subagente (o barulho fica fora do contexto), mas
  peça **números e strings de volta**, não impressão.

## Armadilhas que já morderam

1. **`.brandplate` precisa de pai com `position: relative`.** A regra base é
   `position: absolute; inset: 0`. Sem contexto de posicionamento no pai ela
   sobe até o viewport e **pinta a tela inteira com a cor da marca**. Já
   aconteceu duas vezes. O sintoma (chapa cobrindo o site, tudo intocável, e
   a impressão de que a página recarrega sozinha, porque o único clicável que
   sobra é o nav e o botão PT/EN chama `location.reload()`) não aponta para a
   causa. As variantes (`.nc-thumb`, `.bp-thumb`, `.qsc-logo`, `.bp-qsc`,
   `.bp-cover`) carregam `inset: auto`, que é override da base: remover o
   bloco base quebra ao mesmo tempo a capa dos capítulos e o card de empresa.

2. **Cor de fundo pode estar gravada dentro da imagem**, e nenhum token
   conserta. O bege que o Gabriel via não vinha só do CSS: 15 PNGs de marca,
   logo e certificado tinham `#F6F3EC` chapado. Antes de caçar cor no CSS,
   varra `volume/assets/**` amostrando pixel.

3. **`logos/mono-inv/*.png` guardam a marca no canal alpha**, com o RGB
   **uniforme** em todo o arquivo. Converter para RGB e olhar a cor dá "100%
   de uma cor só" e não diz nada. Isso fez a logo invertida renderizar creme
   em vez de branca por muito tempo, sem ninguém notar.

4. **Trocar cinza quente por neutro sem mexer no contraste:** calcule a
   luminância relativa WCAG do tom original e ache o cinza `#NNNNNN` de mesma
   luminância (busca inteira em 0..255 sobre `lin(v)`). Conta de cabeça erra:
   dois dos treze tons saíram errados na primeira passada e só apareceram
   quando as razões foram comparadas antes e depois. **Sempre compare
   antes/depois, nunca confie na substituição.**

5. **`ChapterBlock` / `ChapterList` em `Capa.jsx` são código morto.** Quem
   desenha a lista de capítulos da home é `RevealImageMask` /
   `RevealChapters` em `RevealMask.jsx` (classes `.rvm-*`), chamado pelo
   `Sumario`. Já houve edição que buildou verde e renderizou zero vezes.

6. **CSS com token inexistente não quebra o build**: cai no valor herdado e
   passa despercebido. `--vermilion-lift` não existe mais (virou
   `--vermilion-sobre-ink` em `e45aca3`).

7. **Escolha o vermelho pelo fundo, não pelo nome.**
   - `--vermilion-ink`: #B01510 no papel, **#F4695C sobre tinta**. Para texto
     sobre `--paper`. É o caso comum.
   - `--vermilion-sobre-ink`: #F4695C no papel, **#B01510 sobre tinta**. Para
     superfícies que pintam `var(--ink)` e por isso invertem.
   - `--vermilion` puro **nunca** aguenta texto em cima (4,0 a 4,3:1).

8. **Declaração duplicada vence pela última.** Ao injetar propriedade no topo
   de um bloco, confira se a original não vem depois: aconteceu com
   `z-index` em `.rvm-cap`/`.rvm-hov` e `font-size` em `.lv-t`, build verde.

9. **`grid-column` explícito sem `grid-row` cria linha nova.** Ao inverter as
   colunas do livro, o posicionamento automático já tinha passado da coluna 1
   e mandou a segunda página para uma **linha nova**: cada página com metade
   da altura e texto cortado. `grid-row: 1` nas duas resolve.

10. **`scrollHeight` mente em container flex com `overflow: hidden`**: empata
    com `clientHeight` mesmo com texto visivelmente cortado. Meça por
    retângulo (fundo do último filho em fluxo contra o fundo útil da caixa).

11. **Fonte chega depois da primeira pintura** e muda a altura do texto:
    ajuste que dependa de medida precisa re-medir em `document.fonts.ready`.

12. **Ao mexer em reveal, meça rolando rápido** (salto de 1400px por frame).
    Em passo lento o bug não reproduz: `useReveal` já esteve quebrado com 3
    beats e 9 figuras nunca revelando.

13. **`position: sticky` aqui pede três correções juntas**:
    `align-items: stretch` no módulo (senão a coluna curta começa milhares de
    px abaixo), `.text-col { align-self: stretch }` (sticky precisa de pai
    mais alto) e `opacity: 1` forçada (`.beat .panel` nasce `opacity: 0` e
    numa coluna presa a faixa de acender já passou).

14. **Regex que casa por `id` pega o objeto errado**: `signamais`,
    `isabella` e `4yu` existem em `MARKS` **e** em `PROJECTS`, e `MARKS` vem
    antes no arquivo. Restrinja a busca ao bloco `const PROJECTS = [`.

## Decisões fechadas · não relitigar

**Da última rodada:**

- **Outros projetos NÃO é chapa vermelha e NÃO tem dentição.** Foi construído
  e o Gabriel recusou depois de ver. Papel branco fica. A dentição continua
  existindo só entre a capa e a segunda dobra (`Bite` em `Capa.jsx`).
- **O rodapé tem retícula** (`.v-foot::before`). Ficou.
- **"Quem sou" são duas seções**, não uma de três colunas. A empresa atual
  não volta a card de canto, e a troca de empresa não volta a par de setinhas.
- **A página de empresa é narrativa, não lista.** Pedido de "bullet point" ou
  "card" ali é regressão: já foi assim e foi recusado.
- **A TT&T não teve teste com usuário, e a página diz isso.** Não "melhorar"
  esse trecho: a honestidade ali é a decisão.
- **A data da TT&T é 2024.** As fontes divergiam e o Gabriel mandou escolher.
- **A LP da IMMO não entra.** Entra que ele fez o sistema da IMMO e monitorou
  outro designer, dito por cima.

**Anteriores:**

- **PCYES é o Cap. 01**, com selo "Capítulo principal" no sumário.
- **A nota do suporte fala só de desktop**: o número publicado é o mix do Q2,
  **70/30**. Já teve versão a favor do celular e foi recusada, porque
  contradiz a função do bloco.
- **Coverflow**: capas laterais esmaecidas violam contraste e ele decidiu
  **aceitar** (preview periférico decorativo). Exceção consciente à 1.4.3.
- **Hero**: aprovado, não mexer. O obi foi recusado.
- **Design System entra depois das Decisões, antes dos Módulos.** Nunca no
  começo.
- **Tabs por categoria saíram** e não voltam: escondiam 14 peças num clique.
- **A arte dos cards é `shots[]`, não `cover`.** Capa de marca é último recurso.
- **O livro das peças é escrito à mão** no idioma do volume. O `book-slider`
  do briefing é shadcn/Next e este repo é script global sem bundle.
- **A folha vira da esquerda para a direita.** Mangá é encadernado à direita,
  então a lombada fica desse lado. A peça de número menor fica à **direita**.
- **A folha tem altura fixa** (`block-size`, não `min-block-size`) e quem
  cede é o texto, via `--lv-fit`. `clamp(430px, 42vw, 500px)` sai de medição.
- **As logos do GA4 e do Clarity não podem ser usadas** (Microsoft proíbe sem
  licença; Google só abre exceção para jornalismo e material didático). Nome
  em texto é uso nominativo e é permitido. Os selos ao lado das linhas de
  fonte são desenho próprio (`SeloFonte`), e é para continuarem assim.
- **"Maringá, PR" no rodapé é metadado de praça**, não anúncio de
  disponibilidade. Ele trabalha e não quer sinalizar saída.

## Auditorias

- `docs/AUDITORIA-PCYES-2026-08-26.md` — o capítulo PCYES. **8,3 para mid**,
  era 7,4. É a útil.
- `docs/AUDITORIA-PORTFOLIO.md` — o volume inteiro, para mid. **Não avalia
  craft visual, motion nem leiturabilidade**, e é anterior à reforma das
  páginas de empresa. Envelheceu.

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

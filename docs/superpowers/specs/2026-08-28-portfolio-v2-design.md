# Portfólio V2: design

Data: 2026-08-28
Status: aprovado por Gabriel, pronto para virar plano de implementação
Escopo desta rodada: home V2 e página PCYES V2. Nada além.

## Contexto

O portfólio em produção (V1) é um volume de mangá: vermelho, screentone, tipografia
Anton e Bangers, capítulos com tobira e índice. Ele fica exatamente como está.

A V2 é uma segunda leitura do mesmo conteúdo em outra linguagem visual, na linha do
template Framer `viper-template.framer.website`, usado como referência de gramática e
de motion. A referência é um template pago: nenhum arquivo dela (markup, CSS, fonte,
imagem) entra no repositório. O que se aproveita é a técnica, reescrita do zero.

Postura de trabalho combinada: decisões tomadas como UI designer sênior, não como
executor de pedido. Onde o gosto da referência conflitar com a legibilidade, a
hierarquia ou a acessibilidade, vence a legibilidade, e a divergência é dita.

## Decisões

Todas confirmadas por Gabriel em 2026-08-28.

| # | Decisão | Razão |
|---|---|---|
| D1 | V2 é um app separado em `v2/`, buildado para `dist/v2/` | `volume/*.jsx` é comportamento-congelado (ver `docs/HANDOFF.md` e memória do projeto). Risco zero para produção. |
| D2 | Identidade nova. O mangá não vai para a V2 | Gabriel quer uma tela moderna, tecnológica e arredondada. Screentone, Bangers, tobira e pinceladas ficam só na V1. |
| D3 | Tipografia é Hanken Grotesk, que já está no repositório | Já foi escolha consciente ("menos brutalista, mais tokyo"). Zero peso novo, zero FOUT novo. |
| D4 | Motion via `motion` (framer-motion), só no bundle da V2 | O vocabulário da referência é spring e scroll-linked. Fazer à mão custa muito mais e fica pior. A V1 não carrega a biblioteca. |
| D5 | Fundo escuro apenas nos heros. O corpo é claro | Igual à referência, que é um site light com heros dark full-bleed. Uma exceção nomeada: o bloco final "Aprendi" da página de caso é escuro, para fechar a leitura no mesmo tom em que ela abriu. Nenhuma outra dobra é escura. |
| D6 | `/v2` roda só em localhost até aprovação | Gabriel quer ver antes de qualquer coisa ir ao ar. O build de produção não emite `dist/v2/`. |
| D7 | A página PCYES V2 não tem índice | Pedido direto. A orientação vira uma barra de progresso fina no topo. |
| D8 | O conteúdo não é reescrito nem duplicado | `data.jsx` continua a fonte única. A V2 lê os mesmos objetos. |

## Arquitetura

### Estrutura de arquivos

```
portfolio/
  volume/              V1. Congelado.
  v2/                  V2. Módulos ESM com import/export de verdade.
    index.template.html
    app.jsx            raiz, roteamento e shell
    tokens.css         cor, tipo, forma, espaço
    motion.js          as seis primitivas de movimento
    Shell.jsx          nav, rodapé, barra de progresso
    Home.jsx           as nove dobras da home
    Case.jsx           a página de caso
    content.js         adaptador que lê o conteúdo da V1
  build.mjs            ganha buildV2(). O resto intocado.
```

A V2 usa `import`/`export` normais e `bundle: true`. Ela não herda o modelo de
escopo global da V1, que existe por razão histórica e não deve se propagar.

### Fonte de conteúdo

`volume/data.jsx` termina em
`Object.assign(window, { PH, CHAPTERS, PROJECTS, CASE_ORDER, ... })`.
Logo, depois de `dist/volume/data.js` carregar, todo o conteúdo está em `window`.

`dist/v2/index.html` carrega nesta ordem:

1. `/vendor/react.production.min.js`
2. `/vendor/react-dom.production.min.js`
3. `/volume/i18n.js`
4. `/volume/data.js`
5. `/v2/app.js`

`v2/content.js` lê `window.CHAPTERS`, `window.PROJECTS`, `window.PROCESSO`,
`window.COMPANIES`, `window.CONTATO`, `window.ALL_MARKS`, `window.BRAND_LOGOS` e
expõe funções tipadas para o resto da V2. Editar um texto em `data.jsx` muda as duas
versões, que é o comportamento desejado.

React não é duplicado: no bundle da V2, `react` e `react-dom` resolvem para os globais
`window.React` e `window.ReactDOM` que o vendor UMD já publica. Só `motion` entra no
bundle.

**Risco.** `data.jsx` chama `t()` (do i18n) em três pontos e usa
`React.createElement` em vinte e seis. Se a ordem de carga acima não resolver as duas
dependências, o fallback é gerar `dist/v2/content.json` no build, avaliando `data.js`
em um contexto Node com stubs de `React` e `t`. Isso é verificado na Fase 0, antes de
qualquer trabalho visual.

### Build

`buildV2()` em `build.mjs`:

- `esbuild.build` com `bundle: true`, `format: "iife"`, `target: es2018`,
  `jsx: transform`, entrada `v2/app.jsx`, saída `dist/v2/app.js`.
- `tokens.css` e os CSS da V2 concatenados e minificados em `dist/v2/v2.css`.
- `dist/v2/index.html` gerado de `v2/index.template.html`, com `<meta name="robots"
  content="noindex,nofollow">` fixo enquanto durar D6.
- Assets continuam vindo de `/volume/assets/`, sem cópia nova.

**Gate de D6.** `buildV2()` só roda quando `process.argv` inclui `--serve` ou quando
`process.env.BUILD_V2 === "1"`. O build padrão da Vercel não emite `dist/v2/`, então
não existe URL pública possível. `vercel.json` não é alterado nesta rodada.

`npm run dev` passa a servir `/` (V1) e `/v2` (V2). O proxy de desenvolvimento já
devolve `index.html` para path sem extensão; ganha uma regra irmã que devolve
`/v2/index.html` para qualquer path sob `/v2`.

## Sistema visual

### Cor

| token | valor | uso |
|---|---|---|
| `--v2-paper` | `#F4F3F1` | fundo do corpo |
| `--v2-card` | `#FFFFFF` | cards e superfícies elevadas |
| `--v2-ink` | `#0B0B0C` | texto principal e fundo dos heros |
| `--v2-muted` | `#6B6B70` | texto de apoio |
| `--v2-rule` | `#E3E1DD` | réguas e bordas |
| `--v2-accent` | `#E4231B` | o vermelho de Gabriel |

O accent aparece em micro-dose, nunca em área grande: o quadrado de 8px antes de cada
label de seção, a bolinha do botão pill, o dot ativo de um carrossel, o sublinhado de
um link em foco. A referência usa `#ff462e` exatamente assim, e o vermelho de Gabriel
ocupa o mesmo lugar sem precisar mudar de tom.

Contraste, medido e não estimado:

| par | razão | veredito |
|---|---|---|
| `--v2-ink` sobre `--v2-paper` | 17.74:1 | passa AAA |
| branco sobre `--v2-ink` (hero) | 19.67:1 | passa AAA |
| `--v2-muted` sobre `--v2-paper` | 4.78:1 | passa AA para texto normal, com folga pequena |
| `--v2-muted` sobre `--v2-card` | 5.30:1 | passa AA |
| `--v2-accent` sobre `--v2-paper` | 4.16:1 | **não passa AA para texto normal** |
| `--v2-accent` sobre `--v2-ink` | 4.27:1 | **não passa AA para texto normal** |

Consequência de projeto, não detalhe: `--v2-accent` nunca carrega texto pequeno. Ele
é elemento gráfico (quadrado do label, bolinha do pill, dot ativo, sublinhado) ou
texto grande a partir de 24px em peso 800, onde o mínimo cai para 3:1. Onde a
referência usa o laranja dela em texto de apoio, a V2 usa `--v2-ink` e deixa o
vermelho só na marcação ao lado. É a divergência consciente prometida na abertura
deste documento.

`--v2-muted` a 4.78:1 passa, mas sem margem para escurecer o papel depois. Se o fundo
mudar, o par volta para medição.

### Tipografia

Hanken Grotesk, os pesos que já existem no repositório.

| papel | especificação |
|---|---|
| headline | 800, `clamp(2.5rem, 6vw, 5.75rem)`, `line-height: .96`, `letter-spacing: -.03em` |
| manifesto | 800, `clamp(1.75rem, 3.2vw, 3rem)`, `line-height: 1.08`, `letter-spacing: -.02em` |
| título de bloco | 800, `1.375rem`, `line-height: 1.2` |
| label de seção | 500, `.875rem`, `letter-spacing: .01em`, precedido do quadrado accent |
| corpo | 400, `1.0625rem`, `line-height: 1.55`, cor `--v2-muted` |
| numeral | 800, `clamp(2rem, 4vw, 3.5rem)`, usado em `01 / 02 / 03` e em resultados |

Headlines em caixa mista, nunca em caixa alta. A V1 grita; a V2 fala baixo.

### Forma e espaço

Botão pill `999px`. Card `20px`. Mídia `24px`. Bloco de seção `28px`. Nada de raio
intermediário fora dessa lista.

Grade de 1440px máximos, gutter de 40px, e o padrão dominante da referência: uma
coluna-label de 220px à esquerda e o conteúdo à direita. Entre dobras, uma régua de
1px em `--v2-rule` com um `+` centralizado.

Escala de espaço vertical: 8, 16, 24, 40, 64, 104, 168. Dobra respira em 104 no
desktop e 64 no mobile.

## Sistema de motion

Um arquivo, `v2/motion.js`, com seis primitivas. Todo movimento da V2 se monta com
elas, e nada é animado fora delas.

| primitiva | especificação |
|---|---|
| `spring` | `stiffness: 200, damping: 70, mass: 1`. Default de tudo que responde a hover, clique ou drag. |
| `ease` | `cubic-bezier(.44, 0, .56, 1)`. Para o que é temporizado e não interativo. |
| `rise` | Entrada padrão de bloco: `y: 24 → 0`, `opacity: 0 → 1`, duração 700ms com `ease`, stagger de 60ms entre irmãos. Dispara uma vez só. |
| `maskLine` | Headline revelada linha a linha por `clip-path: inset()`, stagger de 90ms. Só em headline de hero. |
| `parallax` | `useScroll` + `useTransform`. A mídia desloca entre 8% e 12% contra o scroll. Nunca mais que isso, senão descola do texto. |
| `sticky` | Dobra que trava por um trecho enquanto o conteúdo ao lado troca. Usada duas vezes na V2 e não mais. |

Regras duras:

- `prefers-reduced-motion: reduce` desliga tudo. Sobra `opacity` em 200ms.
- Só `transform` e `opacity` animam. Nada de `top`, `height`, `filter` em loop.
- Nenhum reveal dispara duas vezes ao rolar de volta.
- Nada anima antes do primeiro paint. O hero entra, o resto espera o scroll.

Os valores de spring e o easing foram medidos na referência, não estimados.

## Home V2

Nove dobras.

1. **Hero.** Full-bleed em `--v2-ink`, altura `100svh`. Headline em `maskLine`. A
   palavra rotativa da V1 é reescrita com `spring` no lugar do vanilla atual. Um pill
   "Ver os casos" com bolinha accent. Seta de scroll no canto. Sem foto e sem saudação,
   conforme regra já fixada por Gabriel.
2. **Manifesto.** Volta ao fundo claro. Label `Quem eu sou` na coluna esquerda,
   parágrafo grande à direita, régua com `+` acima. Duas colunas curtas de apoio
   embaixo.
3. **Tríade de vitrine.** Três covers reais de `volume/assets/projetos/*/cover.webp`,
   com `parallax` e um hover que sobe a imagem 8px.
4. **Marquee de marcas.** `ALL_MARKS` e `BRAND_LOGOS` em loop horizontal contínuo,
   divisórias verticais de 1px, pausa no hover, e `aria-hidden` na cópia duplicada.
5. **Processo.** `PROCESSO` em três cards arredondados numerados `01 / 02 / 03`.
6. **Casos.** `CASE_ORDER` (pcyes, locarmais-conciliacao, odex, oderco-revenda) em
   linhas grandes. O hover revela o cover à direita. O clique vai para
   `/v2/case/<id>`.
7. **Outras peças.** `PIECE_ORDER` em grade menor, sem hero, com tag de categoria.
8. **Onde estive.** `COMPANIES` em linha do tempo com `sticky` no rótulo do ano.
9. **Rodapé.** `CONTATO` em links diretos, sem formulário, mais o `+` de fechamento.

## Página PCYES V2

Rota `/v2/case/pcyes`. Sem índice e sem atos, por D7. A orientação é uma barra de
progresso de 2px no topo, presa ao scroll da página.

O conteúdo já existe em `data.jsx`, capítulo `pcyes`, e não é reescrito. As chaves
usadas, na ordem em que aparecem na tela:

| dobra | chave em `data.jsx` | tratamento |
|---|---|---|
| Hero | `coverTall`, `year`, `title`, `descriptor`, `links`, `role`, `surface` | Full-bleed dark, badge do ano, título gigante, dois pills, tags |
| Ficha | `role`, `surface`, `periodo`, `year` | Régua de quatro colunas |
| Manifesto | `premise`, `abertura` | Label lateral e parágrafo grande |
| Resumo | `tldr` | Bloco claro elevado, entrada em `rise` |
| Problema | `problema`, `funil`, `gesto` | Carrossel de parágrafos com dots accent |
| Investigação | `investigacao`, `busca`, `citacao` | Citação em bloco, tipografia maior |
| Mídia | `figuras.painel`, `figuras.vitrine` | Full-bleed arredondada com `parallax` |
| Decisões | `decisoes`, `recusei` | Lista numerada, `recusei` em destaque |
| Solução | `solucao`, `sistema` | Texto mais grade de mídia |
| Ponte | `ponte` | Bloco de largura média |
| Módulos | `modulos` | Cards arredondados com `sticky` |
| Antes e depois | `antesDepois`, `calendario` | Slider de comparação, reestilizado |
| Resultado | `resultado` | Numerais grandes com contador animado |
| Aprendi | `aprendi` | Bloco escuro, fecha a página |
| Próximo | `nextProjectId` | Link grande para o caso seguinte |

O slider de antes e depois da V1 é reaproveitado como comportamento, reescrito como
componente ESM da V2, e mantém o suporte a teclado que já existe (setas, Home, End).

## Fora de escopo

Reescrever qualquer texto. Tocar em `volume/*`. Outros capítulos além do PCYES.
Trocar fonte. Formulário de contato. Novo sistema de i18n. Alterar `vercel.json`.
Publicar `/v2`.

## Fases

| fase | entrega | verificação |
|---|---|---|
| 0 | `buildV2()`, rota `/v2` no dev, `content.js` lendo `window.CHAPTERS` | página crua mostrando o título do capítulo em texto puro |
| 1 | `tokens.css`, `motion.js`, `Shell.jsx` | print da nav e do rodapé |
| 2 | Home, dobras 1 a 4 | print |
| 3 | Home, dobras 5 a 9 | print |
| 4 | PCYES, hero até manifesto | print |
| 5 | PCYES, resto da página | print |
| 6 | Responsivo, `prefers-reduced-motion`, Lighthouse, axe | números medidos |

Cada fase termina com print para Gabriel aprovar antes da seguinte.

## Critérios de sucesso

- `/v2` e `/v2/case/pcyes` rodam em `npm run dev` e não existem no build de produção.
- A V1 continua idêntica: `dist/volume/*` e `dist/index.html` sem diferença de bytes
  além do que o próprio build já variava.
- Nenhum texto foi duplicado. Editar `data.jsx` muda as duas versões.
- Com `prefers-reduced-motion: reduce`, nada se move além de opacidade.
- axe sem violação nova em relação à V1.
- A página PCYES V2 não tem índice.

# Handoff — Portfólio "Volume" (Gabriel Felix Barbosa)

## O que é
Portfólio em forma de volume de mangá. SPA React estática, sem backend/DB.
- Dir: `/home/gabrielbarbosa/dev/gabriel/portfolio`
- Deploy: https://portfolio-volume.vercel.app (push na `main` = auto-deploy Vercel)
- Repo: github.com/gabrielfeelix/portfolio

## Arquitetura / build (LEIA antes de editar)
- `volume/*.jsx` são **scripts clássicos** que compartilham estado via `window` (`Object.assign(window,...)` + funções globais). **NÃO há import/export.**
- `build.mjs` (esbuild) transpila cada jsx individualmente (`bundle:false`, **NUNCA** `minifyIdentifiers`) → `dist/`, vendoriza React 18 prod, copia assets, gera `dist/index.html` de `index.template.html`.
- Ordem dos scripts importa (tweaks-panel→data→organic→cursor→Capa→Capitulo→Processo→Posfacio→EmpresaPage→app).
- **Regra de ouro:** se algo renderiza errado, é bug no `build.mjs` ou CSS — **não reescreva os `.jsx` pra "consertar render"**. Editar conteúdo (data.jsx) é OK.
- Fluxo: editar → `npm run build` → commit (terminar msg com `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`) → `git push origin main`.

## Ferramentas que já funcionam
- **Screenshots/axe via Playwright** (chromium do cache): faltavam libs do sistema; resolvido SEM sudo com
  `apt-get download libnss3 libnspr4 libasound2t64` → `dpkg -x ~/.local/chromedeps` → rodar com
  `export LD_LIBRARY_PATH="$HOME/.local/chromedeps/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"`.
  Scripts prontos: `/tmp/shot.mjs <url> <out> <w> <h> <scrollY>` e `/tmp/axe.mjs <url>` (importam playwright por caminho absoluto de `ct-boxe/node_modules`). **Sempre dê `Read` no PNG pra conferir.** Sirva o build local (`python3 -m http.server PORT -d dist`) pra auditar antes do push.
- Memória do projeto em `~/.claude/projects/-home-gabrielbarbosa-dev-gabriel-portfolio/memory/` (MEMORY.md + portfolio-build-architecture + portfolio-projects-content). **Leia.**

## REGRAS DURAS
- Os outros repos em `~/dev/` (traxium, ct-boxe, hub-ux-oderco, Gerador-HTML, etc.) são **SOMENTE LEITURA**. Nunca deletar/mover/editar nada fora de `portfolio/`. Cópia só projeto→portfolio.
- Caveman mode pode estar ativo (jeito de falar); não afeta código.

## Já feito (não refazer, mas VALIDE você mesmo)
- Hero = capa vermelha full-viewport fixa (texto branco), nav vira **pill flutuante** após a capa, efeito **TextRotate** ("Product Designer · que leva [...]"), fundo com tracejado + speed-lines + halftone, scroll cue, cursor custom (tinta/branco no vermelho).
- Fontes: **Chonburi** (display), **Reggae One** (SFX kana), **Yuji Mai** (katakana), Oswald, Hanken Grotesk. `translate="no"` nos kana.
- SFX mangá por projeto (kana + romaji).
- ~14 casos de projeto com conteúdo real + **capas = screenshots reais** dos deploys (PCYES, Odex, Hub Oderço, Signamais, Checkout Oderço, Worklife/ponto, Kitamo[mobile], Isabella). Traxium/Locarmais/Web2Design/4YU sem print.
- Tonante e Odex e-commerce **ocultos** (`hidden:true` em PROJECTS).
- **Sobre** reescrito (valores na frente, menos cringe).
- A11y rodadas 1–2: skip-link, `sr-only` no rotw, `aria-live` no rail, contraste de texto/botão corrigido (`--wash-3` escuro, textos vermelhos→`vermilion-ink`, btn texto `#fff`). Rodapé do rail centralizado no mobile, tap targets 44px.
- **A11y rodada 3 (validada por view, axe 1440/768/390):** achei e corrigi o que rodadas 1–2 não pegaram (só tinham auditado a home). Processo tinha `role="tablist"`+`aria-selected` em botão comum (2 críticas) → virou `role="group"`+`aria-current`. Cluster de contraste: `--vermilion`(#E4231B=4.16) como texto pequeno → `--vermilion-ink`(#B01510=6.40) em chapter `.tldr .l`+`.live`, nav `.active`, Sobre `.comp-go`, Empresa `.es-k`; `.comp-step`/`.es-n` em `--wash-2`(1.97)→`--wash-3`(5.82); `.comp-now` bg→vermilion-ink. **Resultado: chapter/processo/sobre/empresa = 0 violação no axe nas 3 viewports.**
- **Focus management SPA:** ativar link/capítulo jogava foco no `<body>` (Tab pulava skip-link+header). App agora foca `#conteudo` a cada troca de view (menos mount inicial). Tab order traçado nas 5 views: ordem lógica, focus-ring em todo stop, capas laterais do coverflow fora do tab order (navega por setas), 1 `<main>`, h1→h2, imgs com alt.
- **Footer no Sobre** (era a única view sem Colofão) + **footer nav** (Início/Projetos/Sobre) via prop `onNav` no Colofão, threaded do App em todas as 5 páginas.
- **Tablet 641–1024 validado** (screenshots 768+1024 das 5 views): layouts seguram nos breakpoints existentes (880/760/640), sem breakpoint dedicado novo. Bug corrigido: `.emp-meta` (`.shell` com `padding:0`) colava no canto < 1240px → `padding: 0 var(--gutter)`.
- **Breadcrumb chapter/empresa:** era `position:sticky` (congelava como barra sobre a capa escura ao rolar) → `static`. Nav flutuante já navega.
- **axe home: 1 regra restante = nós das capas laterais esmaecidas do coverflow** (8→10 nós após a reordenação do rail; mesmos elementos). DECISÃO do Gabriel (2026-05-29): **ACEITAR** (preview periférico decorativo, borrado/cinza/fade; a capa focada carrega o texto legível). Exceção consciente WCAG 1.4.3. Não mexer.
- **Rodada 4 (2026-07-10, auditoria /design-portfolio-audit):**
  - **Hash routing**: `#/`, `#/cap/<id>`, `#/sobre`, `#/processo`, `#/empresa/<id>` (app.jsx). Deep link, F5, back/forward funcionam; `document.title` por view; skip-link `#conteudo` não vira rota. Validado headless (14/14 PASS).
  - **SEO/social**: meta description, OG completo, Twitter card, JSON-LD Person, canonical, theme-color no template. `og-image.png` (1200×630, estilo capa vermelha) em `volume/assets/` — gerada com PIL (script era do scratchpad; regenerável).
  - **Mobile sumário**: `ProjectList` (já existia, estava sem uso) agora ligada ≤760px; coverflow segue no desktop/tablet. Kicker "arraste ou ← →" só desktop.
  - **Curadoria do rail**: capítulos 01–05 primeiro (Rodapé abre o rail), depois peças; removidas 3 duplicatas (`ponto-diar`, `kitamo-site`, `solar-saas`) — 19 capas.
  - **A11y**: `.dec .n` wash-2→wash-3 (1.97→5.82); `100svh` com fallback `100vh` (splash, post-hero, proc-sticky); `RotateWord` pára após 3 voltas (WCAG 2.2.2), reduced-motion nunca cicla.
  - **Perf**: capas PNG→WebP (6.4MB→882KB, q82); Google Fonts via `<link>` preconnect (era `@import` na cascata CSS); **Chonburi removida** (runtime sempre setava Anton via applyTweaks — nunca renderizava); boot pulado em revisita na mesma sessão (`sessionStorage vol-seen`). Yuji Mai/Reggae One mantidas (kana intencional).

- **Rodada 5 (2026-07-10, pente-fino com Gabriel):**
  - **REGRA DURA DO GABRIEL: ZERO travessões (—) em texto do site** ("cara de IA"). 60+ ocorrências viraram dois-pontos/vírgula/ponto. Títulos/OG usam "·".
  - **IA-detox**: de 17 menções pra ~5. IA fica só onde é feature (Hub Oderço), 1 filosofia no Posfácio ("uso IA como uso régua") e 1 razão no Rodapé. Não re-adicionar.
  - **Modo tinta** (`html.ink`): polos trocam (`--ink`/`--paper`), washes invertem, vermilion-ink vira #F4695C no escuro. Toggle 墨 no nav (glifo via Reggae One), localStorage `vol-ink`, aplicado pré-paint no template. Capa/hero continua vermelha nos dois modos.
  - **Momentos**: hanko carimba no "Fale comigo" (`.seal-stamp`, skip reduced-motion); 404 mangá (`#/404`, SFX シーン); barra de progresso de leitura (4px vermilion, só views de leitura); blob da virada REMOVIDO (Gabriel odiou o círculo; sheet+kana ficam).
  - **Grifo do headline**: pincelada de cantos orgânicos (variante C escolhida entre 4 mockups).
  - Hero sub: "Desenho, construo e publico. Design e código na mesma mão." (a anterior com travessão era "cringe", palavra dele).

- **Rodada 6 (2026-07-11, experiência premium + i18n):**
  - **4 bugs corrigidos**: Tobira renderizava premise/role reais como `<PH>` (Capitulo.jsx); `.chapter-body` matava o gutter lateral ≤1240px (chapter.css); hero quebrado no modo tinta (tokens invertíveis → literais no splash); pill do nav começava escondida ao entrar em capítulo rolado (reset em `view` change). Bônus: `chapterFor` agora resolve `p.chapterId` (Worklife abria capítulo synth em vez do case autoral "ponto").
  - **"Pleno" removido** do hero e do Quem Sou (decisão de posicionamento).
  - **Capítulos**: Resultado = painel de impacto (fato real em Anton sobre preto literal, kana fantasma, link "No ar"); thumb do próximo capítulo; TL;DR com célula "Ao vivo"; dobra "O sistema por trás do volume" no CAP. 05.
  - **Momentos**: marcador de página (localStorage `vol-marker`, fita no topo da capa, retoma scroll); modo tinta com View Transition circular a partir do 墨; assinatura SVG que se desenha no Posfácio; respingo de tinta no clique (cursor.jsx); scrollbar de tinta; capas laterais do rail acordam no hover.
  - **Processo**: 82vh→58vh por passo + recap "De relance" (grade dos 6 passos).
  - **i18n PT/EN completo**: `volume/i18n.jsx` (novo, na ordem de scripts após data.jsx) com `LANG`/`t(pt,en)`/`toggleLang` + mutação in-place dos globals de conteúdo em EN (lexical consts, window-swap não alcança). Toggle PT/EN no nav = localStorage `vol-lang` + reload. TODA a UI chrome traduzida via `t()`. CUIDADO: prop `t` (tweaks) do Posfacio foi renomeada localmente pra não sombrear o `t()` global (derrubava o root).
  - **Leitura rápida**: rota `#/rapido` (TL;DRs dos 5 capítulos + links vivos + CTA), atalho no hero ("Sem tempo? O volume em 2 minutos").
  - **Brand strip** no Diferencial (chips marca+nome, assets/marcas).
  - **ErrorBoundary** temático (`VolumeBoundary`): erro de render mostra página rasgada + recarregar, nunca root em branco.
  - **A11y re-auditada** (axe 3 viewports × 8 views): corrigidos `.beat-k`/`.sfx-ro` (vermilion→vermilion-ink no papel), `.emp-now` (bg vermilion-ink), 404 SFX (wash-3), impact panel literal; nav escondida ganhou `visibility:hidden` (fora do Tab). **Único restante = capas laterais do coverflow (exceção aceita, não mexer).** Boot 600ms; useReveal com guard de IO.

- **Rodada 7 (2026-07-12, UI "uau" aprovada pelo Gabriel; hero NÃO mexer, ele recusou o obi):**
  - **Processo**: painel por passo virou kanji vertical gigante em outline (目標/参照/試作/提示/調整/構築 + romaji, `PROC_JA` em Processo.jsx). Organic/plate/número grande removidos.
  - **Sumário**: índice **目次** sob o coverflow (desktop; mobile segue com a lista) — pontilhado + nº de página fake (p. 008 + i×14), 2 colunas via `columns` (fluxo coluna), respeita o filtro. `Mokuji` em Capa.jsx.
  - **Número de página** `p. 034` fixo no canto inferior direito das views de leitura (`PageNum` em app.jsx, ~0.85 viewport por "página"). Cor wash-3: some em seção escura de propósito (comportamento de mangá real; NÃO usar blend-difference, axe flaga).
  - **Problema**: placa cinza morreu — painel tipográfico com o título do case em Anton dentro de moldura `--ink-stroke-hi`, 問題 vertical fantasma e screentone no canto. O h2 MUDOU pro painel; a coluna de texto ficou com kicker+parágrafos (Capitulo.jsx `Problema`).
  - **Decisões**: cards com lift no hover (translateY -4px + sombra 7px).
  - **Empresa**: logo como marca d'água halftone na capa escura (mask radial-gradient 7px; fallback = nome em outline p/ empresa sem logo).
  - axe revalidado nas views alteradas: limpo (exceção do coverflow segue).

## PENDENTE (continuar aqui)
1. ✅ FEITO — Tablet 641–1024 validado (sem breakpoint novo; bug emp-meta corrigido).
2. ✅ FEITO — Passe teclado/leitor (focus mgmt + Tab order nas 5 views + landmarks).
3. ✅ DECIDIDO — coverflow: Gabriel aceitou as 8 (não mexer).
4. **Conteúdo (único pendente real):** ~13 marcadores `[confirmar]` no `data.jsx` (números/status que só o Gabriel confirma). Traxium sem print (ele tem em casa). IMMO: ele vai mandar Figma. Logos TT&T/Locarmais/Grupo-Oderço: ele manda (vão em `volume/assets/logos/`, já há fallback).
5. **Quirk pré-existente (fora de escopo, não regressão):** ao navegar pra um capítulo a partir de uma posição rolada, a pill flutuante começa escondida (lógica hide-on-scroll do Nav) até rolar pra cima. Mexer só com cuidado (Nav é comportamento sensível).

## VALIDAÇÃO SEM VIÉS (importante)
Não confie nestas notas: **valide por conta própria** a cada rodada —
- Rode o axe você mesmo (desktop 1440 + mobile 390 + tablet 768) servindo o `dist` local.
- Tire screenshots (mobile/tablet/desktop) e **dê Read** pra ver de verdade antes de afirmar que está bom.
- Teste teclado (Tab/Shift-Tab/Enter/setas) e descreva o fluxo real.
- Reporte o que está quebrado com a evidência (output do axe, print), sem suavizar.

## Planos detalhados
`docs/superpowers/plans/2026-05-29-a11y-responsive-sobre.md` e `...-project-content-integration.md`.

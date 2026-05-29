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
- **axe desktop: 28→8** violações (os 8 = capas laterais esmaecidas do coverflow).

## PENDENTE (continuar aqui)
1. **Tablet (641–1024px):** breakpoints dedicados; hoje cai nas regras ≤880/≤640. Validar Sobre/Processo/Empresa/Capítulo/Home em 768 e 1024.
2. **Passe profundo teclado/leitor de tela:** testar Tab do topo ao rodapé em CADA view (home, capítulo, processo, sobre, empresa), revisar ordem de foco, landmarks (`<main>` único, h1→h2), `alt` significativo nas capas vs `aria-hidden` no decorativo. Meta: 0 violação séria no axe + navegação 100% por teclado.
3. **Os 8 contrastes do coverflow:** decidir com Gabriel se clareia menos as capas laterais (menos profundidade) pra zerar, OU aceitar (são preview periférico).
4. **Conteúdo:** ~13 marcadores `[confirmar]` no `data.jsx` (números/status que só o Gabriel confirma). Traxium sem print (ele tem em casa). IMMO: ele vai mandar Figma. Logos TT&T/Locarmais/Grupo-Oderço: ele manda (vão em `volume/assets/logos/`, já há fallback).

## VALIDAÇÃO SEM VIÉS (importante)
Não confie nestas notas: **valide por conta própria** a cada rodada —
- Rode o axe você mesmo (desktop 1440 + mobile 390 + tablet 768) servindo o `dist` local.
- Tire screenshots (mobile/tablet/desktop) e **dê Read** pra ver de verdade antes de afirmar que está bom.
- Teste teclado (Tab/Shift-Tab/Enter/setas) e descreva o fluxo real.
- Reporte o que está quebrado com a evidência (output do axe, print), sem suavizar.

## Planos detalhados
`docs/superpowers/plans/2026-05-29-a11y-responsive-sobre.md` e `...-project-content-integration.md`.

# Coesão, Responsividade, Acessibilidade & Sobre — Plano

Feito em rodadas. Baseline de a11y medido com axe-core (chromium headless) no deploy.

## 1. Sobre (Posfácio / atogaki) — copy
**Diagnóstico** (vs. pesquisa de recrutador: 10–90s, clareza, evitar genérico/cringe, valores claros):
- Forte: arco Direito→Design→Produto (garra, autodidata, "desenho e construo").
- Fraco: pesado em vida pessoal (boxe, perfume, "tio babão") e leve em VALORES profissionais. Risco de cringe/oversharing pro recrutador que escaneia.
**Ação:** liderar com VALORES (como trabalha, no que acredita), manter o arco de carreira, cortar oversharing pra 1–2 linhas humanas. Manter voz de atogaki (on-concept). [FEITO 1ª rodada]

## 2. Mobile — seção de projetos (bug das "linhas vermelhas horizontais")
**Diagnóstico:** o Sumário usa um **coverflow horizontal** (capas vizinhas espiam dos lados + acentos vermelhos). No celular, arrastar/ler horizontal briga com o scroll vertical do dedo e confunde (parece que rola pra direita). Também ruim p/ leitor de tela.
**Ação:** no mobile, converter o rail num **stack/lista vertical** (rola junto com a página), mantendo o coverflow só no desktop. [PRÓXIMA RODADA — mudança no FocusRail]

## 3. Responsividade (mobile + tablet) — boas práticas
- Revisar breakpoints: mobile (≤640), tablet (641–1024), desktop. Hoje há saltos; faltam regras tablet dedicadas.
- Garantir tap targets ≥ 44px, sem overflow horizontal, tipografia fluida.
- Validar Sobre/Processo/Empresa/Capítulo em 360/768/1024/1440. [PRÓXIMA RODADA]

## 4. Acessibilidade — foco em cego (leitor de tela) e surdo
Baseline axe (home): `aria-prohibited-attr ×1` (.rotw), `color-contrast ×28` (rótulos cinza #76726a=4.32; contadores #b4afa3=1.97).

**Cego / leitor de tela & teclado (prioridade):**
- [FEITO] `.rotw` aria: remover aria-label proibido; SR lê a frase via texto visualmente-oculto; box decorativo `aria-hidden`.
- [FEITO] Skip-link "Pular para o conteúdo" → `#root`/main.
- [A FAZER] Landmarks/headings: garantir `<main>` único por view, hierarquia h1→h2, `nav` rotulado.
- [A FAZER] Coverflow operável por teclado com foco visível e `aria` de status (já tem setas + tabIndex; revisar ordem de foco e anúncio do item ativo via `aria-live`).
- [A FAZER] `alt` significativo nas capas (telas de projeto) e `aria-hidden` no decorativo (screentone, blobs, SFX, kana).
- [A FAZER] Estados de foco visíveis em TODigos os interativos; testar Tab do topo ao rodapé.
**Low-vision:**
- [FEITO] Contraste: escurecer `--fg-2` e o contador `.dt-count` pra passar AA (4.5:1).
- [A FAZER] `prefers-contrast: more` opcional.
**Surdo:** sem áudio/vídeo no site → sem necessidade de legenda hoje. Manter (se entrar vídeo, legendar).
**Motion:** `prefers-reduced-motion` já respeitado amplamente; revisar novos componentes.

## 5. Rodadas de validação
- axe-core headless a cada rodada (home + sobre + processo + capítulo).
- Teclado manual (Tab/Shift-Tab/Enter/setas) — descrever fluxo.
- Meta: 0 violação axe séria + navegação 100% por teclado + leitura coerente no leitor.

## Status desta rodada
Sobre reescrito; aria do rotw corrigido; skip-link; contraste de tokens. Re-auditado com axe. Próximo: projetos verticais no mobile + tablet + passe profundo de teclado/leitor.

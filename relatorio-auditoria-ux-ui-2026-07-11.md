# Auditoria UX/UI — Volume (Portfólio) · 2026-07-11

> Skill: `design-portfolio-audit` (papel: hiring manager sênior de product design, 15+ anos).
> Calibração: **alvo sênior / mercado internacional** (conforme referencias-portfolios-senior-internacional.md e objetivo declarado).
> Material: código-fonte completo (5 mil linhas lidas) + build local renderizado, ~50 screenshots em desktop 1440, tablet 768 e mobile 390, incluindo estados com scroll, modo tinta e 404.
> Nota combinada: além da leitura de hiring manager, esta rodada é um passe de especialista UX + UI (dobras, espaçamento, botões, micro-interações), como pedido.

---

## 1. Executive summary — o veredito honesto

**O conceito e o craft visual estão em outro nível; a camada de evidência e três decisões de "porta de entrada" ainda derrubam a leitura de sênior.**

Se eu triasse este portfólio hoje para uma vaga **pleno**: passa com folga, provavelmente no topo da pilha — o site é distintivo, coerente, rápido, acessível, e o argumento "desenho E construo" é raro e crível, porque o próprio site é a prova.

Se eu triasse para **sênior/internacional** (o alvo real): **ainda não passa**, e por motivos que não são estéticos:

1. **O hero me diz "Pleno"** — literalmente, na primeira linha lida (`splash-id`: "UX / PRODUCT DESIGNER · PLENO"), e de novo no Quem Sou. Recrutador calibra para baixo no segundo 1. Ninguém que mira sênior deve se rotular pleno na capa; deixa o trabalho calibrar.
2. **A primeira ação que o site me oferece leva à página mais fraca.** O coverflow abre focado em Rodapé (CAP. 01): capa cinza de retícula, premissa em colchetes, botão primário desativado "[Vercel]", solução com 3 placas vazias. O CTA mais forte da home entrega o capítulo mais vazio. Os CAP. 01–03 (Rodapé, Remoctrl, Traxium) estão todos sem capa e sem imagem.
3. **Nenhum case fecha com número.** Todos os `resultado` terminam em `[confirmar métricas]`. A pesquisa que você mesmo tem no repo diz: é o critério nº 1 de senioridade. (Sei que os placeholders estão em preenchimento — o ponto de auditoria aqui é de **priorização**: entre polir mais UI e fechar 2 números reais, os números valem mais.)

A distância é menor do que parece: o "contêiner" já é sênior; falta o conteúdo de evidência e ~10 correções cirúrgicas listadas abaixo — inclusive **4 bugs reais que encontrei** (template renderizando texto real como placeholder, gutter lateral zerado nos capítulos em telas ≤1240px, hero quebrado no modo tinta, e a pill de nav que some ao entrar num capítulo).

---

## 2. O que está genuinamente bom (manter e amplificar)

- **Identidade inconfundível.** Capa vermelha + P&B + vermelho só na interação é um sistema de cor com tese ("cor é intenção"), executado com disciplina rara. Nenhum template parece com isso. Em Awwwards-land, isso é o que separa "site de designer" de "site que prova design".
- **A metáfora serve à leitura, não o contrário.** Sumário como estante, capítulos com tobira-e, SFX kana com romaji, posfácio "Atogaki", 404 "página em branco" com シーン/SHIIN — é tematização consistente sem quebrar a navegação. O 404 é a melhor página de erro que vi em portfólio BR.
- **Sistema de design real** ([colors_and_type.css](volume/colors_and_type.css)): tokens de cor/tipo/espaço (`--ma-*` como "ma" 間), strokes, motion com curvas nomeadas (`--cut`, `--cut-in`). Isso É um sinal de senioridade sistêmica — hoje escondido no código. 
- **Estrutura de case certa.** TL;DR (Papel/O quê/Resultado) → Problema → **Decisões com "porque"** → Solução → Resultado. O bloco "As decisões: o porquê de cada corte" é exatamente o que hiring manager procura (trade-offs nomeados). PCYES, Odex e Checkout Oderço já têm decisões dignas de entrevista ("frete CIF/FOB", "crédito RMA", "regras que só o time interno sabe").
- **A11y acima da média** e verificada: skip-link, focus ring visível, focus management de SPA, tab order, reduced-motion em tudo, WCAG 2.2.2 no texto rotativo, contraste auditado por view. Quase nenhum portfólio faz isso — e é argumento de venda (ver §5, fix S3).
- **Perf tratada:** WebP, fontes via link, boot pulado em revisita, hash routing com deep link e título por view, OG/JSON-LD completos.
- **Copy com voz.** "Entrego o produto, não só o Figma", "Uso IA como uso régua", "Hora vira dado, não discussão". O Posfácio é humano sem ser cringe. A regra anti-travessão deixou o texto natural.
- **Micro-momentos:** hanko no "Fale comigo", seal spin no hover da marca, underline que varre nos links, botões com sombra dura que "carimbam" no clique (`translate(6px,6px)` + sombra 0). O vocabulário de botão é coeso.

---

## 3. O que está fraco ou machucando, por impacto (com página e linha)

### 🔴 Impacto alto

**W1 · Auto-rótulo "Pleno" no hero e no Quem Sou.**
[Capa.jsx:123](volume/Capa.jsx#L123) (`· Pleno`) e [Capa.jsx:386](volume/Capa.jsx#L386) ("UX/Product Designer pleno"). Anuncia o teto antes do trabalho falar. Corte o nível do site inteiro; se quiser um qualificador, use posicionamento ("Product Designer · design e código") — nunca senioridade.

**W2 · Porta de entrada aponta para o vazio.**
Rail abre em Rodapé (cinza) e os 3 primeiros capítulos não têm capa ([data.jsx:717-719](volume/data.jsx#L717-L719), sem `cover`). No mobile é pior: a lista vertical mostra ~11 de 19 cartões como retícula cinza idêntica — parede de "em construção". Curadoria mínima já resolve o desktop: abrir o rail focado num projeto com capa real (PCYES/Odex/Kitamo) enquanto as capas dos CAP. 01–03 não existem.

**W3 · Bug: conteúdo real renderizado como placeholder.**
[Capitulo.jsx:22-24](volume/Capitulo.jsx#L22-L24) — o Tobira envolve `premise` e `role` em `<PH>` **sempre**. A premissa real da PCYES ("Vender hardware pra quem entende…") aparece em colchetes, cinza, com tracejado de "preencha-me" — em TODOS os capítulos, inclusive os 5 principais. Para o leitor, os seus melhores cases parecem inacabados mesmo estando prontos. Fix: usar `renderPH()` como o resto do template faz.

**W4 · Bug: capítulos sem gutter lateral em ≤1240px.**
[chapter.css:49](volume/chapter.css#L49) `.chapter-body { padding: var(--ma-6) 0 var(--ma-5); }` zera o padding lateral que o `.shell` dá. Em 1440 o max-width disfarça; em tablet/mobile "As decisões", "A solução", TL;DR e cards colam na borda da tela (verificado: `getBoundingClientRect().left === 0` em 390px). Fix de 1 linha: `padding: var(--ma-6) var(--gutter) var(--ma-5)`.

**W5 · Nenhum resultado mensurável (padrão em 14/14 cases).**
Todos os `resultado` fecham em `[confirmar]`. Prioridade de conteúdo: **2 cases com número real batem 14 sem**. Onde não houver número, use o reframe da skill: "descoberta X que usei para justificar decisão Y, adotada por Z como direção" (ex.: PCYES tem material para isso com o mapa de calor: "o calor mostrou que ninguém via a seção N → cortei → cliques em M subiram" — mesmo direcional já é evidência).

**W6 · Botão primário morto na capa dos capítulos.**
`ProtoLinks` renderiza "VER PROTÓTIPO [Vercel]" desabilitado quando não há link ([data.jsx:882-888](volume/data.jsx#L882-L888)). Um primário vermelho não-clicável na dobra principal parece quebrado — e ~9 capítulos estão assim. Regra melhor: só renderizar o que existe; sem links = não mostrar botão nenhum na capa (o TL;DR segura a dobra).

### 🟠 Impacto médio

**W7 · Coverflow esconde o acervo (custo de interação alto).**
1 projeto visível por vez, 19 no total; recrutador de triagem não aperta seta 18 vezes. O mobile já tem a resposta certa (lista). No desktop, mantenha o coverflow como momento, mas dê um **índice compacto** logo abaixo (grade "todos os 19" com título+domínio, tipo sumário de mangá de verdade — números de página incluídos) ou um toggle grade/estante.

**W8 · Problema e Resultado com placas gigantes vazias.**
No template ([Capitulo.jsx:65-82, 159-176](volume/Capitulo.jsx#L65)), Problema dá 7 colunas para uma retícula cinza e 5 para o texto; Resultado idem. Mesmo no case mais forte (PCYES, com 3 screenshots reais na Solução), as duas dobras mais importantes do argumento são 60% vazio. Exatamente onde o payoff deveria estar (falha clássica da checklist). Sugestões sem depender de imagem nova: Problema → painel tipográfico (a premissa em Anton grande, estilo painel de mangá com a fala) ou artefato de contexto; Resultado → painel de destaque com o número/aprendizado em display (stat panel), não imagem.

**W9 · Modo tinta quebra o hero.**
Com `html.ink`, `.splash-h` usa `var(--paper)` que virou #161310 → título quase preto sobre vermelho, ghost "Designer" invisível, pill do RotateWord clara com texto escuro ([app.css:199-203](volume/app.css#L199-L203) vs [app.css:1018-1029](volume/app.css#L1018-L1029)). A capa deveria ser idêntica nos dois modos ("a capa continua vermelha"): fixe as cores do splash em literais (#F6F3EC / #0A0A0A) em vez de tokens invertíveis.

**W10 · Rotas-armadilha para conteúdo 100% placeholder.**
- Na página do Grupo Oderço, "Projetos por aqui" inclui **Tonante** → `synthChapter` inteiro em colchetes (Tonante está `hidden` do rail justamente por não ter conteúdo, mas continua alcançável por aqui; [data.jsx:677](volume/data.jsx#L677)).
- **TT&T** tem página própria com os 3 beats em placeholder e zero projetos — e é linkável do Quem Sou/Posfácio. Enquanto não preencher: tirar TT&T do ciclo de cards clicáveis (deixar como etapa da timeline, sem página) e tirar Tonante do `related`.
- **4YU** é um capítulo esqueleto no rail (problema/decisões/resultado todos em colchetes). Tirar do rail até ter conteúdo: 18 capas > 1 capa oca.

**W11 · Processo: 6 frases por ~5 telas de scroll.**
6 passos × 82vh para ~70 palavras, com painel repetido (número + retícula + blob). O formato scrollytelling promete um artefato por passo e entrega o mesmo painel 6×. Ou reduza o custo (≈56vh/passo) e acrescente **um recap estático** dos 6 passos no fim (quem escaneia lê tudo em 5s), ou dê a cada passo um artefato real (mini-print: rabisco → wireframe → protótipo → demo → corte → produção). O recap é a versão barata e resolve.

**W12 · Falta o caminho do recrutador: CV + e-mail visível.**
Não existe CV/resume em PDF em lugar nenhum; o e-mail só aparece como link "E-MAIL" no rodapé; o contato primário é WhatsApp (ótimo para freela BR, estranho para recrutador internacional). Adicione: "CV (PDF)" no nav ou no Colofão + e-mail por extenso no rodapé + LinkedIn promovido. Custo baixíssimo, é o item que recrutador procura em 10s.

### 🟡 Impacto baixo (polimento)

- **W13** · Pill de nav some ao entrar num capítulo com a página já rolada (quirk conhecido; [Capa.jsx:11-25](volume/Capa.jsx#L11-L25)). Fix seguro: resetar `hidden=false` e `last=window.scrollY` quando `view` muda.
- **W14** · Blob orgânico órfão no Posfácio ([Posfacio.jsx:62](volume/Posfacio.jsx#L62)) flutua sozinho entre empresas e certificados — lê como mancha, não como intenção. Ancorar (ex.: junto do título "Certificados") ou remover.
- **W15** · `FilterBar` usa `role="tablist"`/`aria-selected` sem tabpanel ([Capa.jsx:346-356](volume/Capa.jsx#L346-L356)) — mesmo padrão que você já corrigiu no Processo (trocar para `role="group"` + `aria-pressed`/`aria-current`).
- **W16** · `.emp-meta` repete "Papel" = mesmo texto do subtítulo logo acima (Empresa). Trocar a célula por algo novo (ex.: "Marcas: 7" na Oderço).
- **W17** · Beat panels não têm safety-timer como o Brush tem: se o IntersectionObserver não disparar (impressão/leitores/edge cases), Problema/Decisões/Resultado ficam opacity 0. Adicionar timeout de segurança no `Beat` ([data.jsx:807-814](volume/data.jsx#L807-L814)).
- **W18** · Boot de 1s no primeiro acesso ([app.jsx:181](volume/app.jsx#L181)): o recrutador paga 1s para ver um selo pulsar. 600ms dá o mesmo teatro pela metade do preço.
- **W19** · 8 famílias de fonte carregadas (Anton, Bangers, Cinzel, Reggae One, Yuji Mai, Oswald, Hanken, Caveat). Bangers é só fallback de SFX e Cinzel só numerais — candidatas a corte/subset.
- **W20** · Diferencial (home): coluna esquerda com vazio grande abaixo do statement em 1440. Oportunidade de encher com sinal real: **fileira de logos** (PCYES · Odex · Locarmais · Vinik · Isabella — os PNGs já existem em `volume/assets/marcas/`) com kicker "Marquei presença em". Credibilidade instantânea na primeira dobra de papel.
- **W21** · Próximo capítulo (fim do case) é só texto; um thumbnail da capa do próximo daria continuidade de "virar página" e mais cliques.
- **W22** · Idioma: site 100% PT-BR com alvo internacional declarado. Não é bug, é decisão estratégica pendente — sem versão EN, o funil internacional morre no primeiro parágrafo. (Grande demais para "esta semana"; fica registrado como épico.)

---

## 4. A maior oportunidade perdida

**O site é a prova de senioridade sistêmica — e não conta essa história.** Existe um design system real com tokens nomeados, tese de cor, escala "ma", motion language, modo tinta, a11y auditada por view e pipeline próprio de build. Isso é exatamente o "systems-level scope" que separa sênior de pleno e que falta em 90% dos portfólios — e hoje só quem lê o CSS descobre. O CAP. 05 (Portfólio) fala da metáfora, mas não mostra o sistema: uma dobra "O sistema por trás do volume" (paleta como especificação, tokens de espaçamento, antes/depois do axe, decisão do coverflow com a exceção WCAG documentada) transformaria o capítulo mais meta em o mais sênior do volume — com material que já existe.

---

## 5. Plano priorizado (esforço → impacto)

### Sprint 1 · Cirurgia (½ dia, quase tudo 1-linha) — fazer já
| # | Fix | Onde | Impacto |
|---|-----|------|---------|
| S1.1 | Remover "· Pleno" do splash-id e "pleno" do Quem Sou | Capa.jsx:123, 386 | Reposiciona a leitura inteira |
| S1.2 | `renderPH()` em premise/role do Tobira (bug W3) | Capitulo.jsx:22-24 | 14 capas deixam de parecer inacabadas |
| S1.3 | `padding: var(--ma-6) var(--gutter) var(--ma-5)` (bug W4) | chapter.css:49 | Conserta tablet+mobile de todos os capítulos |
| S1.4 | Rail abre focado em capa real (PCYES) enquanto CAP.01–03 não têm capa | Capa.jsx (FocusRail `active` inicial) | Primeira impressão do acervo |
| S1.5 | ProtoLinks: não renderizar botão sem URL (fim do primário morto) | data.jsx:874-891 | Capa dos capítulos para de "parecer bug" |
| S1.6 | Tirar 4YU do rail; tirar Tonante do `related` da Oderço; TT&T sem página até ter texto | data.jsx | Fecha as rotas-armadilha |
| S1.7 | Hero do modo tinta com cores literais (bug W9) | app.css | Modo tinta digno de demonstrar |
| S1.8 | Reset do `hidden` do Nav na troca de view (W13) | Capa.jsx | Mata o quirk conhecido |
| S1.9 | Blob órfão do Posfácio: ancorar ou remover (W14) | Posfacio.jsx:62 | Ruído visual a menos |

### Sprint 2 · Evidência (o trabalho que mais valoriza, depende de você)
1. **Capas reais para Rodapé, Remoctrl e Traxium** (tem print do Traxium em casa; Remoctrl/Rodapé = screenshot do app). Se não houver print: capa tipográfica desenhada por projeto (título + kana + padrão), nunca a retícula genérica.
2. **2 números reais** (PCYES conversão/heatmap; Rodapé downloads; Kitamo usuários) + reframe de insight nos cases sem número (W5).
3. **CV PDF + e-mail visível + LinkedIn promovido** no Colofão/nav (W12).
4. Preencher os beats da Oderço/Locarmais (páginas de empresa hoje são 2/3 colchetes).

### Sprint 3 · Dobras e experiência (1–2 dias de design)
1. **Índice compacto sob o coverflow** no desktop (grade/sumário com os 19, estilo índice de tankōbon) — resolve o custo de interação sem matar o momento (W7).
2. **Painel de Resultado = stat panel** (número/aprendizado em Anton display) e Problema sem placa vazia (W8).
3. **Recap estático dos 6 passos** no fim do Processo + reduzir 82vh→~56vh por passo (W11).
4. **Fileira de logos de marcas** na dobra do Diferencial (W20, assets já existem).
5. **Thumbnail no "Próximo capítulo"** (W21).
6. Dobra **"O sistema por trás do volume"** no CAP. 05 (§4) — o upgrade de senioridade mais barato que existe neste repo.

### Backlog estratégico
- Versão EN (W22) — pré-requisito real do funil internacional.
- Safety-timer no Beat (W17), boot 600ms (W18), dieta de fontes (W19), FilterBar semântica (W15), célula duplicada emp-meta (W16).

---

## 6. Nota por página (leitura de 5 segundos → detalhe)

| Página | 5s | Nota | Resumo |
|---|---|---|---|
| Home / Capa | "Isso é diferente. Quem fez sabe." | 8.5/10 | Hero excelente; cai no rail cinza e no "Pleno" |
| Capítulo (template) | Estrutura de case séria | 7/10 | TL;DR+Decisões fortes; PH-bug, gutter-bug, placas vazias |
| CAP. PCYES | Melhor case do volume | 8/10 | Decisões com dado; falta o número final |
| CAP. Odex / Checkout | Conhecimento de domínio real (B2B, NF, RMA) | 8/10 | Idem: fecham sem métrica |
| CAP. Rodapé/Remoctrl/Traxium | "Em construção" | 4/10 | São os CAP. 01–03 — hoje são o cartão de visita invertido |
| Processo | Bonito, caro de rolar | 6.5/10 | 6 frases/5 telas; painéis repetidos |
| Posfácio | A melhor voz do site | 8.5/10 | Foto placeholder, certificados sem link, blob órfão |
| Empresa Oderço | Boa estrutura | 6/10 | 2/3 dos beats em colchetes; Tonante-armadilha |
| Empresa TT&T | Página vazia | 3/10 | Esconder até ter conteúdo |
| 404 | Deliciosa | 9.5/10 | シーン. Perfeita |
| Modo tinta | Ideia ótima | 6/10 | Hero quebrado (W9); rail escuro demais |
| Mobile geral | Lista > coverflow, boa decisão | 7/10 | Gutter-bug nos capítulos; parede de cartões cinza |

---

## 7. Fechamento

Você está mais perto do que a embalagem sugere — e neste caso a embalagem é o ponto forte: o "contêiner" já compete com portfólio internacional de referência (distintivo, com tese, tecnicamente sério). O que falta não é talento nem UI: é **curadoria de porta de entrada** (Sprint 1, meio dia de correções cirúrgicas) e **evidência** (Sprint 2: capas reais + 2 números). Feitos esses dois, este portfólio deixa de ser "promissor com placeholders" e vira o que ele já quer ser: a prova, lida como um volume.

*Evidências: ~50 screenshots em `/tmp/.../scratchpad/shots/` (home/capítulos/processo/sobre/empresa/404 × desktop/tablet/mobile + ink + estados de scroll). Bugs verificados no build local servido de `dist/`.*

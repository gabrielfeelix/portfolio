# Handoff — 29/08/2026, noite

Sessão longa, tudo **commitado e no ar** em `bf26a57` (push direto em `main`,
que é de onde o 4yu.com.br publica). Comece daqui, não da conversa.

Leia antes: `docs/HANDOFF.md` (como trabalhar aqui, regras duras, armadilhas) e
`docs/O-QUE-FALTA.md` (o único arquivo de pendência). Este aqui é só o resumo
desta sessão mais o que o Gabriel pediu para a próxima.

**Regra do repositório que vale para tudo:** comentário explica o PORQUÊ, com
número medido. Não escreva "melhora a performance" — escreva o que você mediu.

---

## A referência desta sessão

Tudo veio de **fuel.framer.website**, clonado em `~/dev/refs/fuel.framer.website`
(12 páginas) com os assets em `~/dev/refs/framerusercontent.com`. A análise com
todos os números medidos está em **`~/dev/refs/fuel-ANALISE.md`** — leia antes de
mexer em qualquer motion, ela poupa a remedição.

Stack de lá: Framer Motion + Lenis. SPA, zero reload entre rotas.

**Como medi, e o método importa mais que os números:** DOM instrumentado com
Playwright quadro a quadro, vídeo a 25fps, e ajuste de curvas por erro médio
contra os pontos medidos. Duas vezes eu errei por não fazer isso e o Gabriel
pegou:

1. Medi a hero da página de ITEM do fuel achando que era a da HOME. São
   animações diferentes. A da home é a que ele queria.
2. Usei `getBoundingClientRect` para achar texto cortado. **Ele não enxerga
   `clip-path`**, e o recorte real estava justamente ali. Só o pixel achou.

Se for medir de novo: **meça no pixel**.

---

## O que entrou em `bf26a57`

| área | o que mudou |
|---|---|
| tela de carregamento | **saiu inteira**. `site/decolagem.{js,html}` apagados. `index.html` servido caiu de 20,5KB para 5,8KB |
| scroll | **Lenis** (MIT) com `duration: 2.0` — valor medido, contra o default 1.0 da lib |
| lâmina diagonal | `skewY 0 → -7deg` + `translateY 0 → -220px`, na fronteira hero→corpo de toda página com hero |
| travessia | corte seco para o ink, ~120ms segurando, 850ms revelando. Saiu a lâmina vermelha |
| entrada de página | foto `scale 1.2 → 1` em 1,4s; texto subindo 6–10px em 0,6s, escalonado |
| revelação por scroll | **metade do tempo**: `dur` 1.2→0.6s, `passo` 0.12→0.07, deslocamento 24→12px |
| rodapé | uma dobra cheia, 1,00x da janela em todo desktop |
| descendentes cortados | três recortes, três mecanismos, todos corrigidos |

Detalhes que não são óbvios do diff:

- **`rolarPara()`** em `site/motion.js` é o único caminho para mover o scroll
  por código. O Lenis guarda alvo interno e `window.scrollTo` não o atualiza —
  a página de caso abria no meio por isso. Não volte a chamar `scrollTo` ou
  `scrollIntoView` direto.
- **`--v2-descida` é adimensional de propósito** (`.2`, não `.2em`). A janela do
  título de seção é um `<span>` que herda 16px do corpo; quem cresce é o `<h2>`
  dentro dela. Em `em` a folga saía 3,2px onde precisava de 17,6px.
- **A lâmina é `position: absolute`** e depende de um ancestral posicionado.
  Faltou `position: relative` no rodapé uma vez e ela nasceu no topo da PÁGINA,
  saturada, cortando a hero.
- **`usePalavra` é ligado ao progresso do scroll**, não ao relógio. Não entrou
  no acerto de velocidade porque não soma tempo.

---

## O bug do console: diagnosticado, e não é o que parece

`Unexpected token '<'`, duas vezes, em todas as rotas. **Localmente é artefato
do servidor estático** e pode ser ignorado: `python3 -m http.server` devolve o
`index.html` com 200 para `/_vercel/insights/script.js` e
`/_vercel/speed-insights/script.js`, e o navegador tenta parsear HTML como JS.
Esses dois caminhos só existem na Vercel.

**Mas medindo em produção apareceu um problema de verdade:**

```
https://4yu.com.br/_vercel/speed-insights/script.js  → 200  application/javascript   ✓
https://4yu.com.br/_vercel/insights/script.js        → 404  text/plain               ✗
```

O **Web Analytics não está habilitado** no projeto da Vercel. O Speed Insights
está. Consequência concreta: `dist/analytics.js` empilha eventos em
`window.vaq` esperando um script que nunca chega, então **todo `vtrack` está
sendo perdido em produção** — inclusive o rastreio de clique em canal de
contato (WhatsApp, e-mail, LinkedIn, Instagram, currículo), que é a única
medida de conversão que o site tem.

Não é código: é um botão no painel da Vercel (Project → Analytics → Enable).
Depois de ligar, confirme com o `curl` acima antes de dar por resolvido.

---

## O que o Gabriel pediu para a próxima sessão

Em ordem do que ele falou, não de prioridade — combine com ele.

### 1. Tirar o asset da lua

`volume/assets/lua.webp` está **untracked** e não é mais usado: era a lua da
tela de carregamento, que saiu. O `preload` dele já foi removido do template.
Só apagar o arquivo.

### 2. Diminuir o motion da seção PROCESSO na home

Ele descreveu como "muito lento, pesado, quero relaxar/diminuir". **Já está
localizado**, e a razão de ainda estar lento é específica:

`site/Home.jsx:547-559` define um `linha(i)` **local**, que escapou do acerto
global desta sessão. Ele ainda usa:

```js
initial: { opacity: 0, y: 16, filter: "blur(6px)" },
transition: { duration: 0.9, ease, delay: 0.1 + i * 0.05 },
```

Dois problemas: `0.9s` contra os `0.6s` que o resto do site passou a usar, e o
`blur(6px)`, que além de caro para o compositor é o que faz o movimento ler
como pesado. A régua logo acima (`Home.jsx:543`) também tem `duration: 0.9`.

Sugestão: usar `easeRevela` e `dur`/`passo` de `motion.js` como o resto, e
avaliar tirar o blur em vez de só encurtá-lo. Há um segundo blur igual em
`Home.jsx:648-649` — confira se é a mesma seção antes de mexer.

### 3. Melhorar a seção de "outros projetos"

Com **mockups e histórias de verdade**. Hoje é a fita de peças
(`.v2-fita-secao` em `Home.jsx`), que é uma faixa baixa que corre sozinha, sem
narrativa. Isso provavelmente **precisa de material do Gabriel** (arte e
texto) antes de virar código — trate como item da seção A do `O-QUE-FALTA.md`.

### 4. Melhorar a página PROCESSO inteira

Palavras dele: "tá muito simples hoje". Quer **componentes mais interessantes
de outras refs**. As refs já baixadas estão em `~/dev/refs/`: `bungee`,
`isabella-pires`, `launchfolio`, `porto-template`, `tabfolio`, `td-maxfolio`,
`viper-template` e agora `fuel`. Há análise comparativa em
`docs/ANALISE-REFS.md`.

Antes de escolher, pergunte a ele qual referência agrada — nesta sessão ele
apontou a fuel e a decisão ficou muito mais rápida do que teria sido eu
propondo.

### 5. Uma capa para a PROCESSO

Ele ainda **não sabe qual**. Não invente: é decisão dele, e depende do item 4.

---

## Estado da verificação, para você não refazer

Rodado ao fim da sessão, com `dist/` servido em `:8793`:

- 5 rotas (`/`, `/case/pcyes`, `/processo`, `/sobre`, `/blog`) montam, sem
  scroll horizontal, com e sem `prefers-reduced-motion`
- lâminas: 1 clara em toda página com hero, 0 no blog, 0 no rodapé
- nenhuma lâmina invade a área da hero em nenhuma rota
- rodapé em 1,00x da janela em 1280×620, 1440×900, 1512×850, 1920×1080 e
  2560×1440
- varredura de descendente cortado: **zero** em 1280, 1440 e 1920
- travessia: clique com a home em `scrollY 2608` abre a rota nova em `0` aos
  407ms e fica

Os scripts de medição ficaram no scratchpad da sessão e **não estão no repo**.
Se precisar deles de novo, os padrões que valem a pena reescrever são: varrer
texto cortado comparando a tinta real (`TextMetrics.actualBoundingBoxDescent`)
contra a caixa de padding do ancestral que recorta, e ajustar curva por erro
médio contra pontos medidos.

---

## Uma coisa sobre este clone

A memória do projeto avisa que **outra sessão trabalha no mesmo diretório**.
Nesta sessão isso apareceu: três mudanças que não eram minhas (os botões
"Falar comigo" de `Processo.jsx` e `Sobre.jsx` passando de e-mail para
WhatsApp) estavam no working tree desde o começo e entraram em `bf26a57`
junto — está dito no corpo do commit.

**Confira `git diff` por arquivo antes de commitar**, e não assuma que tudo que
está sujo é seu.

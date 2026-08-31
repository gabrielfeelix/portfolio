# Handoff — desempenho da home

Reescrito em 31/08/2026, depois da sessão que atacou o plano da versão
anterior deste arquivo. Lê-se sozinho. A meta do Gabriel é **no mínimo 85 no
celular**, e a última medição real do PageSpeed antes desta sessão foi **75**.

Leia antes, se for mexer: `docs/HANDOFF-PRERENDER.md` (por que o servidor
escreve o hero) e `docs/HANDOFF.md` (estado geral do site).

---

## 0. O que esta sessão descobriu, em uma frase

O LCP da home **nunca foi imagem**. É o `<p class="v2-hero-sub">`, texto puro,
e a quebra oficial do Lighthouse diz que 99% dele era **atraso de renderização**
— tempo com a página parada esperando CSS e thread principal. O remédio era
tirar o CSS do caminho crítico, e ele destravou uma segunda coisa que ninguém
tinha visto: **a troca de fonte criava um SEGUNDO candidato de LCP**.

---

## 1. Números, medidos nesta máquina

Duas gargantas, e as duas comparam os dois lados **no mesmo runner** — que é a
única comparação que vale.

### Garganta real por CDP (`npm run perfil:home`)

1,6 Mbps · 150ms RTT · CPU 4x · Pixel 5.

| | antes (commit `1cc3297`) | depois |
|---|---|---|
| FCP | 916ms | **404ms** |
| LCP | 916ms | **760ms** |
| CLS | 0 | **0** |
| bytes | 1.860 KB | 1.833 KB |
| app monta | 2,64s | 2,45s |

### Lighthouse local, mesmo runner

**Os números absolutos daqui não valem nada** — esta máquina dá TBT de 3.120ms
onde o PageSpeed dá 280ms. O que vale é o delta.

| | antes | depois |
|---|---|---|
| nota | 46 | **54** |
| FCP | 1,8s | **1,2s** |
| Speed Index | 4,7s | **3,4s** |
| LCP | 5,5s | **4,7s** |
| TBT | 3.120ms | **1.980ms** |
| CLS | 0 | 0 |
| a11y / práticas / SEO | 96 / 96 / 100 | **96 / 96 / 100** |

### A quebra da LCP, que era a pergunta em aberto

| | TTFB | atraso de carga | tempo de carga | atraso de render |
|---|---|---|---|---|
| antes | 12ms | — | — | **1.873ms** |
| depois | 9ms | — | — | **821ms** |

As duas colunas do meio estão vazias porque **LCP de texto não tem recurso**.
Toda a conta é TTFB + atraso de renderização, e por isso nenhuma otimização de
imagem ia mover o número. A auditoria `render-blocking` saiu de score 0 para
score 1.

### Projeção para o PageSpeed — ERRADA, ver seção 9

Esta seção previa 85 a 91. O PageSpeed real deu **64**, e a seção 9 conta o
que aconteceu e o que foi medido depois. A previsão também usava uma conta
errada: TBT de 280ms **não** vale 24,9 pontos, vale **22,06**. A curva do TBT
é p10=200ms, mediana=600ms, e para 280ms o score é 0,735, não 0,83.

---

## 2. O que foi feito, e por quê

Um item por vez, medindo entre eles.

### 2.1 O CSS da home entra embutido; o resto desce sem bloquear

`/site.css` eram 18 KB comprimidos que **bloqueavam a primeira pintura**. Na
garganta real começavam a baixar aos 200ms e só terminavam aos 813ms — 613ms
para o que a banda sozinha entregaria em 90. A diferença era disputa: os cinco
`<script defer>` somam quase 200 KB e saem no mesmo instante.

`buildCss()` agora corta a folha em duas metades **do mesmo arranjo**, num
único ponto da ordem:

- prefixo (`fontes+tokens+kit+shell+home`, 9 KB gz) → embutido no `<head>` de
  `index.html` e `en.html`;
- sufixo (`case+processo+sobre+blog+cursor`, 10 KB gz) → `/site-resto.css`,
  buscado com o truque de `media="print"`, sem bloquear;
- `site.css` continua existindo, prefixo + sufixo concatenados, e é o que
  `rota.html` serve — as outras rotas precisam do CSS de caso na primeira
  pintura.

**Não é "critical CSS"**: é a folha inteira da home, cortada por rota e não por
dobra. Por isso não existe FOUC possível — nenhuma regra que a home usa chega
depois. Era esse o risco que o plano anterior mandava levar ao Gabriel; ele
deixou de existir com esta forma de cortar.

**O corte quebrou coisa, e a quebra foi encontrada medindo, não lendo.** Duas
regras de `case.css` valiam para a home por vazamento:

- `.v2-dobra.v2-wrap { margin-top: var(--v2-s6) }`
- `.v2-dobra { margin-top: var(--v2-s5) }`, dentro de `@media (max-width:860px)`

As duas usam seletor que a `Secao` do kit também casa. Sem elas na primeira
pintura, **seis seções da home nasciam 64px acima e desciam depois: 384px de
deslocamento no celular**, ou seja CLS entregue de graça. As duas foram
movidas para `kit.css`, junto do `.v2-dobra` que as declara, mantendo a
posição relativa na cascata. O comentário de cada uma explica de onde veio.

### 2.2 `font-display: block` nas duas Switzer pré-carregadas

**Este é o achado da sessão e é o que estava escondendo os 1,6s de buraco
entre FCP e LCP na produção.**

Com o CSS embutido, a primeira pintura caiu para ~400ms — antes do Switzer,
que chega aos ~700ms. Com `swap`, o texto pintava na fonte de sistema e o
parágrafo do hero **crescia** na troca: 14.344px² viravam 15.255px². O Chrome
só registra candidato de LCP **maior**, então a troca criava um segundo
candidato — e esse repaint ficava preso atrás da montagem do React. Medido:

| `font-display` | FCP | LCP | CLS | veredito |
|---|---|---|---|---|
| `swap` (como estava) | 528ms | **5,78s** | 0 | o crescimento vira 2º candidato |
| **`block`** | 400ms | **760ms** | 0 | escolhido |
| `optional` | 396ms | 396ms | 0 | melhor número, mas o site inteiro fica na fonte de sistema em rede lenta — é design |

Só os pesos **400 e 700** mudaram, que são os dois pré-carregados. Os outros
seguem em `swap`: chegam depois de qualquer jeito, e esperar por eles seria
trocar texto visível por buraco sem ganho de LCP.

**O FCP não pagou nada por isso** porque quem pinta primeiro é o cromo em
Geist Mono, que continua em `swap`.

**Este é o único item da sessão que aparece na tela**, e está na seção 4.

### 2.3 Reserva métrica do Switzer

`site/fontes.css` ganhou faces `"Switzer reserva"`, geradas por
`npm run reserva:fonte` a partir das métricas reais dos `.woff2`, e o token
`--v2-font` passa a listá-la entre o Switzer e o `system-ui`. Ela existe para
os pesos que continuam em `swap` (500 e 600) e como rede de segurança se o
período de bloqueio de 3s do `block` estourar.

**Ressalva honesta**: `local("Arial")` **não resolve** neste contêiner — só
DejaVu existe aqui —, então a reserva está verificada apenas em teoria fora do
Linux. Ela nunca piora nada (quando não resolve, o navegador segue para o
`system-ui` de sempre), mas não conte com ela: quem conserta o LCP é o
`block` da 2.2. Rode `npm run reserva:fonte` de novo se trocar um `.woff2`.

### 2.4 O espelho inglês saiu do caminho das páginas portuguesas

`volume/i18n.jsx` tinha 96 KB, e 93 deles eram o bloco `if (LANG === "en")` com
os espelhos do conteúdo. **Toda visita em português baixava 29 KB comprimidos
e mandava o V8 parsear treze objetos grandes para jogar fora.**

O bloco virou `volume/i18n.en.jsx`, script clássico separado. `i18n.js` caiu de
**79.750 para 992 bytes**. A tag só entra em `en.html` e em `rota.html`
(`/en/case/pcyes` cai nele), e o `vm` do pré-render reproduz a mesma sequência.

Continua funcionando pelo mesmo mecanismo de sempre: `const` de topo de script
clássico vive no escopo global de script, compartilhado entre `<script>`
diferentes — é por isso que o espelho alcança o `CHAPTERS` de `data.js` por
referência nua. **Um `type="module"` ali quebraria isso em silêncio.**

### 2.5 `consent.js` passou a ser inline

Era o único `<script>` **síncrono** do site, e o custo não estava à vista:
script síncrono trava o parser, e script `defer` só executa quando o parser
chega ao fim do documento. Como o `consent.js` mora no fim do body, **depois**
das cinco tags de scripts, a rede dele entrava na frente da execução de todas
elas — terminava aos 951ms, e o app só começava depois.

São 2 KB comprimidos. Inline não custa ida à rede e a ordem de execução é
exatamente a mesma (ele continua antes do gtag, que é a razão de ele existir).
`dist/consent.js` deixou de ser gerado.

---

## 3. O que foi decidido NÃO fazer, e por quê

Isto vale tanto quanto a lista de cima.

### 3.1 Pré-carregar a capa do hero — **não**

Era o item 3.2 do plano anterior. **A medição derrubou a premissa**: o
elemento de LCP é texto, não a capa. Além disso a `<img>` do pôster **já tem
`fetchpriority="high"`** (`site/Home.jsx`), e a documentação do Chrome é
explícita em que, para imagem que já está no HTML servido, `fetchpriority` no
próprio `<img>` é melhor que `preload` — o pré-render põe a capa no HTML desde
o commit `f7d7ac4`, então o preload scanner já a encontra. Somar um preload de
imagem só faria ele disputar com os dois preloads de fonte, que agora são
exatamente quem segura o LCP.

### 3.2 Adiar o download do `site-resto.css` para depois da montagem — **não**

Testado: LCP de 760ms contra 744ms, dentro do ruído, e as fontes terminam no
mesmo instante nas duas variantes. Em troca abriria uma janela real entre a
montagem do app e a chegada da folha em que clicar num caso renderiza a página
sem estilo. Ganho nulo, risco não-nulo.

### 3.3 Quebrar o `app.js` por rota — **não, e provavelmente não precisa**

São 111 KiB de JS não usado na home (`Case`, `Processo`, `Sobre`, `Blog`,
`Post` viajam junto), e é o maior item que sobrou. Mas:

- exige trocar `format: "iife"` por `esm` + `splitting`, e o esbuild ainda tem
  arestas abertas nisso (chunks minúsculos, CSS duplicado com import dinâmico);
- mexe na ordem das tags, que é contrato documentado e quebra em silêncio;
- o TBT já caiu 37% sem tocar nele, e a projeção chega a 85 sem ele.

Se um dia for preciso, **o caminho de menor risco não é o `splitting` do
esbuild**: é um segundo bundle IIFE (`rotas.js`) que se registra num global e
que o roteador injeta sob demanda, com `rota.html` trazendo os dois desde o
começo. Isso conversa com a arquitetura de scripts clássicos que o site já tem.

### 3.4 Aumentar o TTL de cache — **não**

O audit está marcado "fora da pontuação" e só afeta visita repetida. Os nomes
de arquivo não têm hash, então subir o TTL significa que trocar uma imagem sem
renomear deixa gente vendo a antiga por um mês. Mesma conclusão do plano
anterior, mantida.

### 3.5 `width`/`height` explícitos nas imagens — **não**

`unsized-images` continua falhando, mas **é auditoria de peso zero** na nota de
desempenho, e o CLS já está em 0. O ganho seria de robustez, não de nota, e
mexer no tamanho declarado de dezenas de `<img>` sem olhar cada layout é
exatamente o tipo de mudança que troca um número por um bug de desenho.

### 3.6 Reencodar as capas de projeto (188 KiB) — **não**

São as quatro `capa-home.webp` (76 a 99 KB), todas **abaixo da dobra e em
`loading=lazy`**: não tocam FCP nem LCP. O motivo dos 800px está em
`docs/HANDOFF.md` e não foi revisitado.

### 3.7 Trocar `clip-path` e `blur` por propriedades compostas — **não**

Muda o gesto. É design, e está na seção 4.

---

## 4. O que é decisão do Gabriel

1. **`font-display: block` nas duas Switzer pré-carregadas** (seção 2.2). É o
   único item desta sessão que aparece na tela. O preço é FOIT: se a fonte
   demorasse, o hero ficaria em branco até 3s, que é o teto do período de
   bloqueio do Chrome. São 16 e 19 KB pré-carregados, mesma origem, cache de
   um ano — mas o risco existe em rede muito ruim. **Reverter é trocar duas
   palavras em `site/fontes.css`**, e custa o LCP de volta a ~5,8s.
2. **O 1,4s do `useTardio`** (não mexido). Vale Speed Index. O SI já caiu de
   4,7s para 3,4s sem tocar na coreografia; encurtar o atraso renderia mais,
   mas é a entrada do hero.
3. **`clip-path` e `blur` nas animações**, 21 elementos não compostos.

---

## 5. Coisas confirmadas, para ninguém reinvestigar

- **`hero/capa.mp4` (1.148 KiB) não é baixado.** Confirmado em todos os traços
  desta sessão: só o `capa.webm` (834 KB) sai da rede. O mp4 aparece na tabela
  do PageSpeed mas é `<source>` para Safari, não fetch do Chrome.
- **O pôster É o primeiro quadro do vídeo.** Medido pixel a pixel: diferença
  média de 0,96 em 255. Isso importa porque o Speed Index compara cada quadro
  com o quadro FINAL — pôster diferente do vídeo penalizaria retroativamente a
  carga inteira. Não é o caso.
- **O contraste que a acessibilidade aponta é estado inicial de animação**
  (`.v2-declaracao-w` em `opacity: .06`), não cor mal escolhida. Continua 96,
  igual ao de antes desta sessão. Não "conserte" a cor de nada.
- **`errors-in-console` falha nos dois builds**, antes e depois. Não é
  regressão desta sessão.

---

## 6. Ferramentas — o que existe e para que serve

```
npm run dev             # servidor de dev (a porta sai no log, NÃO é fixa)
npm run build           # produção
npm run verifica:home   # o primeiro quadro do servidor bate com o do React?
npm run mede:home       # A/B do pré-render
npm run perfil:home     # NOVO — quebra de LCP, candidatos, CLS, tarefas longas
npm run compara:render  # NOVO — dois dist/, todas as rotas, três larguras
npm run reserva:fonte   # NOVO — regera as métricas da reserva a partir do woff2
```

`perfil:home` aceita uma ou duas pastas `dist/` e mede as duas no mesmo runner.
Para ter o "antes": `git worktree add /tmp/ref <commit> && cd /tmp/ref && node build.mjs`.

`compara:render` é a rede de segurança das mudanças de CSS. Ele compara caixa e
estilo computado de cada elemento, e não a foto — o hero tem vídeo e a entrada
é animada, então duas fotos do mesmo build já saem diferentes.
`ROTAS=/case/pcyes LARGURAS=desktop` reconfere uma combinação só.

### Armadilhas de medição, já pagas com tempo

- **Mate o servidor de dev antes de medir.** Ele reconstrói `dist/` em modo dev
  por cima do build de produção. E `npm run dev` **não** usa porta fixa: leia a
  porta no log e passe em `BASE=http://localhost:PORTA npm run verifica:home`.
- **`pkill -f <termo>` mata o próprio shell** se o termo aparecer na linha de
  comando dele. Use `ps -eo pid,args | grep "[b]uild.mjs"` e mate por PID.
- **`compara:render` tem um ruído conhecido e só um**: `.v2-outro-t`, o título
  do cartão de "outros capítulos", cuja lista é embaralhada por `Math.random()`
  em `Kit.jsx`. A ferramenta já ignora. Um segundo ruído aparece em
  `/case/pcyes` @desktop, num `margin: auto` — o build de referência comparado
  **consigo mesmo** também diverge ali, então é não-determinismo da página.
- **O Lighthouse local não é o runner do Google**, e a diferença é brutal: TBT
  de 3.120ms aqui contra 280ms lá. Para nota absoluta, só PageSpeed. Para
  delta, os dois lados no mesmo runner.
- O Lighthouse instalado por `npm i lighthouse` acha o Chrome do **Windows** no
  WSL e falha com "Unable to connect to Chrome". Aponte
  `CHROME_PATH=~/.cache/ms-playwright/chromium-*/chrome-linux/chrome`. Ele
  também deixa lixo em pastas com nome `C:\Users\...` na raiz do repositório —
  apague antes de commitar.

---

## 7. Invariantes que não podem cair

- **`npm run verifica:home` passa nos dois idiomas.**
- **`npm run compara:render` contra o commit anterior fecha limpo**, tirando os
  dois ruídos da seção 6. É o que impede uma mudança de CSS mexer no desenho
  sem ninguém ver.
- **`dist/rota.html` continua servindo tudo que não é a home**, com a folha
  inteira e com o espelho inglês.
- **A ordem das tags**: React → data → i18n → i18n.en → app.
- **`i18n.en.js` é script CLÁSSICO.** Módulo quebraria o escopo léxico
  compartilhado com `data.js`, e quebraria em silêncio.
- **O corte do CSS é num ponto só da ordem**, e `site.css` continua sendo
  literalmente `prefixo + sufixo`. Ele difere em 1 byte do `site.css` de antes
  do corte, porque agora são duas minificações em vez de uma — CSS equivalente,
  não arquivo idêntico. Quem prova a equivalência é `npm run compara:render`,
  não o tamanho do arquivo.
- **`useTardio` não volta para `opacity: 0`.**
- **O `strict` do `<LazyMotion>` fica.**
- **O piso de `aspect-ratio` em `.v2-fig-moldura` não sai** (commit `6545c2d`).
- **O `page_view` do GA4 continua manual** enquanto o site for SPA.

---

## 8. O que falta para fechar

1. **Rodar o PageSpeed celular em produção, duas vezes, e escrever o número
   aqui.** É a única medição que conta. Se não chegar a 85, o próximo item é o
   3.3 (quebrar o `app.js`), pelo caminho do segundo bundle IIFE.
2. **Conferir o computador**, que estava em 94.
3. **Decidir sobre o `font-display: block`** (seção 4, item 1).

---

## 9. O PageSpeed real deu 64, e o que a investigação achou

Escrito em 31/08/2026, depois do deploy do commit `c4c4764`.

### 9.1 As medições

PageSpeed celular, produção, duas rodadas seguidas da MESMA URL:

| | antes (75) | run 1 | run 2 |
|---|---|---|---|
| nota | 75 | **64** | **43** |
| FCP | 2,3s | 1,0s | 2,9s |
| SI | 6,0s | 3,4s | 7,7s |
| LCP | 3,9s | 3,7s | 4,8s |
| **TBT** | **280ms** | **1.240ms** | **1.830ms** |
| CLS | 0 | 0 | 0 |

Computador: 91 (era 94). Acessibilidade/práticas/SEO: 96/100/100, intactos.

**Duas rodadas do mesmo build discordam em 21 pontos.** Guarde isso: a
documentação oficial do Lighthouse só garante que "a mediana de 5 rodadas é
duas vezes mais estável que 1", e não publica desvio esperado para TBT. O 75
original também foi rodada única.

### 9.2 A causa: a janela do TBT, não trabalho novo

**TBT é somado da FCP até a TTI.** Isso está no código-fonte, não é
interpretação: `core/computed/metrics/total-blocking-time.js:21-22` — *"the sum
of all Blocking Time between First Contentful Paint and Interactive Time"* —
e os limites literais em `lantern/metrics/TBTUtils.js:7-8,16-17` são
`startTimeMs = FCP`, `endTimeMs = TTI`. O recorte por tarefa está em
`TBTUtils.js:35-46`, e o limiar de 50ms com overhang `duration - 50` em
`TBTUtils.js:4,52`.

Ou seja: **antecipar a FCP alarga a janela e passa a contar trabalho que antes
ficava de fora**, sem que nada tenha ficado mais lento. O commit puxou a FCP de
2,3s para 1,0s — 1,3s a mais de janela. O TBT subiu 960ms. Os números batem.

No modo simulado, que é o que o PageSpeed usa, agrava: o TBT sai de
`simulation.nodeTimings`, do grafo de dependência
(`lantern/metrics/TotalBlockingTime.js:22-46`). Deixar a rede mais rápida
agenda os nós de CPU mais cedo na linha simulada — e eles caem dentro da janela
que também abriu mais cedo. Os dois efeitos empurram na mesma direção.

### 9.3 A prova de que o commit não adiciona trabalho

Lighthouse em modo simulado (Lantern, a engine do PageSpeed), **5 rodadas de
cada lado, máquina ociosa**, os dois servidos do mesmo runner:

| | ref (`1cc3297`) | atual (`c4c4764`) | delta |
|---|---|---|---|
| nota | 52 | **54** | +2 |
| FCP | 1366 | 1207 | −159 |
| SI | 3515 | 3357 | −158 |
| LCP | 5046 | 4732 | −314 |
| **TBT** | **2073** | **2029** | **−44** |
| bootup (JS) | 5714 | 5729 | +15 |
| thread | 7588 | 7616 | +28 |

TBTs individuais: ref `1874 1945 2073 2238 2178` · atual `2049 1955 2284 1935
2029`. Mesma distribuição. `bootup` +15ms sobre 5,7s e `thread` +28ms sobre
7,6s é ruído.

Localmente a FCP só andou 159ms, e a janela (TTI − FCP) ficou em 6050 → 6016ms
— por isso o TBT local não se mexeu. No PageSpeed a FCP andou 1.300ms, porque
lá o `site.css` bloqueante custava muito mais. **É a mesma história, com a
janela abrindo de verdade só no runner deles.**

### 9.4 Acusações testadas e derrubadas

Quatro revisões independentes atacaram o commit. Uma achou um mecanismo real:
o `site-resto.css` promovido por `onload` obriga o navegador a parsear 62 KB e
recalcular estilo contra ~940 elementos, **depois** da FCP — trabalho que no
build antigo acontecia antes dela. Medido, 5 rodadas, garganta real:

| variante | FCP | LCP | TBT (janela da FCP) |
|---|---|---|---|
| como está (folha cortada) | 404ms | 768ms | **5,39s** |
| sem o `site-resto.css` (controle) | 400ms | 768ms | **5,52s** |
| folha inteira embutida | 440ms | **680ms** | **5,52s** |

A variante que **não carrega a folha de jeito nenhum** tem o mesmo TBT. O
mecanismo existe; a magnitude é ruído perto da montagem do React. Acusação
derrubada.

Achado lateral guardado: embutir a folha INTEIRA dá **LCP 88ms melhor** (some
da disputa de banda) ao custo de 36ms de FCP.

### 9.5 O tamanho real do problema

Curva do TBT (p10=200ms, mediana=600ms, peso 30%):

| TBT | pontos de 30 |
|---|---|
| 100ms | 27,9 |
| 200ms | 24,5 |
| **280ms (build antigo)** | **22,1** |
| 600ms | 15,0 |
| **1.240ms (agora)** | **8,2** |

Cada 100ms vale 3 a 4 pontos entre 200 e 900ms.

**Partindo da run 1 e mexendo só no TBT: 85 exige TBT ≈ 94ms. 90 é impossível
sem melhorar também o LCP.** O TBT nunca esteve bom — mesmo os 280ms deixavam
8 pontos na mesa. O que mudou foi ele ficar visível.

### 9.6 `startTransition` no render inicial — medido, NÃO subido

TBT só conta o que passa de **50ms por tarefa**. Uma tarefa de 2.500ms vale
2.450ms de TBT; as mesmas 2.500ms fatiadas em tarefas de 50ms valem zero. O
React 18 fatia render marcado como transição. Uma linha em `site/app.jsx`:

```jsx
const raiz = createRoot(alvo);
startTransition(() => raiz.render(<App />));
```

Lantern, 5 rodadas cada, distribuições sem sobreposição:

| | atual | com `startTransition` | delta |
|---|---|---|---|
| **nota** | 55 | **66** | **+11** |
| FCP | 1206 | 1205 | 0 |
| SI | 3291 | 3012 | −279 |
| LCP | 4691 | 3188 | −1503 |
| TBT | 1871 | 1645 | −226 |

Notas individuais: `54 54 55 55 55` contra `68 66 69 66 66`.

**Mas NÃO foi subido, por duas razões medidas:**

1. **O ganho de LCP é artefato do Lantern.** Na garganta real, FCP, LCP e CLS
   são idênticos (396/768/0 contra 400/768/0). O Lantern penaliza a tarefa
   longa; o navegador de verdade não, porque o elemento de LCP já está pintado
   pelo pré-render e a remontagem produz o mesmo tamanho. O ganho de TBT é
   real, o de LCP não.
2. **Ele puxa 521 KB de imagem que não deveria.** Com `startTransition`, as 11
   capas de "outros projetos" — abaixo da dobra, `loading=lazy` — são baixadas
   entre 5,6s e 8,4s. Sem ele, **nunca** são baixadas, nem numa janela de 25s.
   Isso contraria de frente o `semLazy` do `preRender()`, que existe
   exatamente para não puxar imagem de dobra no carregamento.

Verificado que ele NÃO quebra o pré-render: sondando o DOM a cada 8ms, o
`#v2-root` nunca fica vazio, o `<h1>` aparece no mesmo instante e a altura do
documento vai de 727 para 11292px no mesmo momento nos dois. Não há piscada.

**Próximo passo, se alguém retomar:** descobrir por que a montagem fatiada
dispara o lazy-load daquelas capas. A suspeita é que num quadro intermediário
o documento ainda está curto (727px) e o Chrome julga as imagens perto da
viewport. Se for isso, `width`/`height` explícitos nessas `<img>` — que o
PageSpeed já pede — resolvem os dois de uma vez, e o `startTransition` vira
+11 pontos limpos.

### 9.7 O corte do `app.js` foi medido e rende pouco

`app.js` sem `Case`, `Processo`, `Sobre`, `Blog` e `Post`: 276,7 KB → 188,2 KB
(−32%, −26 KB gz). Bate com os "111 KiB de JS não usado" do relatório. Medido
3 vezes com máquina ociosa: **TBT 6,22/5,92/5,32 contra 6,05/5,77/5,32.
Idêntico.** Só a montagem fica ~110ms mais rápida.

O motivo é V8: função que nunca é chamada não é compilada. O peso está no
RENDER de ~940 elementos, não no parse do código morto. **Continua valendo
como economia de rede (−26 KB gz), não como conserto de TBT.**

### 9.8 Como medir daqui pra frente

- **A cota que estourou é a anônima por IP.** Uma chave de API do Google Cloud
  (grátis, PageSpeed Insights API) sobe para 25.000/dia e permite tirar
  mediana de 5 rodadas, que é o que a variância deste site exige.
- **Lighthouse local em modo simulado é a mesma engine do PageSpeed** e serve
  para delta. Absoluto não: esta máquina dá TBT 4x o deles.
- **Máquina ociosa não é detalhe.** Três Chromium órfãos de um bisect que
  falhou ficaram rodando durante uma bateria inteira de medições e a
  invalidaram — a mesma variante deu 5,57s e 12,62s. Antes de medir:
  `ps -eo args | grep -c '[c]hrome-linux/chrome'` tem de dar 0.
- **Os deploys antigos existem na Vercel** (cada commit tem URL imutável), mas
  estão atrás do login: `Deployment Protection`. Liberar isso, ou gerar um
  *Protection Bypass for Automation*, permitiria medir build antigo e novo
  lado a lado no PageSpeed — que é a comparação que faltou.
